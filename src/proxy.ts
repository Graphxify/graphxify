import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

type SupabaseCookieOptions = {
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | boolean;
};

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

async function getProfileSecurityState(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
) {
  let { data, error } = await supabase
    .from("profiles")
    .select("status,role,last_login,force_logout_at,disabled_until")
    .eq("id", userId)
    .maybeSingle();

  if (error && isMissingProfileColumnError(error, "disabled_until")) {
    ({ data, error } = await supabase
      .from("profiles")
      .select("status,role,last_login,force_logout_at")
      .eq("id", userId)
      .maybeSingle());
  }

  if (error) {
    throw error;
  }

  return data;
}

async function clearExpiredTimeout(userId: string): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    return;
  }

  await admin
    .from("profiles")
    .update({ status: "active", disabled_until: null, force_logout_at: null })
    .eq("id", userId);
  await admin.auth.admin.updateUserById(userId, { ban_duration: "none" });
}

export async function proxy(request: NextRequest) {
  const publicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pendingCookies: Array<{ name: string; value: string; options: SupabaseCookieOptions }> = [];

  function applyPendingCookies(response: NextResponse) {
    for (const { name, value, options } of pendingCookies) {
      response.cookies.set({ name, value, ...options });
    }
    return response;
  }

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, publicKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: SupabaseCookieOptions) {
        pendingCookies.push({ name, value, options });
      },
      remove(name: string, options: SupabaseCookieOptions) {
        pendingCookies.push({ name, value: "", options });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (pathname === "/admin" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  let userRole = "";

  if (user && pathname.startsWith("/dashboard")) {
    const profile = await getProfileSecurityState(supabase, user.id);
    const rawStatus = typeof profile?.status === "string" ? profile.status : "active";
    const lastLogin = typeof profile?.last_login === "string" ? profile.last_login : null;
    const forceLogoutAt = typeof profile?.force_logout_at === "string" ? profile.force_logout_at : null;
    const disabledUntil = typeof profile?.disabled_until === "string" ? profile.disabled_until : null;
    const disabledUntilMs = disabledUntil ? new Date(disabledUntil).getTime() : null;
    const now = Date.now();
    const timeoutActive = rawStatus === "disabled" && disabledUntilMs !== null && disabledUntilMs > now;
    const timeoutExpired = rawStatus === "disabled" && disabledUntilMs !== null && disabledUntilMs <= now;
    userRole = typeof profile?.role === "string" ? profile.role : "editor";

    if (rawStatus === "pending_invite") {
      const nowIso = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ status: "active", last_login: nowIso, force_logout_at: null, disabled_until: null })
        .eq("id", user.id);
      if (updateError) {
        if (isMissingProfileColumnError(updateError, "disabled_until")) {
          await supabase
            .from("profiles")
            .update({ status: "active", last_login: nowIso, force_logout_at: null })
            .eq("id", user.id);
        } else {
          throw updateError;
        }
      }
    } else if (timeoutExpired) {
      await clearExpiredTimeout(user.id);
    } else {
      const mustForceLogout =
        rawStatus !== "disabled" &&
        Boolean(forceLogoutAt) &&
        (!lastLogin || new Date(lastLogin).getTime() <= new Date(forceLogoutAt).getTime());
      const isBlocked = rawStatus === "disabled" || mustForceLogout;

      if (isBlocked) {
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        if (timeoutActive) url.searchParams.set("error", "account_timeout");
        else if (mustForceLogout) url.searchParams.set("error", "session_revoked");
        else if (rawStatus === "disabled") url.searchParams.set("error", "account_disabled");
        return applyPendingCookies(NextResponse.redirect(url));
      }
    }
  }

  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.delete("x-cms-uid");
  forwardedHeaders.delete("x-cms-role");
  if (user && userRole) {
    forwardedHeaders.set("x-cms-uid", user.id);
    forwardedHeaders.set("x-cms-role", userRole);
  }

  return applyPendingCookies(NextResponse.next({ request: { headers: forwardedHeaders } }));
}

export const config = {
  // NOTE: /api is included so inbound x-cms-uid/x-cms-role headers are stripped on API
  // routes too. Without this, a client could forge x-cms-role to escalate privileges.
  matcher: ["/dashboard/:path*", "/admin", "/admin/:path*", "/auth/callback", "/api/:path*"],
};
