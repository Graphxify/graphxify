import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import type { Post } from "@/db/types";
import { createClient } from "@/lib/supabase/server";

const POST_BASE_SELECT = "id,title,slug,excerpt,content,cover_image_url,status,author_id,created_at,updated_at";
const POST_EXTENDED_SELECT = `${POST_BASE_SELECT},category,author,author_role,author_bio,tags,seo_title,seo_description,related_service,read_time_override`;
type PostQueryRow = Post & { __legacySchema?: boolean };

function isMissingColumnError(error: { code?: string } | null): boolean {
  return error?.code === "42703" || error?.code === "PGRST204";
}

function withLegacyBlogDefaults(rows: Array<Partial<Post>>, legacySchema = false): PostQueryRow[] {
  return rows.map((row) => ({
    id: typeof row.id === "string" ? row.id : "",
    title: typeof row.title === "string" ? row.title : "",
    slug: typeof row.slug === "string" ? row.slug : "",
    excerpt: typeof row.excerpt === "string" ? row.excerpt : "",
    content:
      typeof row.content === "string"
        ? row.content
        : typeof row.excerpt === "string"
          ? row.excerpt
          : "",
    cover_image_url: typeof row.cover_image_url === "string" ? row.cover_image_url : null,
    category: typeof row.category === "string" ? row.category : "Web Design",
    author: typeof row.author === "string" ? row.author : "Graphxify Team",
    author_role: typeof row.author_role === "string" ? row.author_role : "Editorial Team",
    author_bio:
      typeof row.author_bio === "string"
        ? row.author_bio
        : "Graphxify shares practical guidance on brand systems, websites, and content operations.",
    tags: Array.isArray(row.tags)
      ? row.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],
    seo_title: typeof row.seo_title === "string" ? row.seo_title : null,
    seo_description: typeof row.seo_description === "string" ? row.seo_description : null,
    related_service: typeof row.related_service === "string" ? row.related_service : null,
    read_time_override: typeof row.read_time_override === "number" ? row.read_time_override : null,
    status: row.status ?? "draft",
    author_id: typeof row.author_id === "string" ? row.author_id : null,
    created_at: typeof row.created_at === "string" ? row.created_at : "",
    updated_at:
      typeof row.updated_at === "string"
        ? row.updated_at
        : typeof row.created_at === "string"
          ? row.created_at
          : "",
    __legacySchema: legacySchema || undefined
  }));
}

export async function getPublishedPosts(): Promise<Post[]> {
  noStore();
  const supabase = createClient();

  const primary = await supabase
    .from("posts")
    .select(POST_EXTENDED_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (primary.error && !isMissingColumnError(primary.error)) {
    throw primary.error;
  }

  if (!primary.error) {
    return withLegacyBlogDefaults((primary.data as Post[] | null) ?? []);
  }

  const fallback = await supabase
    .from("posts")
    .select(POST_BASE_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (fallback.error) {
    throw fallback.error;
  }

  return withLegacyBlogDefaults((fallback.data as Partial<Post>[] | null) ?? [], true);
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createClient();

  const primary = await supabase
    .from("posts")
    .select(POST_EXTENDED_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (primary.error && !isMissingColumnError(primary.error)) {
    throw primary.error;
  }

  if (!primary.error) {
    return withLegacyBlogDefaults(primary.data ? [primary.data as Post] : [])[0] ?? null;
  }

  const fallback = await supabase
    .from("posts")
    .select(POST_BASE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (fallback.error) {
    throw fallback.error;
  }

  return withLegacyBlogDefaults(fallback.data ? [fallback.data as Partial<Post>] : [], true)[0] ?? null;
}

export async function getDashboardPosts(page = 1, pageSize = 10, search = "", status = "") {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("posts")
    .select("id,title,slug,status,updated_at,author_id", { count: "exact" })
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
    rows: data ?? [],
    total: count ?? 0,
    page,
    pageSize
  };
}

export async function getPostById(id: string) {
  const supabase = createClient();
  const primary = await supabase
    .from("posts")
    .select(POST_EXTENDED_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (primary.error && !isMissingColumnError(primary.error)) {
    throw primary.error;
  }

  if (!primary.error) {
    return withLegacyBlogDefaults(primary.data ? [primary.data as Post] : [])[0] ?? null;
  }

  const fallback = await supabase
    .from("posts")
    .select(POST_BASE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (fallback.error) {
    throw fallback.error;
  }

  return withLegacyBlogDefaults(fallback.data ? [fallback.data as Partial<Post>] : [], true)[0] ?? null;
}


export async function getPostVersions(postId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("post_versions")
    .select("id,version,title,slug,excerpt,status,editor_id,created_at")
    .eq("post_id", postId)
    .order("version", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
