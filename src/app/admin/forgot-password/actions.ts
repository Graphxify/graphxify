"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendBrandedPasswordResetEmail } from "@/lib/email/managed-notifications";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

async function hasAuthUser(email: string): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) {
    return false;
  }

  try {
    let page = 1;
    while (page <= 10) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) {
        logger.warn("Password reset auth user lookup failed", { email, error: error.message });
        return false;
      }

      if (data.users.some((user) => (user.email ?? "").toLowerCase() === email)) {
        return true;
      }

      if (data.users.length < 200) {
        break;
      }

      page += 1;
    }
  } catch (error) {
    logger.warn("Password reset auth user lookup threw", {
      email,
      error: error instanceof Error ? error.message : "unknown"
    });
  }

  return false;
}

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
    const originHeader = headerStore.get("origin");
    const forwardedProto = headerStore.get("x-forwarded-proto") ?? "https";
    const forwardedHost = headerStore.get("x-forwarded-host");
    const baseUrl = originHeader || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : "http://localhost:3000");
    const callbackUrl = new URL("/auth/callback", baseUrl);
    callbackUrl.searchParams.set("next", "/reset-password");
    const redirectTo = callbackUrl.toString();

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      logger.warn("Password reset request failed", { email, error: error.message });
    } else {
      const authUserExists = await hasAuthUser(email);
      if (authUserExists) {
        try {
          await sendBrandedPasswordResetEmail(email);
        } catch (sendError) {
          logger.error("Supplemental branded password reset email failed", {
            email,
            error: sendError instanceof Error ? sendError.message : "unknown"
          });
        }
      }
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
