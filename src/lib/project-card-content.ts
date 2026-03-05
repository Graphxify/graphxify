export const projectCardContent = [
  {
    slug: "northline-enterprise-replatform",
    pathSlug: "flyup-line",
    industry: "Digital Platform",
    title: "FlyUp Line"
  },
  {
    slug: "vertex-brand-operations",
    pathSlug: "maven",
    industry: "Brand Identity",
    title: "Maven"
  },
  {
    slug: "axis-growth-platform",
    pathSlug: "boss-raam-pharmacy",
    industry: "Brand Identity + Website",
    title: "BOSS RAAM Pharmacy"
  },
  {
    slug: "lumen-commerce-redesign",
    pathSlug: "pharmacy-on-king",
    industry: "Brand Identity + Website",
    title: "Pharmacy On King"
  },
  {
    slug: "atlas-fintech-experience-hub",
    pathSlug: "luka-hair-salon",
    industry: "Brand Identity",
    title: "Luka Hair Salon"
  },
  {
    slug: "meridian-health-network-portal",
    pathSlug: "king-medical-art-pharmacy",
    industry: "Web Designer & Developer",
    title: "King Medical Art Pharmacy"
  }
] as const;

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

export function withProjectCardContent<T extends { slug: string; title: string; industry?: string }>(item: T): T {
  const content = getProjectCardContent(item.slug);
  if (!content) {
    return item;
  }

  return {
    ...item,
    title: content.title,
    ...(typeof item.industry === "string" ? { industry: content.industry } : {})
  } as T;
}
