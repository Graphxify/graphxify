"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { logger } from "@/lib/logger";

type LoginErrorCode = "rate_limited" | "invalid_credentials" | "auth_unavailable" | "email_not_confirmed" | "unknown";

function redirectLoginError(code: LoginErrorCode): never {
  redirect(`/login?error=${code}`);
}

function classifyAuthError(input: { message?: string; status?: number | null; code?: string | null }): LoginErrorCode {
  const message = (input.message ?? "").toLowerCase();
  const status = typeof input.status === "number" ? input.status : undefined;
  const code = (input.code ?? "").toLowerCase();

  if (status === 429 || message.includes("too many")) {
    return "rate_limited";
  }
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "email_not_confirmed";
  }
  if (
    code === "invalid_credentials" ||
    message.includes("invalid") ||
    message.includes("credentials") ||
    message.includes("password") ||
    message.includes("not found") ||
    status === 400 ||
    status === 401 ||
    status === 403 ||
    status === 422
  ) {
    return "invalid_credentials";
  }
  if (status !== undefined && status >= 500) {
    return "auth_unavailable";
  }
  return "unknown";
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    redirectLoginError("invalid_credentials");
  }

  const headerStore = headers();
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
    const code = classifyAuthError(signInError);
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

  try {
    await supabase.from("profiles").upsert({ id: data.user.id, email: data.user.email ?? email, role: "mod" });
  } catch (error) {
    logger.warn("Profile upsert failed during login", {
      userId: data.user.id,
      error: error instanceof Error ? error.message : "unknown"
    });
  }

  try {
    await logAuditEvent({
      actorId: data.user.id,
      actorEmail: data.user.email ?? email,
      actorRole: "mod",
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

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
