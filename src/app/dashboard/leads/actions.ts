"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/requireRole";
import { createClient } from "@/lib/supabase/server";

export async function updateLeadStatusAction(formData: FormData) {
  await requirePermission("leads.view");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["new", "contacted", "converted", "lost", "archived"].includes(status)) {
    return;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/leads");
}

export async function deleteLeadAction(formData: FormData) {
  await requirePermission("leads.view");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/leads");
}
