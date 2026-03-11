import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { normalizeAccountStatus } from "@/lib/auth/roles";
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

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const publicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, publicKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: SupabaseCookieOptions) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: SupabaseCookieOptions) {
        response.cookies.set({ name, value: "", ...options });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  let accountStatus = normalizeAccountStatus("active");
  let lastLogin: string | null = null;
  let forceLogoutAt: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("status,last_login,force_logout_at")
      .eq("id", user.id)
      .maybeSingle();

    accountStatus = normalizeAccountStatus(typeof profile?.status === "string" ? profile.status : "active");
    lastLogin = typeof profile?.last_login === "string" ? profile.last_login : null;
    forceLogoutAt = typeof profile?.force_logout_at === "string" ? profile.force_logout_at : null;

    // Invitation acceptance can create a session without passing through loginAction.
    if (accountStatus === "pending_invite" && pathname.startsWith("/dashboard")) {
      const nowIso = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update({
          status: "active",
          last_login: nowIso,
          force_logout_at: null
        })
        .eq("id", user.id);

      if (!error) {
        accountStatus = "active";
        lastLogin = nowIso;
        forceLogoutAt = null;
      }
    }
  }

  const mustForceLogout =
    Boolean(forceLogoutAt) &&
    (!lastLogin || new Date(lastLogin).getTime() <= new Date(forceLogoutAt as string).getTime());
  const isBlocked = accountStatus !== "active" || mustForceLogout;

  function getBlockCode(): string {
    if (mustForceLogout) return "session_revoked";
    if (accountStatus === "disabled") return "account_disabled";
    if (accountStatus === "pending_invite") return "account_pending";
    return "unknown";
  }

  if (pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard") && user && isBlocked) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", getBlockCode());
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/login") && user && isBlocked) {
    await supabase.auth.signOut();
    if (pathname === "/login") {
      const url = request.nextUrl.clone();
      url.searchParams.set("error", getBlockCode());
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (pathname === "/login" && user && !isBlocked) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/login/:path*", "/auth/callback"]
};
