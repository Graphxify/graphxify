import type { MetadataRoute } from "next";
import { getPublishedBlogSummaries } from "@/lib/blog-data";
import { siteConfig } from "@/lib/constants";
import { getProjectPathSlug } from "@/lib/project-card-content";
import { graphxifyProjects } from "@/lib/project-details";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/works", "/services", "/services/brand-systems", "/services/web-design", "/services/web-development", "/services/cms-architecture", "/about", "/blog", "/contact", "/privacy", "/terms"];
  let blogs: Array<{ slug: string; updatedAt?: string }> = [];
  const works: Array<{ slug: string; updated_at?: string }> = graphxifyProjects.map((project) => ({
    slug: project.slug,
    updated_at: `${project.year}-01-01`
  }));

  try {
    blogs = await getPublishedBlogSummaries();
  } catch {
    blogs = [];
  }

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...blogs.map((blog) => ({
      url: `${siteConfig.url}/blog/${blog.slug}`,
      lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
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
