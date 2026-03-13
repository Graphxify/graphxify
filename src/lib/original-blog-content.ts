import { normalizeBlogPost, type BlogCmsRecord, type BlogPost } from "@/lib/blog";
import { demoPosts } from "@/lib/demo-content";

type DemoBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category?: string;
  cover_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  author?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  author_bio?: string | null;
  tags?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

const ORIGINAL_BLOG_SOURCE = demoPosts as DemoBlogPost[];

export const LEGACY_PLACEHOLDER_BLOG_SLUGS = [
  "enterprise-website-governance-2026",
  "how-to-design-an-audit-ready-cms",
  "performance-patterns-premium-agency-sites"
] as const;

const LEGACY_PLACEHOLDER_BLOG_SLUG_SET = new Set<string>(LEGACY_PLACEHOLDER_BLOG_SLUGS);

export type OriginalBlogCmsRecord = BlogCmsRecord & {
  updated_at?: string;
};

export const ORIGINAL_BLOG_SEED_SLUGS = ORIGINAL_BLOG_SOURCE.map((post) => post.slug);

export function isLegacyPlaceholderBlogSlug(slug: string): boolean {
  return LEGACY_PLACEHOLDER_BLOG_SLUG_SET.has(slug);
}

export function getOriginalBlogCmsRecords(): OriginalBlogCmsRecord[] {
  return ORIGINAL_BLOG_SOURCE.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cover_image_url: post.cover_image_url ?? null,
    status: "published",
    created_at: post.created_at,
    updated_at: post.updated_at ?? post.created_at,
    category: post.category ?? "Web Design",
    author: post.author ?? post.author_name ?? "Graphxify Team",
    author_role: post.author_role ?? "Editorial Team",
    author_bio:
      post.author_bio ??
      "Graphxify shares practical guidance on brand systems, websites, and content operations.",
    tags: Array.isArray(post.tags) ? post.tags : [],
    seo_title: post.seo_title ?? null,
    seo_description: post.seo_description ?? null
  }));
}

export function getOriginalBlogCmsRecordBySlug(slug: string): OriginalBlogCmsRecord | null {
  return getOriginalBlogCmsRecords().find((post) => post.slug === slug) ?? null;
}

export function getOriginalPublishedBlogs(): BlogPost[] {
  return getOriginalBlogCmsRecords()
    .map((post) => normalizeBlogPost(post))
    .filter((post): post is BlogPost => post !== null);
}

export function getOriginalPublishedBlogBySlug(slug: string): BlogPost | null {
  return getOriginalPublishedBlogs().find((post) => post.slug === slug) ?? null;
}
