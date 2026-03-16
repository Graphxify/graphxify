import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import type { Work } from "@/db/types";
import { getProjectDisplayTitle } from "@/lib/project-card-content";
import { createClient } from "@/lib/supabase/server";

function withCanonicalWorkTitle<T extends { slug: string; title: string }>(item: T): T {
  return {
    ...item,
    title: getProjectDisplayTitle(item.slug, item.title)
  };
}

function deduplicateWorksBySlug<T extends { slug: string }>(rows: T[]): T[] {
  const uniqueBySlug = new Map<string, T>();
  for (const row of rows) {
    if (!uniqueBySlug.has(row.slug)) {
      uniqueBySlug.set(row.slug, row);
    }
  }
  return Array.from(uniqueBySlug.values());
}

export async function getPublishedWorks(): Promise<Work[]> {
  const supabase = createClient();

  // Fetch with the full column list (requires migration work-cms-fields.sql to have been run).
  // We store the result WITHOUT immediately destructuring so TypeScript does not narrow
  // `fullData` to `null` in the error branch (Supabase uses a discriminated union on the
  // destructured form, which would make NonNullable<typeof data> resolve to `never`).
  const fullResult = await supabase
    .from("works")
    .select("id,title,slug,year,role,services,subtitle,layout_variant,excerpt,cover_image_url,gallery_images,created_at,updated_at,card_outcome,card_services,sort_order,featured,industry,platform,timeline,location,live_url,overview,challenge,approach,solution,result,meta_title,meta_description")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });

  if (!fullResult.error) {
    return deduplicateWorksBySlug(fullResult.data ?? []) as Work[];
  }

  // If any column doesn't exist yet (migration not run), retry with base columns so
  // public pages continue to show CMS cover images and gallery images.
  if (fullResult.error.code === "42703" || fullResult.error.code === "PGRST204") {
    const baseResult = await supabase
      .from("works")
      .select("id,title,slug,year,role,services,subtitle,layout_variant,excerpt,cover_image_url,gallery_images,created_at,updated_at")
      .eq("status", "published")
      .order("year", { ascending: false });

    if (baseResult.error) {
      throw baseResult.error;
    }

    // Extended fields (industry, overview, etc.) are absent until the migration runs;
    // all callers guard against undefined/null with `||`/`??` so this is safe.
    return deduplicateWorksBySlug(baseResult.data ?? []) as Work[];
  }

  throw fullResult.error;
}

export async function getPublishedWorkBySlug(slug: string) {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getDashboardWorks(page = 1, pageSize = 10, search = "", status = "") {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("works")
    .select("id,title,slug,status,year,updated_at,author_id", { count: "exact" })
    .order("updated_at", { ascending: false });

  if (search.trim()) {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  if (status && ["draft", "review", "published"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw error;
  }

  return {
    rows: (data ?? []).map((row) => withCanonicalWorkTitle(row)),
    total: count ?? 0,
    page,
    pageSize
  };
}

export async function getWorkById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("works").select("*").eq("id", id).maybeSingle();
  if (error) {
    throw error;
  }
  return data ? withCanonicalWorkTitle(data) : data;
}

export async function getWorkVersions(workId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("work_versions")
    .select("id,version,title,slug,excerpt,status,editor_id,created_at")
    .eq("work_id", workId)
    .order("version", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => withCanonicalWorkTitle(row));
}
