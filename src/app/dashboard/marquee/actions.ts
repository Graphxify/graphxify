"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/requireRole";

function revalidateMarquee() {
  revalidatePath("/");
  revalidatePath("/dashboard/marquee");
}

export async function addMarqueeItem(formData: FormData): Promise<{ error?: string }> {
  await requirePermission("content.works.edit_any");

  const imageUrlDark = String(formData.get("image_url_dark") ?? "").trim();
  const imageUrlLight = String(formData.get("image_url_light") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();

  if (!imageUrlDark) return { error: "Dark image URL is required." };
  if (!imageUrlLight) return { error: "Light image URL is required." };

  const supabase = createClient();

  const { data: topItem } = await supabase
    .from("marquee_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (topItem?.sort_order ?? 0) + 1;

  const { error } = await supabase
    .from("marquee_items")
    .insert({ image_url_dark: imageUrlDark, image_url_light: imageUrlLight, label: label || "Logo", sort_order: nextOrder });

  if (error) return { error: error.message };

  revalidateMarquee();
  return {};
}

export async function updateMarqueeItem(formData: FormData): Promise<{ error?: string }> {
  await requirePermission("content.works.edit_any");

  const id = String(formData.get("id") ?? "").trim();
  const imageUrlDark = String(formData.get("image_url_dark") ?? "").trim();
  const imageUrlLight = String(formData.get("image_url_light") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();

  if (!id) return { error: "Missing id." };
  if (!imageUrlDark) return { error: "Dark image URL is required." };
  if (!imageUrlLight) return { error: "Light image URL is required." };

  const supabase = createClient();
  const { error } = await supabase
    .from("marquee_items")
    .update({ image_url_dark: imageUrlDark, image_url_light: imageUrlLight, label: label || "Logo" })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateMarquee();
  return {};
}

export async function deleteMarqueeItem(formData: FormData): Promise<void> {
  await requirePermission("content.works.edit_any");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = createClient();
  await supabase.from("marquee_items").delete().eq("id", id);

  revalidateMarquee();
}

export async function toggleMarqueeItem(formData: FormData): Promise<void> {
  await requirePermission("content.works.edit_any");

  const id = String(formData.get("id") ?? "").trim();
  const enabled = formData.get("enabled") === "true";

  if (!id) return;

  const supabase = createClient();
  await supabase
    .from("marquee_items")
    .update({ enabled })
    .eq("id", id);

  revalidateMarquee();
}
