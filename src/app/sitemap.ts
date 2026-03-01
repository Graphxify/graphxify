import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/db/queries/posts";
import { getPublishedWorks } from "@/db/queries/works";
import { siteConfig } from "@/lib/constants";
import { caseStudies, serviceDetails } from "@/lib/marketing-content";
import { journalPosts } from "@/lib/journal-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/works", "/services", "/about", "/blog", "/contact", "/privacy", "/terms"];
  const serviceRoutes = serviceDetails.map((item) => `/services/${item.slug}`);
  const caseStudyRoutes = caseStudies.map((item) => `/works/${item.slug}`);

  let dbPosts: Array<{ slug: string; updated_at?: string }> = [];
  let dbWorks: Array<{ slug: string; updated_at?: string }> = [];

  try {
    dbPosts = (await getPublishedPosts()) as Array<{ slug: string; updated_at?: string }>;
    dbWorks = (await getPublishedWorks()) as Array<{ slug: string; updated_at?: string }>;
  } catch {
    // degraded mode without DB
  }

  const allBlogSlugs = Array.from(new Set([...journalPosts.map((post) => post.slug), ...dbPosts.map((post) => post.slug)]));
  const allWorkSlugs = Array.from(new Set([...caseStudies.map((work) => work.slug), ...dbWorks.map((work) => work.slug)]));

  return [
    ...[...staticRoutes, ...serviceRoutes].map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...allBlogSlugs.map((slug) => {
      const dbPost = dbPosts.find((post) => post.slug === slug);
      return {
        url: `${siteConfig.url}/blog/${slug}`,
        lastModified: dbPost?.updated_at ? new Date(dbPost.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7
      };
    }),
    ...Array.from(new Set([...caseStudyRoutes, ...allWorkSlugs.map((slug) => `/works/${slug}`)])).map((route) => {
      const slug = route.replace("/works/", "");
      const dbWork = dbWorks.find((work) => work.slug === slug);
      return {
        url: `${siteConfig.url}${route}`,
        lastModified: dbWork?.updated_at ? new Date(dbWork.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7
      };
    })
  ];
}
