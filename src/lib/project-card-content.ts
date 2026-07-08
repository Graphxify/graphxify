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
    industry: "Travel and Aviation",
    cardServices: ["Website Design", "UX Strategy"],
    cardOutcome: "A responsive travel platform redesigned to simplify the booking experience and drive conversion.",
    title: "FlyUp Line",
    liveUrl: "https://flyupline.com/"
  },
  {
    slug: "vertex-brand-operations",
    pathSlug: "maven",
    industry: "Women's Fashion",
    cardServices: ["Brand", "Design System"],
    cardOutcome: "A complete brand identity system for a contemporary women's fashion label built around precision and typographic clarity.",
    title: "Maven"
  },
  {
    slug: "axis-growth-platform",
    pathSlug: "boss-medical-clinic",
    industry: "Healthcare / Medical Clinic",
    cardServices: ["Website Design", "Branding"],
    cardOutcome: "A professional clinic website built to communicate authority while remaining approachable.",
    title: "Boss Medical Clinic",
    liveUrl: "https://www.bossmedclinic.com/"
  },
  {
    slug: "lumen-commerce-redesign",
    pathSlug: "pharmacy-on-king",
    industry: "Healthcare / Pharmacy",
    cardServices: ["Website Design", "UI/UX"],
    cardOutcome: "An accessible, trust-focused website for a community-focused pharmacy.",
    title: "Pharmacy On King",
    liveUrl: "https://pharmacyonking.ca/"
  },
  {
    slug: "atlas-fintech-experience-hub",
    pathSlug: "luka-hair-salon",
    industry: "Beauty / Hair Salon",
    cardServices: ["Website Design", "Branding"],
    cardOutcome: "A polished salon website and visual identity built to attract and convert new clients.",
    title: "Luka Hair Salon"
  },
  {
    slug: "meridian-health-network-portal",
    pathSlug: "king-medical-art-pharmacy",
    industry: "Healthcare / Pharmacy",
    cardServices: ["Website Design", "UI/UX"],
    cardOutcome: "A refined, accessible pharmacy website built to improve usability and reinforce credibility.",
    title: "King Medical Arts Pharmacy",
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
  ["kite-commerce-experience-refresh", "meridian-health-network-portal"],
  // old path slug → new path slug (resolved to canonical below)
  ["boss-raam-pharmacy", "boss-medical-clinic"]
]);

function normalizeProjectSlug(slug: string): string {
  const direct = pathSlugToCanonicalSlug.get(slug);
  if (direct) return direct;
  const legacy = legacySlugToCanonicalSlug.get(slug);
  if (legacy) return pathSlugToCanonicalSlug.get(legacy) ?? legacy;
  return slug;
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
