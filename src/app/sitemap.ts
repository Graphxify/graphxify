import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/db/queries/posts";
import { getPublishedWorks } from "@/db/queries/works";
import { siteConfig } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/works", "/services", "/about", "/blog", "/contact", "/privacy", "/terms"];

  let posts: Array<{ slug: string; updated_at?: string }> = [];
  let works: Array<{ slug: string; updated_at?: string }> = [];

  try {
    posts = (await getPublishedPosts()) as Array<{ slug: string; updated_at?: string }>;
    works = (await getPublishedWorks()) as Array<{ slug: string; updated_at?: string }>;
  } catch {
    // degraded mode without DB
  }

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...works.map((work) => ({
      url: `${siteConfig.url}/works/${work.slug}`,
      lastModified: work.updated_at ? new Date(work.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
