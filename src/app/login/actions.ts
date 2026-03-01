"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { logger } from "@/lib/logger";

function redirectLoginError(code: "rate_limited" | "invalid_credentials" | "auth_unavailable" | "unknown"): never {
  redirect(`/login?error=${code}`);
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    redirectLoginError("invalid_credentials");
  }

  const headerStore = headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip") ?? "unknown";

  try {
    const limited = await rateLimit({ key: ip, route: "auth-login", limit: 8, windowSec: 60 });
    if (!limited.allowed) {
      redirectLoginError("rate_limited");
    }
  } catch (error) {
    logger.error("Login rate-limit check failed", {
      error: error instanceof Error ? error.message : "unknown"
    });
    // Fail-open to avoid blocking auth if limiter backend is unstable.
  }

  const supabase = createClient();
  let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"];

  try {
    const result = await supabase.auth.signInWithPassword({ email, password });
    data = result.data;
    if (result.error) {
      const msg = result.error.message.toLowerCase();
      if (msg.includes("invalid") || msg.includes("credentials") || msg.includes("password")) {
        redirectLoginError("invalid_credentials");
      }
      if (msg.includes("too many")) {
        redirectLoginError("rate_limited");
      }
      redirectLoginError("auth_unavailable");
    }
  } catch (error) {
    logger.error("Login sign-in failed", {
      email,
      error: error instanceof Error ? error.message : "unknown"
    });
    redirectLoginError("auth_unavailable");
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
