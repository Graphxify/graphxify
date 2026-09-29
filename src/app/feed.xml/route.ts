import { getPublishedBlogs } from "@/lib/blog-data";
import { siteConfig } from "@/lib/constants";
import { absoluteUrl, canonicalUrl } from "@/lib/seo";

// Atom 1.0 feed of published blog posts. Atom (rather than RSS 2.0) because it
// carries both <published> and <updated> natively, so real CMS dates are
// exposed without non-standard extensions. Linked from /blog and every post via
// <link rel="alternate" type="application/atom+xml">.
export const revalidate = 300;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoOrNull(value: string | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function GET(): Promise<Response> {
  let posts: Awaited<ReturnType<typeof getPublishedBlogs>> = [];
  try {
    posts = await getPublishedBlogs();
  } catch {
    // A DB outage should not turn the feed into a 500 — serve it empty.
    posts = [];
  }

  const feedUrl = canonicalUrl("/feed.xml");
  const blogUrl = canonicalUrl("/blog");

  const entries = posts.map((post) => {
    const url = canonicalUrl(`/blog/${post.slug}`);
    const published = toIsoOrNull(post.publishedAt);
    const updated = toIsoOrNull(post.updatedAt) ?? published;
    return [
      "  <entry>",
      `    <title>${escapeXml(post.title)}</title>`,
      `    <link rel="alternate" type="text/html" href="${escapeXml(url)}"/>`,
      `    <id>${escapeXml(url)}</id>`,
      published ? `    <published>${published}</published>` : null,
      updated ? `    <updated>${updated}</updated>` : null,
      `    <author><name>${escapeXml(post.authorName)}</name></author>`,
      `    <category term="${escapeXml(post.category)}"/>`,
      `    <summary>${escapeXml(post.excerpt)}</summary>`,
      post.coverImage && !post.coverImage.startsWith("/assets/")
        ? `    <link rel="enclosure" href="${escapeXml(absoluteUrl(post.coverImage))}"/>`
        : null,
      "  </entry>"
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
  });

  // Feed-level <updated> = newest entry date (required by Atom). Falls back to
  // the Unix epoch only when there are no dated posts at all, never to "now".
  const newest = posts
    .map((post) => toIsoOrNull(post.updatedAt) ?? toIsoOrNull(post.publishedAt))
    .filter((value): value is string => value !== null)
    .sort()
    .pop();

  const xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">',
    `  <title>${escapeXml(`${siteConfig.name} Blog`)}</title>`,
    `  <subtitle>${escapeXml("Practical guides on web design, web development, and branding for business owners and founders.")}</subtitle>`,
    `  <link rel="self" type="application/atom+xml" href="${escapeXml(feedUrl)}"/>`,
    `  <link rel="alternate" type="text/html" href="${escapeXml(blogUrl)}"/>`,
    `  <id>${escapeXml(blogUrl)}</id>`,
    `  <updated>${newest ?? new Date(0).toISOString()}</updated>`,
    `  <icon>${escapeXml(absoluteUrl(siteConfig.logoPath))}</icon>`,
    ...entries,
    "</feed>",
    ""
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      // A machine feed, not a search landing page: readable, but not indexed.
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600"
    }
  });
}
