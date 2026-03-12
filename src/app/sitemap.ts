import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/db/queries/posts";
import { siteConfig } from "@/lib/constants";
import { demoPosts } from "@/lib/demo-content";
import { getProjectPathSlug } from "@/lib/project-card-content";
import { graphxifyProjects } from "@/lib/project-details";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/works", "/services", "/about", "/blog", "/contact", "/privacy", "/terms"];

  // Default to demo posts so blog slugs are always indexed
  let posts: Array<{ slug: string; updated_at?: string }> = demoPosts.map((p) => ({
    slug: p.slug,
    updated_at: p.created_at
  }));
  const works: Array<{ slug: string; updated_at?: string }> = graphxifyProjects.map((project) => ({
    slug: project.slug,
    updated_at: `${project.year}-01-01`
  }));

  try {
    const dbPosts = (await getPublishedPosts()) as Array<{ slug: string; updated_at?: string }>;
    if (dbPosts.length > 0) {
      posts = dbPosts;
    }
  } catch {
    // degraded mode — demo posts already set as fallback
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
      url: `${siteConfig.url}/works/${getProjectPathSlug(work.slug)}`,
      lastModified: work.updated_at ? new Date(work.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
