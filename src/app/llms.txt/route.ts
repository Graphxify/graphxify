import { getPublishedWorks } from "@/db/queries/works";
import { getPublishedBlogSummaries } from "@/lib/blog-data";
import { companyContact, serviceCatalog, siteConfig } from "@/lib/constants";
import { getProjectCardContent, getProjectDisplayTitle, getProjectPathSlug, resolveProjectSlugFromPathSlug } from "@/lib/project-card-content";
import { graphxifyProjects } from "@/lib/project-details";
import { canonicalUrl } from "@/lib/seo";

/**
 * /llms.txt — an optional, plain-text map of the site's public pages for
 * systems that choose to read it (https://llmstxt.org). It is generated from the
 * same data sources as the pages themselves (service catalogue, CMS works, CMS
 * posts), so it cannot drift out of sync.
 *
 * It is NOT a ranking signal: Google has said llms.txt is not used by Google
 * Search. Keep it factual — no marketing claims.
 */
export const revalidate = 3600;

type CaseStudyLine = { title: string; path: string; industry: string };

async function getCaseStudies(): Promise<CaseStudyLine[]> {
  const fromFallback = (): CaseStudyLine[] =>
    graphxifyProjects.map((project) => ({
      title: getProjectDisplayTitle(project.slug, project.title),
      path: `/works/${getProjectPathSlug(project.slug)}`,
      industry: getProjectCardContent(project.slug)?.industry ?? project.industry
    }));

  try {
    const works = await getPublishedWorks();
    if (works.length === 0) return fromFallback();
    const byPath = new Map<string, CaseStudyLine>();
    for (const work of works) {
      const canonical = resolveProjectSlugFromPathSlug(work.slug);
      const path = `/works/${getProjectPathSlug(canonical)}`;
      if (!byPath.has(path)) {
        byPath.set(path, {
          title: getProjectDisplayTitle(canonical, work.title),
          path,
          industry: getProjectCardContent(canonical)?.industry || work.industry?.trim() || ""
        });
      }
    }
    return Array.from(byPath.values());
  } catch {
    return fromFallback();
  }
}

export async function GET(): Promise<Response> {
  const [caseStudies, posts] = await Promise.all([
    getCaseStudies(),
    getPublishedBlogSummaries().catch(() => [])
  ]);

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.name} designs and builds brand identities, custom websites and CMS setups. It is based in Canada and works with businesses worldwide. Contact: ${companyContact.email}.`,
    "",
    "## Main pages",
    "",
    `- [Home](${canonicalUrl("/")})`,
    `- [About](${canonicalUrl("/about")}): who ${siteConfig.name} is and how the studio works`,
    `- [Services](${canonicalUrl("/services")}): overview of all services`,
    `- [Process](${canonicalUrl("/process")}): the four project stages, deliverables and typical durations`,
    `- [Work](${canonicalUrl("/works")}): portfolio of case studies`,
    `- [Blog](${canonicalUrl("/blog")}): articles on web design, development and branding`,
    `- [Contact](${canonicalUrl("/contact")}): project inquiry form, email and phone`,
    "",
    "## Services",
    "",
    ...serviceCatalog.map((service) => `- [${service.name}](${canonicalUrl(service.path)}): ${service.description}`),
    "",
    "## Case studies",
    "",
    ...caseStudies.map((item) => `- [${item.title}](${canonicalUrl(item.path)})${item.industry ? `: ${item.industry}` : ""}`),
    "",
    "## Articles",
    "",
    // Title + category only: excerpts are marketing copy, and this file should stay strictly factual.
    ...posts.map((post) => `- [${post.title}](${canonicalUrl(`/blog/${post.slug}`)}): ${post.category}`),
    "",
    "## Optional",
    "",
    `- [Website growth checklist](${canonicalUrl("/resources/website-growth-checklist")})`,
    `- [Privacy policy](${canonicalUrl("/privacy")})`,
    `- [Terms and conditions](${canonicalUrl("/terms")})`,
    `- [Sitemap](${canonicalUrl("/sitemap.xml")})`,
    `- [Blog feed](${canonicalUrl("/feed.xml")})`,
    ""
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // For tools that read it directly; it should not appear as a search result.
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
