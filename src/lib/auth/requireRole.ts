import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "mod";

export async function getSessionUser() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    await supabase.from("profiles").upsert({ id: user.id, email: user.email ?? "", role: "mod" });
    return { id: user.id, email: user.email ?? "", role: "mod" as const };
  }

  return data as { id: string; email: string; role: AppRole };
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  return profile;
}

export async function requireRole(roles: AppRole[]) {
  const profile = await requireAuth();
  if (!roles.includes(profile.role)) {
    redirect("/dashboard");
  }
  return profile;
}

export async function requireApiAuth() {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  return profile;
}

export async function requireApiRole(roles: AppRole[]) {
  const profile = await requireApiAuth();
  if (!roles.includes(profile.role)) {
    throw new Error("Forbidden");
  }
  return profile;
}
