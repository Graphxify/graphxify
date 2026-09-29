import type { ServiceKey } from "@/lib/constants";

/**
 * Industry landing pages (/industries/[slug]).
 *
 * Architecture only. A page is rendered, prerendered and listed in the sitemap
 * ONLY when `published: true`. Publish an entry only when it has substantial,
 * original, factual copy written from real project experience — never
 * templated text with the industry name swapped in, never a city list. See
 * docs/INDUSTRY-PAGE-OPPORTUNITIES.md for the evidence each candidate still needs.
 */
export type IndustryPage = {
  slug: string;
  published: boolean;
  /** e.g. "Healthcare & Pharmacy" */
  name: string;
  /** <title> (brand suffix is added automatically) */
  seoTitle: string;
  seoDescription: string;
  /** Visible H1 */
  heading: string;
  /** Opening paragraph: who this is for and what Graphxify does for them. */
  intro: string;
  /** Real problems websites in this industry have, in Graphxify's own words. */
  challenges: Array<{ title: string; body: string }>;
  /** How Graphxify approaches this industry (process, content, compliance). */
  approach: Array<{ title: string; body: string }>;
  /** Only services Graphxify really delivered for this industry. */
  services: ServiceKey[];
  /** Public case-study path slugs (e.g. "pharmacy-on-king"). */
  caseStudies: string[];
  /** Blog slugs that genuinely relate to the industry. */
  relatedPosts: string[];
  /** Answered from experience; shown as visible Q&A (no FAQPage schema). */
  faqs: Array<{ q: string; a: string }>;
};

/**
 * Candidate drafts. Structural facts only (which real projects and services
 * relate); every copy field is intentionally empty until written from real
 * experience, which keeps these unpublishable by construction.
 */
export const industryPages: IndustryPage[] = [
  {
    slug: "healthcare",
    published: false,
    name: "Healthcare & Pharmacy",
    seoTitle: "",
    seoDescription: "",
    heading: "",
    intro: "",
    challenges: [],
    approach: [],
    services: ["web-design", "brand-systems"],
    caseStudies: ["pharmacy-on-king", "king-medical-art-pharmacy", "boss-medical-clinic"],
    relatedPosts: [],
    faqs: []
  }
];

/** True only when an entry is marked published AND has the minimum real content. */
function isPublishable(page: IndustryPage): boolean {
  return (
    page.published &&
    page.seoTitle.trim().length > 0 &&
    page.seoDescription.trim().length > 0 &&
    page.heading.trim().length > 0 &&
    page.intro.trim().split(/\s+/).length >= 60 &&
    page.challenges.length >= 2 &&
    page.approach.length >= 2 &&
    page.caseStudies.length >= 1
  );
}

export function getPublishedIndustryPages(): IndustryPage[] {
  return industryPages.filter(isPublishable);
}

export function getPublishedIndustryPage(slug: string): IndustryPage | null {
  return getPublishedIndustryPages().find((page) => page.slug === slug) ?? null;
}
