import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import type { Post } from "@/db/types";
import { getOriginalBlogCmsRecordBySlug } from "@/lib/original-blog-content";
import { createClient } from "@/lib/supabase/server";

const POST_BASE_SELECT = "id,title,slug,excerpt,content,cover_image_url,status,author_id,created_at,updated_at";
const POST_EXTENDED_SELECT = `${POST_BASE_SELECT},category,author,author_role,author_bio,tags,seo_title,seo_description`;
type PostQueryRow = Post & { __legacySchema?: boolean };

function isMissingColumnError(error: { code?: string } | null): boolean {
  return error?.code === "42703" || error?.code === "PGRST204";
}

function mergeOriginalBlogMetadata(row: Partial<Post>): Partial<Post> {
  if (typeof row.slug !== "string") {
    return row;
  }

  const original = getOriginalBlogCmsRecordBySlug(row.slug);
  if (!original) {
    return row;
  }

  return {
    ...row,
    category: original.category ?? row.category ?? "Web Design",
    author: original.author ?? row.author ?? "Graphxify Team",
    author_role: original.author_role ?? row.author_role ?? "Editorial Team",
    author_bio:
      original.author_bio ??
      row.author_bio ??
      "Graphxify shares practical guidance on brand systems, websites, and content operations.",
    tags: Array.isArray(original.tags) ? original.tags : Array.isArray(row.tags) ? row.tags : [],
    seo_title: original.seo_title ?? row.seo_title ?? null,
    seo_description: original.seo_description ?? row.seo_description ?? null,
    cover_image_url: row.cover_image_url ?? original.cover_image_url,
    created_at: row.created_at ?? original.created_at,
    updated_at: row.updated_at ?? original.updated_at ?? row.created_at ?? original.created_at
  };
}

function withLegacyBlogDefaults(rows: Array<Partial<Post>>, legacySchema = false): PostQueryRow[] {
  return rows.map((row) => ({
    ...(() => {
      const normalizedRow = legacySchema ? mergeOriginalBlogMetadata(row) : row;
      return {
        id: typeof normalizedRow.id === "string" ? normalizedRow.id : "",
        title: typeof normalizedRow.title === "string" ? normalizedRow.title : "",
        slug: typeof normalizedRow.slug === "string" ? normalizedRow.slug : "",
        excerpt: typeof normalizedRow.excerpt === "string" ? normalizedRow.excerpt : "",
        content:
          typeof normalizedRow.content === "string"
            ? normalizedRow.content
            : typeof normalizedRow.excerpt === "string"
              ? normalizedRow.excerpt
              : "",
        cover_image_url: typeof normalizedRow.cover_image_url === "string" ? normalizedRow.cover_image_url : null,
        category: typeof normalizedRow.category === "string" ? normalizedRow.category : "Web Design",
        author: typeof normalizedRow.author === "string" ? normalizedRow.author : "Graphxify Team",
        author_role: typeof normalizedRow.author_role === "string" ? normalizedRow.author_role : "Editorial Team",
        author_bio:
          typeof normalizedRow.author_bio === "string"
            ? normalizedRow.author_bio
            : "Graphxify shares practical guidance on brand systems, websites, and content operations.",
        tags: Array.isArray(normalizedRow.tags)
          ? normalizedRow.tags.map((tag) => String(tag).trim()).filter(Boolean)
          : [],
        seo_title: typeof normalizedRow.seo_title === "string" ? normalizedRow.seo_title : null,
        seo_description: typeof normalizedRow.seo_description === "string" ? normalizedRow.seo_description : null,
        status: normalizedRow.status ?? "draft",
        author_id: typeof normalizedRow.author_id === "string" ? normalizedRow.author_id : null,
        created_at: typeof normalizedRow.created_at === "string" ? normalizedRow.created_at : "",
        updated_at:
          typeof normalizedRow.updated_at === "string"
            ? normalizedRow.updated_at
            : typeof normalizedRow.created_at === "string"
              ? normalizedRow.created_at
              : "",
        __legacySchema: legacySchema || undefined
      };
    })(),
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
