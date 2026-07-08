import type { MetadataRoute } from "next";
import { getPublishedBlogSummaries } from "@/lib/blog-data";
import { getPublishedWorks } from "@/db/queries/works";
import { siteConfig } from "@/lib/constants";
import { getProjectPathSlug, resolveProjectSlugFromPathSlug } from "@/lib/project-card-content";
import { graphxifyProjects } from "@/lib/project-details";

type SitemapEntry = MetadataRoute.Sitemap[number];

// Stable "last content update" date for static pages. A fixed value (rather than
// `new Date()` on every request) gives Google a trustworthy <lastmod> instead of
// one that appears to change on every crawl. Bump this when static page copy changes.
const CONTENT_LAST_UPDATED = new Date("2026-07-08T00:00:00Z");

// ── Static routes ─────────────────────────────────────────────────────────────
// Each entry carries its own SEO weight and update cadence.
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: SitemapEntry["changeFrequency"];
}> = [
  { path: "",                             priority: 1.0, changeFrequency: "weekly"  },
  { path: "/works",                       priority: 0.9, changeFrequency: "weekly"  },
  { path: "/services",                    priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/web-design",         priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/web-development",    priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/brand-systems",      priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/cms-architecture",   priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog",                        priority: 0.8, changeFrequency: "daily"   },
  { path: "/about",                       priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact",                     priority: 0.7, changeFrequency: "monthly" },
{ path: "/resources/website-growth-checklist", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy",                     priority: 0.3, changeFrequency: "yearly"  },
  { path: "/terms",                       priority: 0.3, changeFrequency: "yearly"  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = CONTENT_LAST_UPDATED;

  // ── Blog posts ──────────────────────────────────────────────────────────────
  // Fetched from Supabase; falls back to empty array on error so the
  // sitemap is never broken by a DB outage.
  let blogs: Array<{ slug: string; updatedAt?: string }> = [];
  try {
    blogs = await getPublishedBlogSummaries();
  } catch {
    blogs = [];
  }

  // ── Works / Case studies ────────────────────────────────────────────────────
  // Primary source: published CMS works from Supabase.
  // Fallback: hardcoded project list so the sitemap is never empty.
  let workEntries: Array<{ slug: string; updated_at?: string | null }> = graphxifyProjects.map(
    (p) => ({ slug: p.slug, updated_at: `${p.year}-01-01` })
  );

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      // Deduplicate by canonical slug, keeping the most-recently-updated record.
      const byCanonical = new Map<string, (typeof cmsWorks)[number]>();
      for (const work of cmsWorks) {
        const canonical = resolveProjectSlugFromPathSlug(work.slug);
        const existing = byCanonical.get(canonical);
        const existingMs = existing?.updated_at ? Date.parse(existing.updated_at) : 0;
        const candidateMs = work.updated_at ? Date.parse(work.updated_at) : 0;
        if (!existing || candidateMs >= existingMs) {
          byCanonical.set(canonical, { ...work, slug: canonical });
        }
      }
      workEntries = Array.from(byCanonical.values());
    }
  } catch {
    // Use hardcoded fallback defined above.
  }

  return [
    // Static pages
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),

    // Blog posts — updated whenever post content changes
    ...blogs.map((blog) => ({
      url: `${siteConfig.url}/blog/${blog.slug}`,
      lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // Case studies — stable content, moderate change frequency
    ...workEntries.map((work) => ({
      url: `${siteConfig.url}/works/${getProjectPathSlug(work.slug)}`,
      lastModified: work.updated_at ? new Date(work.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
