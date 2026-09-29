import type { MetadataRoute } from "next";
import { getPublishedBlogSummaries } from "@/lib/blog-data";
import { getPublishedWorks } from "@/db/queries/works";
import { serviceCatalog } from "@/lib/constants";
import { getPublishedIndustryPages } from "@/lib/industries";
import { getProjectPathSlug, resolveProjectSlugFromPathSlug } from "@/lib/project-card-content";
import { graphxifyProjects } from "@/lib/project-details";
import { canonicalUrl } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

// Stable "last content update" date for hard-coded static pages. A fixed value
// (rather than `new Date()` on every request) gives search engines a trustworthy
// <lastmod> instead of one that appears to change on every crawl.
// Bump this ONLY when static page copy actually changes.
const STATIC_CONTENT_LAST_UPDATED = new Date("2026-07-29T00:00:00Z");

// Legal pages carry their own "Last updated" date in the page copy.
const LEGAL_LAST_UPDATED = new Date("2026-03-09T00:00:00Z");

// ── Static routes ─────────────────────────────────────────────────────────────
// /blog and /works are listed separately below so their <lastmod> can track
// the newest post / case study. /review is intentionally excluded (noindex).
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: SitemapEntry["changeFrequency"];
  lastModified?: Date;
}> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  ...serviceCatalog.map((service) => ({
    path: service.path,
    priority: 0.8,
    changeFrequency: "monthly" as const
  })),
  { path: "/process", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/resources/website-growth-checklist", priority: 0.6, changeFrequency: "monthly" },
  // Industry pages appear only once published (see lib/industries.ts).
  ...getPublishedIndustryPages().map((page) => ({
    path: `/industries/${page.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const
  })),
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly", lastModified: LEGAL_LAST_UPDATED },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly", lastModified: LEGAL_LAST_UPDATED }
];

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function newest(dates: Array<Date | null>): Date | null {
  const valid = dates.filter((date): date is Date => date !== null);
  if (valid.length === 0) return null;
  return new Date(Math.max(...valid.map((date) => date.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Blog posts ──────────────────────────────────────────────────────────────
  // Fetched from Supabase; falls back to empty array on error so the
  // sitemap is never broken by a DB outage.
  let blogs: Array<{ slug: string; publishedAt?: string; updatedAt?: string }> = [];
  try {
    blogs = await getPublishedBlogSummaries();
  } catch {
    blogs = [];
  }

  // ── Works / Case studies ────────────────────────────────────────────────────
  // Primary source: published CMS works from Supabase.
  // Fallback: hardcoded project list so the sitemap is never empty. The
  // fallback has no real modification date, so it emits none.
  let workEntries: Array<{ slug: string; updated_at?: string | null }> = graphxifyProjects.map((p) => ({
    slug: p.slug,
    updated_at: null
  }));

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

  const blogEntries = blogs.map((blog) => ({
    slug: blog.slug,
    lastModified: toDate(blog.updatedAt) ?? toDate(blog.publishedAt)
  }));
  const caseStudyEntries = workEntries.map((work) => ({
    path: `/works/${getProjectPathSlug(work.slug)}`,
    lastModified: toDate(work.updated_at)
  }));

  const blogIndexModified = newest(blogEntries.map((entry) => entry.lastModified));
  const worksIndexModified = newest(caseStudyEntries.map((entry) => entry.lastModified));

  return [
    // Static pages
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency, lastModified }) => ({
      url: canonicalUrl(path),
      lastModified: lastModified ?? STATIC_CONTENT_LAST_UPDATED,
      changeFrequency,
      priority
    })),

    // Index pages — last modified when their newest item was
    {
      url: canonicalUrl("/works"),
      ...(worksIndexModified ? { lastModified: worksIndexModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.9
    },
    {
      url: canonicalUrl("/blog"),
      ...(blogIndexModified ? { lastModified: blogIndexModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.8
    },

    // Blog posts — real CMS updated_at (or created_at) per post
    ...blogEntries.map((entry) => ({
      url: canonicalUrl(`/blog/${entry.slug}`),
      ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),

    // Case studies — real CMS updated_at per project
    ...caseStudyEntries.map((entry) => ({
      url: canonicalUrl(entry.path),
      ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
