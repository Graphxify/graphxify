"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/requireRole";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit";

export async function updateUserRoleAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");
  const role = String(formData.get("role") || "mod");

  if (!userId || (role !== "admin" && role !== "mod")) {
    throw new Error("Invalid payload");
  }

  const supabase = createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) throw error;

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "user.role_change",
    entityType: "profile",
    entityId: userId,
    metadata: { role }
  });

  revalidatePath("/dashboard/users");
}
