import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
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

// Cookie that caches "userId:role" so subsequent navigations skip the profiles DB query.
// Also used to forward role to server components via x-cms-role header.
const PROFILE_COOKIE = "cms-ok";
const PROFILE_TTL = 300; // 5 minutes

export async function middleware(request: NextRequest) {
  const publicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Collect cookie mutations from Supabase (auth refresh etc.) — applied to final response
  const pendingCookies: Array<{ name: string; value: string; options: SupabaseCookieOptions }> = [];

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

  // ── Fast-path redirects ──
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Determine user role (for forwarding to server components) ──
  // Cached in cms-ok cookie as "userId:role" to avoid a DB round-trip on every request.
  // Only queries the DB on first load or after cookie expires (5 min TTL).
  let userRole = "";
  let newCookieValue: string | null = null;

  if (user && pathname.startsWith("/dashboard")) {
    const cmsOkValue = request.cookies.get(PROFILE_COOKIE)?.value;
    const cookieHit = cmsOkValue?.startsWith(user.id + ":");

    if (cookieHit) {
      // Role is in the cookie — no DB needed
      userRole = cmsOkValue!.slice(user.id.length + 1);
    } else {
      // Fetch profile to check status and get role
      const { data: profile } = await supabase
        .from("profiles")
        .select("status,role,last_login,force_logout_at")
        .eq("id", user.id)
        .maybeSingle();

      const rawStatus = typeof profile?.status === "string" ? profile.status : "active";
      const lastLogin = typeof profile?.last_login === "string" ? profile.last_login : null;
      const forceLogoutAt =
        typeof profile?.force_logout_at === "string" ? profile.force_logout_at : null;
      userRole = typeof profile?.role === "string" ? profile.role : "editor";

      // Accept pending invite users and mark them active
      if (rawStatus === "pending_invite") {
        const nowIso = new Date().toISOString();
        await supabase
          .from("profiles")
          .update({ status: "active", last_login: nowIso, force_logout_at: null })
          .eq("id", user.id);
        newCookieValue = `${user.id}:${userRole}`;
      } else {
        const mustForceLogout =
          Boolean(forceLogoutAt) &&
          (!lastLogin || new Date(lastLogin).getTime() <= new Date(forceLogoutAt!).getTime());
        const isBlocked = rawStatus === "disabled" || mustForceLogout;

        if (isBlocked) {
          await supabase.auth.signOut();
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          if (mustForceLogout) url.searchParams.set("error", "session_revoked");
          else if (rawStatus === "disabled") url.searchParams.set("error", "account_disabled");
          return NextResponse.redirect(url);
        }

        newCookieValue = `${user.id}:${userRole}`;
      }
    }
  }

  // ── Build final response with forwarded identity headers ──
  // x-cms-uid and x-cms-role are stripped from client requests then set by us,
  // so server components can trust them without a DB call or network round-trip.
  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.delete("x-cms-uid");
  forwardedHeaders.delete("x-cms-role");
  if (user && userRole) {
    forwardedHeaders.set("x-cms-uid", user.id);
    forwardedHeaders.set("x-cms-role", userRole);
  }

  const response = NextResponse.next({ request: { headers: forwardedHeaders } });

  // Apply Supabase auth cookie updates (token refresh etc.)
  for (const { name, value, options } of pendingCookies) {
    response.cookies.set({ name, value, ...options });
  }

  // Set/refresh the profile cache cookie
  if (newCookieValue) {
    response.cookies.set(PROFILE_COOKIE, newCookieValue, {
      maxAge: PROFILE_TTL,
      httpOnly: true,
      path: "/",
      sameSite: "lax"
    });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/login/:path*", "/auth/callback"],
  // Note: /monitoring (Sentry tunnel route) is excluded by default since it's not listed here
};
