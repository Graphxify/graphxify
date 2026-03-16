type ProjectCardContentItem = {
  slug: string;
  pathSlug: string;
  industry: string;
  cardServices: string[];
  cardOutcome: string;
  title: string;
  liveUrl?: string;
};

export const projectCardContent: readonly ProjectCardContentItem[] = [
  {
    slug: "northline-enterprise-replatform",
    pathSlug: "flyup-line",
    industry: "Travel Platform",
    cardServices: ["Brand Identity", "Web Design", "Development"],
    cardOutcome: "A modern platform redesigned to simplify flight discovery and travel browsing.",
    title: "Flyup Line",
    liveUrl: "https://flyupline.com/"
  },
  {
    slug: "vertex-brand-operations",
    pathSlug: "maven",
    industry: "B2B Platform",
    cardServices: ["Brand Systems", "Web Design", "Governance"],
    cardOutcome: "A brand governance toolkit built for multi-team campaign delivery.",
    title: "Maven"
  },
  {
    slug: "axis-growth-platform",
    pathSlug: "boss-raam-pharmacy",
    industry: "Healthcare",
    cardServices: ["Brand Identity", "Web Design", "Development"],
    cardOutcome: "Full brand identity and website built for a modern Canadian pharmacy.",
    title: "Boss Raam Pharmacy",
    liveUrl: "https://www.bossmedclinic.com/"
  },
  {
    slug: "lumen-commerce-redesign",
    pathSlug: "pharmacy-on-king",
    industry: "Healthcare",
    cardServices: ["Brand Identity", "Web Design", "Development"],
    cardOutcome: "Brand refresh and digital presence for a trusted downtown pharmacy.",
    title: "Pharmacy on King",
    liveUrl: "https://pharmacyonking.ca/"
  },
  {
    slug: "atlas-fintech-experience-hub",
    pathSlug: "luka-hair-salon",
    industry: "Beauty",
    cardServices: ["Brand Identity"],
    cardOutcome: "A refined identity built to reflect the studio's premium positioning.",
    title: "Luka Hair Salon"
  },
  {
    slug: "meridian-health-network-portal",
    pathSlug: "king-medical-art-pharmacy",
    industry: "Healthcare",
    cardServices: ["Web Design", "Development"],
    cardOutcome: "A professional website built to serve a medical arts pharmacy with clarity.",
    title: "King Medical Arts",
    liveUrl: "https://www.kingmedicalartspharmacy.ca/"
  }
];

export const projectCardSlugs = projectCardContent.map((item) => item.slug);
export const projectCardPathSlugs = projectCardContent.map((item) => item.pathSlug);

const projectCardByCanonicalSlug = new Map<string, (typeof projectCardContent)[number]>(
  projectCardContent.map((item) => [item.slug, item] as const)
);

const pathSlugToCanonicalSlug = new Map<string, string>(
  projectCardContent.map((item) => [item.pathSlug, item.slug] as const)
);

const legacySlugToCanonicalSlug = new Map<string, string>([
  ["northline-enterprise-platform", "northline-enterprise-replatform"],
  ["orion-saas-relaunch", "lumen-commerce-redesign"],
  ["solace-investor-relations-portal", "atlas-fintech-experience-hub"],
  ["kite-commerce-experience-refresh", "meridian-health-network-portal"]
]);

function normalizeProjectSlug(slug: string): string {
  return pathSlugToCanonicalSlug.get(slug) ?? legacySlugToCanonicalSlug.get(slug) ?? slug;
}

export function resolveProjectSlugFromPathSlug(pathSlug: string): string {
  return normalizeProjectSlug(pathSlug);
}

export function getProjectPathSlug(slug: string): string {
  const normalizedSlug = normalizeProjectSlug(slug);
  return projectCardByCanonicalSlug.get(normalizedSlug)?.pathSlug ?? normalizedSlug;
}

export function getProjectCardContent(slug: string) {
  return projectCardByCanonicalSlug.get(normalizeProjectSlug(slug)) ?? null;
}

export function getProjectDisplayTitle(slug: string, fallbackTitle: string) {
  return getProjectCardContent(slug)?.title ?? fallbackTitle;
}

export function withProjectCardContent<T extends { slug: string; title: string; industry?: string; liveUrl?: string }>(item: T): T {
  const content = getProjectCardContent(item.slug);
  if (!content) {
    return item;
  }

  return {
    ...item,
    title: content.title,
    // Prefer the item's own industry (from CMS or fallback project) when it is meaningful;
    // only substitute the hardcoded value when the item has no industry set.
    ...(typeof item.industry === "string" ? { industry: item.industry || content.industry } : {}),
    liveUrl: content.liveUrl ?? item.liveUrl
  } as T;
}
