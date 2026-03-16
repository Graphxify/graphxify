import "server-only";

import { unstable_noStore as noStore } from "next/cache";
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

export async function getPublishedWorks() {
  const supabase = createClient();

  // Try the full column list (requires migration work-cms-fields.sql to have been run).
  const { data, error } = await supabase
    .from("works")
    .select("id,title,slug,year,role,services,subtitle,layout_variant,excerpt,cover_image_url,gallery_images,created_at,updated_at,card_outcome,card_services,sort_order,featured,industry,platform,timeline,location,live_url,overview,challenge,approach,solution,result,meta_title,meta_description")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });

  if (!error) {
    return deduplicateWorksBySlug(data ?? []);
  }

  // If any column doesn't exist yet (migration not run), fall back to base columns so
  // public pages continue to function with CMS cover images and gallery images.
  if (error.code === "42703") {
    const { data: baseData, error: baseError } = await supabase
      .from("works")
      .select("id,title,slug,year,role,services,subtitle,layout_variant,excerpt,cover_image_url,gallery_images,created_at,updated_at")
      .eq("status", "published")
      .order("year", { ascending: false });

    if (baseError) {
      throw baseError;
    }

    // Cast to the full type so callers don't see a narrowed row shape.
    // Extended fields (industry, overview, etc.) will be undefined at runtime
    // until the migration is run, and all callers already guard against that.
    return deduplicateWorksBySlug((baseData ?? []) as NonNullable<typeof data>);
  }

  throw error;
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
