"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeAccountStatus, normalizeRole, type AppRole } from "@/lib/auth/roles";
import { rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { logger } from "@/lib/logger";

type LoginErrorCode =
  | "rate_limited"
  | "invalid_credentials"
  | "auth_unavailable"
  | "password_auth_disabled"
  | "email_not_confirmed"
  | "account_not_found"
  | "account_disabled"
  | "account_timeout"
  | "account_pending"
  | "session_revoked"
  | "unknown";

function redirectLoginError(code: LoginErrorCode): never {
  redirect(`/admin?error=${code}`);
}

function classifyAuthError(input: { message?: string; status?: number | null; code?: string | null }): LoginErrorCode {
  const message = (input.message ?? "").toLowerCase();
  const status = typeof input.status === "number" ? input.status : undefined;
  const code = (input.code ?? "").toLowerCase();

  if (status === 429 || message.includes("too many")) {
    return "rate_limited";
  }
  if (
    message.includes("email login is disabled") ||
    message.includes("email logins are disabled") ||
    message.includes("email provider is disabled")
  ) {
    return "password_auth_disabled";
  }
  if (
    message.includes("api key") ||
    message.includes("jwt") ||
    message.includes("project not found") ||
    message.includes("network") ||
    message.includes("fetch failed") ||
    message.includes("service unavailable") ||
    message.includes("unauthorized")
  ) {
    return "auth_unavailable";
  }
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "email_not_confirmed";
  }
  if (
    message.includes("banned") ||
    message.includes("temporarily unavailable") ||
    message.includes("not allowed at this time")
  ) {
    return "account_disabled";
  }
  if (
    code === "invalid_credentials" ||
    code === "invalid_login_credentials" ||
    message.includes("invalid") ||
    message.includes("credentials") ||
    message.includes("incorrect password") ||
    message.includes("email or password") ||
    (status === 400 && message.includes("password")) ||
    status === 422
  ) {
    return "invalid_credentials";
  }
  if (status === 401 || status === 403) {
    return "auth_unavailable";
  }
  if (status !== undefined && status >= 500) {
    return "auth_unavailable";
  }
  return "unknown";
}

function isMissingProfileColumnError(error: unknown, column: string): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  const message =
    "message" in error ? String((error as { message?: unknown }).message ?? "").toLowerCase() : "";

  return (
    code === "42703" ||
    code === "PGRST204" ||
    message.includes(column.toLowerCase()) ||
    message.includes("schema cache")
  );
}

async function inspectAuthUserState(email: string): Promise<"email_not_confirmed" | "account_not_found" | null> {
  const admin = createAdminClient();
  if (!admin) {
    return null;
  }

  try {
    let page = 1;
    while (page <= 3) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) {
        logger.warn("Auth user inspection failed", { error: error.message });
        return null;
      }
      const user = data.users.find((item) => (item.email ?? "").toLowerCase() === email.toLowerCase());
      if (user) {
        if (!user.email_confirmed_at) {
          return "email_not_confirmed";
        }
        return null;
      }
      if (data.users.length < 200) {
        break;
      }
      page += 1;
    }

    return "account_not_found";
  } catch (error) {
    logger.warn("Auth user inspection threw", {
      error: error instanceof Error ? error.message : "unknown"
    });
    return null;
  }
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirectLoginError("invalid_credentials");
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip") ?? "unknown";

  let limited = { allowed: true, remaining: 0, retryAfter: 0 };
  try {
    limited = await rateLimit({ key: ip, route: "auth-login", limit: 8, windowSec: 60 });
  } catch (error) {
    logger.error("Login rate-limit check failed", {
      error: error instanceof Error ? error.message : "unknown"
    });
    // Fail-open to avoid blocking auth if limiter backend is unstable.
  }
  if (!limited.allowed) {
    redirectLoginError("rate_limited");
  }

  const supabase = createClient();
  let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"] | null = null;
  let signInError: { message?: string; status?: number | null; code?: string | null } | null = null;

  try {
    const result = await supabase.auth.signInWithPassword({ email, password });
    data = result.data;
    if (result.error) {
      signInError = {
        message: result.error.message,
        status: (result.error as { status?: number }).status ?? null,
        code: (result.error as { code?: string }).code ?? null
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    signInError = { message };
    logger.error("Login sign-in failed", {
      email,
      error: message,
      code: classifyAuthError({ message })
    });
  }

  if (signInError) {
    let code = classifyAuthError(signInError);
    if (code === "invalid_credentials" || code === "unknown") {
      const inspected = await inspectAuthUserState(email);
      if (inspected) {
        code = inspected;
      }
    }
    logger.warn("Login rejected", {
      email,
      code,
      status: signInError.status ?? null,
      providerCode: signInError.code ?? null,
      message: signInError.message ?? ""
    });
    redirectLoginError(code === "unknown" ? "auth_unavailable" : code);
  }

  if (!data?.user) {
    redirectLoginError("unknown");
  }

  const nowIso = new Date().toISOString();
  let actorRole: AppRole = "editor";
  let forcePasswordReset = false;

  try {
    let { data: existingProfile, error: existingError } = await supabase
      .from("profiles")
      .select("id,role,status,force_password_reset,disabled_until")
      .eq("id", data.user.id)
      .maybeSingle();

    if (existingError && isMissingProfileColumnError(existingError, "disabled_until")) {
      ({ data: existingProfile, error: existingError } = await supabase
        .from("profiles")
        .select("id,role,status,force_password_reset")
        .eq("id", data.user.id)
        .maybeSingle());
    }

    if (existingError) {
      throw existingError;
    }

    if (existingProfile) {
      const normalizedStatus = normalizeAccountStatus(
        typeof existingProfile.status === "string" ? existingProfile.status : "active"
      );
      const disabledUntil =
        typeof existingProfile.disabled_until === "string" ? existingProfile.disabled_until : null;
      let effectiveStatus = normalizedStatus;
      actorRole = normalizeRole(typeof existingProfile.role === "string" ? existingProfile.role : "editor");
      forcePasswordReset = Boolean(existingProfile.force_password_reset);

      if (normalizedStatus === "disabled") {
        const disabledUntilMs = disabledUntil ? new Date(disabledUntil).getTime() : null;
        const timeoutExpired = disabledUntilMs !== null && disabledUntilMs <= Date.now();

        if (timeoutExpired) {
          effectiveStatus = "active";
          const admin = createAdminClient();
          if (admin) {
            await admin
              .from("profiles")
              .update({ status: "active", disabled_until: null, force_logout_at: null })
              .eq("id", data.user.id);
            await admin.auth.admin.updateUserById(data.user.id, { ban_duration: "none" });
          }
        } else {
          await supabase.auth.signOut();
          redirectLoginError(disabledUntilMs !== null ? "account_timeout" : "account_disabled");
        }
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          email: data.user.email ?? email,
          status: effectiveStatus === "pending_invite" ? "active" : effectiveStatus,
          last_login: nowIso,
          force_logout_at: null,
          disabled_until: null
        })
        .eq("id", data.user.id);
      if (updateError) {
        if (isMissingProfileColumnError(updateError, "disabled_until")) {
          const { error: fallbackUpdateError } = await supabase
            .from("profiles")
            .update({
              email: data.user.email ?? email,
              status: effectiveStatus === "pending_invite" ? "active" : effectiveStatus,
              last_login: nowIso,
              force_logout_at: null
            })
            .eq("id", data.user.id);
          if (fallbackUpdateError) {
            throw fallbackUpdateError;
          }
        } else {
          throw updateError;
        }
      }
    } else {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: data.user.email ?? email,
          role: "editor",
          status: "active",
          last_login: nowIso,
          force_password_reset: false,
          force_logout_at: null,
          disabled_until: null
        });
      if (insertError) {
        if (isMissingProfileColumnError(insertError, "disabled_until")) {
          const { error: fallbackInsertError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              email: data.user.email ?? email,
              role: "editor",
              status: "active",
              last_login: nowIso,
              force_password_reset: false,
              force_logout_at: null
            });
          if (fallbackInsertError) {
            throw fallbackInsertError;
          }
        } else {
          throw insertError;
        }
      }
      actorRole = "editor";
      forcePasswordReset = false;
    }
  } catch (error) {
    logger.warn("Profile sync failed during login", {
      userId: data.user.id,
      error: error instanceof Error ? error.message : "unknown"
    });
  }

  try {
    await logAuditEvent({
      actorId: data.user.id,
      actorEmail: data.user.email ?? email,
      actorRole,
      action: "auth.login",
      entityType: "profile",
      entityId: data.user.id,
      metadata: { source: "password" }
    });
  } catch (error) {
    logger.warn("Audit log failed during login", {
      userId: data.user.id,
      error: error instanceof Error ? error.message : "unknown"
    });
  }

  if (forcePasswordReset) {
    redirect("/reset-password?forced=1");
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin");
}
