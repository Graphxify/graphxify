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

export async function getPublishedWorks() {
  noStore();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("works")
    .select("id,title,slug,year,role,services,subtitle,layout_variant,excerpt,content,cover_image_url,gallery_images,created_at,updated_at")
    .eq("status", "published")
    .order("year", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = data ?? [];
  const uniqueBySlug = new Map<string, (typeof rows)[number]>();

  for (const row of rows) {
    if (!uniqueBySlug.has(row.slug)) {
      uniqueBySlug.set(row.slug, row);
    }
  }

  return Array.from(uniqueBySlug.values());
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

export async function getDashboardWorks(page = 1, pageSize = 10) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("works")
    .select("id,title,slug,status,year,updated_at,author_id", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

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
