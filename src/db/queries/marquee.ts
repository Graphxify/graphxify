import "server-only";

import { createPublicClient } from "@/lib/supabase/public";

export type MarqueeItem = {
  id: string;
  image_url_dark: string;
  image_url_light: string;
  label: string;
  sort_order: number;
  enabled: boolean;
  created_at: string;
};

/** Enabled items only — used by the public homepage. */
export async function getMarqueeItems(): Promise<MarqueeItem[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("marquee_items")
    .select("id, image_url_dark, image_url_light, label, sort_order, enabled, created_at")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as MarqueeItem[];
}

/** All items (enabled + disabled) — used by the CMS dashboard. */
export async function getAllMarqueeItems(): Promise<MarqueeItem[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("marquee_items")
    .select("id, image_url_dark, image_url_light, label, sort_order, enabled, created_at")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as MarqueeItem[];
}
