export const BLOG_CATEGORIES = [
  "Web Design",
  "Web Development",
  "Branding",
  "Business Growth",
  "Digital Strategy"
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const RELATED_SERVICE_OPTIONS = [
  { value: "brand-systems", label: "Brand Systems" },
  { value: "web-design", label: "Web Design" },
  { value: "web-development", label: "Web Development" },
  { value: "cms-architecture", label: "CMS Architecture" }
] as const;

export type RelatedServiceKey = (typeof RELATED_SERVICE_OPTIONS)[number]["value"];

export type BlogCmsRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  status: "draft" | "review" | "published";
  created_at?: string;
  updated_at?: string;
  category?: string | null;
  author?: string | null;
  author_role?: string | null;
  author_bio?: string | null;
  tags?: string[] | string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  related_service?: string | null;
  read_time_override?: number | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: "draft" | "review" | "published";
  publishedAt?: string;
  updatedAt?: string;
  category: BlogCategory;
  authorName: string;
  authorRole: string;
  authorBio: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  /** CMS-controlled: which service page to feature below this post. Null = auto-derive from category. */
  relatedService?: RelatedServiceKey | null;
  /** Resolved read time: uses CMS override if set, otherwise derived from content word count. */
  readTime: string;
};

export type BlogPostSummary = Pick<
  BlogPost,
  "id" | "title" | "slug" | "excerpt" | "coverImage" | "publishedAt" | "category" | "authorName" | "seoTitle" | "seoDescription"
> & {
  /** Pre-computed from full content so index and detail page always match. */
  readTime: string;
};

const BLOG_CATEGORY_SET = new Set<string>(BLOG_CATEGORIES);
const RELATED_SERVICE_SET = new Set<string>(RELATED_SERVICE_OPTIONS.map((o) => o.value));

/**
 * Single canonical read-time calculation used by both the blog index and detail page.
 * Based on full post content, 220 wpm average reading speed, minimum 1 minute.
 */
export function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}
const DEFAULT_CATEGORY: BlogCategory = "Web Design";
const DEFAULT_AUTHOR_NAME = "Graphxify Team";
const DEFAULT_AUTHOR_ROLE = "Editorial Team";
const DEFAULT_AUTHOR_BIO = "Graphxify shares practical guidance on brand systems, websites, and content operations.";

/**
 * Shared reading-time estimator — single source of truth used by both
 * the blog listing page (excerpt) and the blog detail page (full content).
 * Formula: round(words / 200), minimum 1 minute.
 */
export function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function normalizeBlogCategory(value: unknown): BlogCategory {
  const normalized = getString(value);
  if (normalized && BLOG_CATEGORY_SET.has(normalized)) {
    return normalized as BlogCategory;
  }
  return DEFAULT_CATEGORY;
}

export function parseBlogTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter((item) => item.length > 0)
      )
    ).slice(0, 8);
  }

  if (typeof value === "string") {
    return Array.from(
      new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      )
    ).slice(0, 8);
  }

  return [];
}

export function formatBlogTagInput(value: unknown): string {
  return parseBlogTags(value).join(", ");
}

export function normalizeRelatedService(value: unknown): RelatedServiceKey | null {
  const s = getString(value);
  if (s && RELATED_SERVICE_SET.has(s)) {
    return s as RelatedServiceKey;
  }
  return null;
}

export function normalizeBlogPost(input: Partial<BlogCmsRecord>): BlogPost | null {
  if (!input.id || !input.title || !input.slug || !input.excerpt || !input.content || !input.status) {
    return null;
  }

  return {
    id: input.id,
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content,
    coverImage: getString(input.cover_image_url) ?? "/assets/post-fallback.svg",
    status: input.status,
    publishedAt: getString(input.created_at),
    updatedAt: getString(input.updated_at),
    category: normalizeBlogCategory(input.category),
    authorName: getString(input.author) ?? DEFAULT_AUTHOR_NAME,
    authorRole: getString(input.author_role) ?? DEFAULT_AUTHOR_ROLE,
    authorBio: getString(input.author_bio) ?? DEFAULT_AUTHOR_BIO,
    tags: parseBlogTags(input.tags),
    seoTitle: getString(input.seo_title),
    seoDescription: getString(input.seo_description),
    relatedService: normalizeRelatedService(input.related_service),
    readTime:
      typeof input.read_time_override === "number" && input.read_time_override >= 1
        ? `${input.read_time_override} min read`
        : calculateReadTime(input.content)
  };
}

export function toBlogPostSummary(post: BlogPost): BlogPostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt,
    category: post.category,
    authorName: post.authorName,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    readTime: post.readTime
  };
}

export function selectRelatedBlogPosts(posts: BlogPostSummary[], currentSlug: string, category: BlogCategory): BlogPostSummary[] {
  const filtered = posts.filter((post) => post.slug !== currentSlug);
  const sameCategory = filtered.filter((post) => post.category === category);
  const fallback = filtered.filter((post) => post.category !== category);
  return [...sameCategory, ...fallback].slice(0, 3);
}
