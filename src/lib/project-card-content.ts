export const projectCardContent = [
  {
    slug: "northline-enterprise-replatform",
    industry: "Digital Platform",
    title: "FlyUp Line"
  },
  {
    slug: "vertex-brand-operations",
    industry: "Brand Identity",
    title: "Maven"
  },
  {
    slug: "axis-growth-platform",
    industry: "Brand Identity + Website",
    title: "BOSS RAAM Pharmacy"
  },
  {
    slug: "lumen-commerce-redesign",
    industry: "Brand Identity + Website",
    title: "Pharmacy On King"
  },
  {
    slug: "atlas-fintech-experience-hub",
    industry: "Brand Identity",
    title: "Luka Hair Salon"
  },
  {
    slug: "meridian-health-network-portal",
    industry: "Web Designer & Developer",
    title: "King Medical Art Pharmacy"
  }
] as const;

export const projectCardSlugs = projectCardContent.map((item) => item.slug);

const projectCardBySlug = new Map<string, (typeof projectCardContent)[number]>(
  projectCardContent.map((item) => [item.slug, item] as const)
);

export function getProjectCardContent(slug: string) {
  return projectCardBySlug.get(slug) ?? null;
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
