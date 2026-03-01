"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const headerStore = headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip") ?? "unknown";

  const limited = await rateLimit({ key: ip, route: "auth-login", limit: 8, windowSec: 60 });
  if (!limited.allowed) {
    throw new Error("Too many login attempts. Try again shortly.");
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error("Invalid credentials");
  }

  if (data.user) {
    await supabase.from("profiles").upsert({ id: data.user.id, email: data.user.email ?? email, role: "mod" });
    await logAuditEvent({
      actorId: data.user.id,
      actorEmail: data.user.email ?? email,
      actorRole: "mod",
      action: "auth.login",
      entityType: "profile",
      entityId: data.user.id,
      metadata: { source: "password" }
    });
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
