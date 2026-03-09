import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "mod";
export type AppProfile = {
  id: string;
  email: string;
  role: AppRole;
};

const DEFAULT_ROLE: AppRole = "mod";

export async function getSessionUser(supabase = createClient()) {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

function hasRequiredRole(profile: AppProfile, roles: readonly AppRole[]): boolean {
  return roles.includes(profile.role);
}

export async function getCurrentProfile(): Promise<AppProfile | null> {
  const supabase = createClient();
  const user = await getSessionUser(supabase);
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    await supabase.from("profiles").upsert({ id: user.id, email: user.email ?? "", role: DEFAULT_ROLE });
    return { id: user.id, email: user.email ?? "", role: DEFAULT_ROLE };
  }

  return data as AppProfile;
}

export async function requireAuth(): Promise<AppProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
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

export async function requireApiAuth(): Promise<AppProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
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
