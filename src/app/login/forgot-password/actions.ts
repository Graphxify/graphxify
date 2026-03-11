"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function forgotPasswordAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip") ?? "unknown";

  try {
    const limited = await rateLimit({ key: ip, route: "auth-reset", limit: 4, windowSec: 120 });
    if (!limited.allowed) {
      return { success: false, message: "Too many attempts. Please wait a few minutes and try again." };
    }
  } catch (error) {
    logger.error("Reset rate-limit check failed", {
      error: error instanceof Error ? error.message : "unknown"
    });
  }

  const supabase = createClient();

  try {
    const origin = headerStore.get("origin") ?? headerStore.get("x-forwarded-host") ?? "http://localhost:3000";
    const redirectTo = `${origin}/auth/callback?next=/login/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      logger.warn("Password reset request failed", { email, error: error.message });
    }
  } catch (error) {
    logger.error("Password reset request threw", {
      email,
      error: error instanceof Error ? error.message : "unknown"
    });
  }

  // Always return success to prevent email enumeration
  return {
    success: true,
    message: "If an account exists for this email, a password reset link has been sent. Check your inbox."
  };
}
