import type { Metadata } from "next";
import { BlogPageContent, type BlogCategory, type BlogPostItem } from "@/components/marketing/blog-page-content";
import { getPublishedPosts } from "@/db/queries/posts";
import { demoPosts } from "@/lib/demo-content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type RawPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  created_at?: string;
  category?: string;
  author?: string;
  seo_title?: string;
  seo_description?: string;
};

const CATEGORY_VALUES: readonly BlogCategory[] = ["Brand Systems", "Web Design", "Development", "CMS"] as const;

function inferCategory(item: Pick<RawPost, "title" | "excerpt" | "category">, index = 0): BlogCategory {
  const raw = item.category?.trim();
  if (raw && CATEGORY_VALUES.includes(raw as BlogCategory)) {
    return raw as BlogCategory;
  }

  const source = `${item.title} ${item.excerpt}`.toLowerCase();
  if (source.includes("brand") || source.includes("identity")) return "Brand Systems";
  if (source.includes("design") || source.includes("ux") || source.includes("ui")) return "Web Design";
  if (source.includes("cms") || source.includes("content")) return "CMS";
  if (source.includes("development") || source.includes("engineering") || source.includes("performance") || source.includes("code")) return "Development";
  return CATEGORY_VALUES[index % CATEGORY_VALUES.length];
}

function toBlogPost(item: Partial<RawPost>, index = 0): BlogPostItem | null {
  if (!item.id || !item.title || !item.slug || !item.excerpt) {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt.trim(),
    coverImage: item.cover_image_url || "/assets/post-fallback.svg",
    createdAt: item.created_at,
    category: inferCategory({ title: item.title, excerpt: item.excerpt, category: item.category }, index),
    author: typeof item.author === "string" ? item.author : undefined,
    seoTitle: typeof item.seo_title === "string" ? item.seo_title : undefined,
    seoDescription: typeof item.seo_description === "string" ? item.seo_description : undefined
  };
}

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Ideas, systems, and structured thinking on branding, web architecture, and scalable digital platforms.",
  path: "/blog"
});

export default async function BlogPage() {
  let posts: BlogPostItem[] = demoPosts
    .map((item, index) => toBlogPost(item as Partial<RawPost>, index))
    .filter((item): item is BlogPostItem => item !== null);

  try {
    const dbPosts = await getPublishedPosts();
    if (dbPosts.length > 0) {
      posts = dbPosts
        .map((item, index) => toBlogPost(item as Partial<RawPost>, index))
        .filter((item): item is BlogPostItem => item !== null);
    }
  } catch {
    // fallback
  }

  return <BlogPageContent posts={posts} />;
}
