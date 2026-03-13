import type { Metadata } from "next";
import { BlogPageContent, type BlogCategory, type BlogPostItem } from "@/components/marketing/blog-page-content";
import { getPublishedPosts } from "@/db/queries/posts";
import { demoPosts } from "@/lib/demo-content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 30;

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

const CATEGORY_VALUES: readonly BlogCategory[] = ["Web Design", "Web Development", "Branding", "Business Growth", "Digital Strategy"] as const;

function inferCategory(item: Pick<RawPost, "title" | "excerpt" | "category">, index = 0): BlogCategory {
  const raw = item.category?.trim();
  if (raw && CATEGORY_VALUES.includes(raw as BlogCategory)) {
    return raw as BlogCategory;
  }

  const source = `${item.title} ${item.excerpt}`.toLowerCase();
  if (source.includes("brand") || source.includes("identity") || source.includes("logo")) return "Branding";
  if (source.includes("seo") || source.includes("digital strategy") || source.includes("marketing") || source.includes("google")) return "Digital Strategy";
  if (source.includes("development") || source.includes("engineering") || source.includes("code") || source.includes("wordpress")) return "Web Development";
  if (source.includes("growth") || source.includes("revenue") || source.includes("conversion") || source.includes("leads")) return "Business Growth";
  if (source.includes("design") || source.includes("ux") || source.includes("ui") || source.includes("mobile")) return "Web Design";
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
  title: "Web Design, Branding & Digital Strategy Blog | Graphxify Canada",
  description: "Practical guides on web design, web development, and branding for Canadian businesses. Insights from Graphxify — a web design and branding agency serving Toronto, Mississauga, and all of Canada.",
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
