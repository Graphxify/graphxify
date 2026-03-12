import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  type AccountStatus,
  type AppPermission,
  type AppRole,
  hasPermission as hasRolePermission,
  normalizeAccountStatus,
  normalizeRole
} from "@/lib/auth/roles";

export type AppProfile = {
  id: string;
  email: string;
  role: AppRole;
  rawRole: string;
  status: AccountStatus;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
  lastLogin: string | null;
  lastActivity: string | null;
  lastPasswordChange: string | null;
  forcePasswordReset: boolean;
  forceLogoutAt: string | null;
};

const DEFAULT_ROLE: AppRole = "editor";
const DEFAULT_STATUS: AccountStatus = "active";

export const getSessionUser = cache(async function getSessionUser() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

function hasRequiredRole(profile: AppProfile, roles: readonly AppRole[]): boolean {
  return roles.includes(profile.role);
}

export function hasPermission(profile: Pick<AppProfile, "role">, permission: AppPermission): boolean {
  return hasRolePermission(profile.role, permission);
}

function statusRedirect(status: AccountStatus): never {
  if (status === "disabled") {
    redirect("/login?error=account_disabled");
  }

  if (status === "pending_invite") {
    redirect("/login?error=account_pending");
  }

  redirect("/login");
}

function isMissingProfileColumnError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  const message =
    "message" in error ? String((error as { message?: unknown }).message ?? "").toLowerCase() : "";

  return (
    code === "42703" ||
    code === "PGRST204" ||
    message.includes("column") ||
    message.includes("schema cache")
  );
}

function toAppProfile(input: Record<string, unknown>, fallbackEmail: string): AppProfile {
  return {
    id: String(input.id),
    email: String(input.email ?? fallbackEmail),
    role: normalizeRole(typeof input.role === "string" ? input.role : ""),
    rawRole: String(input.role ?? DEFAULT_ROLE),
    status: normalizeAccountStatus(typeof input.status === "string" ? input.status : DEFAULT_STATUS),
    displayName: typeof input.display_name === "string" ? input.display_name : null,
    avatarUrl: typeof input.avatar_url === "string" ? input.avatar_url : null,
    createdAt: typeof input.created_at === "string" ? input.created_at : null,
    lastLogin: typeof input.last_login === "string" ? input.last_login : null,
    lastActivity: typeof input.last_activity === "string" ? input.last_activity : null,
    lastPasswordChange: typeof input.last_password_change === "string" ? input.last_password_change : null,
    forcePasswordReset: Boolean(input.force_password_reset),
    forceLogoutAt: typeof input.force_logout_at === "string" ? input.force_logout_at : null
  };
}

export const getCurrentProfile = cache(async function getCurrentProfile(): Promise<AppProfile | null> {
  // ── Fast path: use identity forwarded by middleware ──
  // Middleware sets x-cms-uid and x-cms-role after validating the session and profile.
  // Reading from headers + getSession() costs ~0ms vs getUser() (~50ms) + DB (~80ms).
  // getSession() is safe here because middleware already ran getUser() on this same request.
  const reqHeaders = await headers();
  const fwdUid = reqHeaders.get("x-cms-uid");
  const fwdRole = reqHeaders.get("x-cms-role");

  if (fwdUid && fwdRole) {
    const supabase = createClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session?.user?.id === fwdUid) {
      return {
        id: fwdUid,
        email: session.user.email ?? "",
        role: normalizeRole(fwdRole),
        rawRole: fwdRole,
        status: "active" as AccountStatus, // Middleware only sets headers for non-blocked users
        displayName: (session.user.user_metadata?.full_name as string | undefined) ?? null,
        avatarUrl: (session.user.user_metadata?.avatar_url as string | undefined) ?? null,
        createdAt: null,
        lastLogin: null,
        lastActivity: null,
        lastPasswordChange: null,
        forcePasswordReset: false,
        forceLogoutAt: null
      };
    }
  }

  // ── Fallback: full DB fetch ──
  // Used when headers are absent (non-middleware routes, API routes, etc.)
  const supabase = createClient();
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const fullProfileQuery = await supabase
    .from("profiles")
    .select(
      "id,email,role,status,display_name,avatar_url,created_at,last_login,last_activity,last_password_change,force_password_reset,force_logout_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  let data: Record<string, unknown> | null = (fullProfileQuery.data as Record<string, unknown> | null) ?? null;
  let error = fullProfileQuery.error;

  if (error && isMissingProfileColumnError(error)) {
    const fallbackQuery = await supabase
      .from("profiles")
      .select("id,email,role,created_at")
      .eq("id", user.id)
      .maybeSingle();

    data = (fallbackQuery.data as Record<string, unknown> | null) ?? null;
    error = fallbackQuery.error;
  }

  if (error) {
    throw error;
  }

  if (!data) {
    const upsertPayload = {
      id: user.id,
      email: user.email ?? "",
      role: DEFAULT_ROLE,
      status: DEFAULT_STATUS
    };

    const upsertResult = await supabase.from("profiles").upsert(upsertPayload);
    if (upsertResult.error && isMissingProfileColumnError(upsertResult.error)) {
      const fallbackUpsert = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email ?? "",
        role: DEFAULT_ROLE
      });
      if (fallbackUpsert.error) {
        throw fallbackUpsert.error;
      }
    } else if (upsertResult.error) {
      throw upsertResult.error;
    }

    return {
      id: user.id,
      email: user.email ?? "",
      role: DEFAULT_ROLE,
      rawRole: DEFAULT_ROLE,
      status: DEFAULT_STATUS,
      displayName: null,
      avatarUrl: null,
      createdAt: null,
      lastLogin: null,
      lastActivity: null,
      lastPasswordChange: null,
      forcePasswordReset: false,
      forceLogoutAt: null
    };
  }

  return toAppProfile(data, user.email ?? "");
});

export async function requireAuth(): Promise<AppProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }

  if (profile.status !== "active") {
    statusRedirect(profile.status);
  }

  return profile;
}

export async function requireRole(roles: readonly AppRole[]): Promise<AppProfile> {
  const profile = await requireAuth();
  if (!hasRequiredRole(profile, roles)) {
    redirect("/dashboard");
  }
  return profile;
}

export async function requirePermission(permission: AppPermission): Promise<AppProfile> {
  const profile = await requireAuth();
  if (!hasPermission(profile, permission)) {
    redirect("/dashboard");
  }
  return profile;
}

export async function requireApiAuth(): Promise<AppProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }

  if (profile.status !== "active") {
    throw new Error("Account disabled");
  }

  return profile;
}

export async function requireApiRole(roles: readonly AppRole[]): Promise<AppProfile> {
  const profile = await requireApiAuth();
  if (!hasRequiredRole(profile, roles)) {
    throw new Error("Forbidden");
  }
  return profile;
}

export async function requireApiPermission(permission: AppPermission): Promise<AppProfile> {
  const profile = await requireApiAuth();
  if (!hasPermission(profile, permission)) {
    throw new Error("Forbidden");
  }
  return profile;
}
