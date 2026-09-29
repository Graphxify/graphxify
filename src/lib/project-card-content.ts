/**
 * Canonical registry of CONFIRMED project facts (Daniel, 2026-09-29).
 *
 * These fields are authoritative over the CMS: `title` (official client
 * spelling), `industry` (normalized label), `year` (only when confirmed) and
 * `services` (only when confirmed). Everything else (copy, images, SEO text)
 * comes from the CMS. If the CMS disagrees with a fact here, the site renders
 * the fact and the build logs a drift warning (see reportProjectFactDrift in
 * db/queries/works.ts) so the CMS can be corrected. Change a fact here only
 * when Daniel confirms a new value.
 *
 * Self-contained on purpose — next.config.ts imports this module.
 */
type ProjectCardContentItem = {
  slug: string;
  pathSlug: string;
  /** Normalized industry label. */
  industry: string;
  cardServices: string[];
  cardOutcome: string;
  /** Official client/project name, exactly as the client writes it. */
  title: string;
  liveUrl?: string;
  /** Delivery year, set only when confirmed. Not a content-modified date. */
  year?: number;
  /** Full confirmed service list, set only when it completes/corrects the CMS. */
  services?: string[];
  /** Spellings of the name that must not appear (case-sensitive; drift check). */
  retiredNames?: string[];
  /** Classification terms that must not describe this project (drift check). */
  retiredTerms?: string[];
  /**
   * Exact phrase corrections applied to CMS text at render time (and mirrored in
   * supabase/drafts/confirmed-facts-2026-09-29.sql), so pages are correct even
   * before the CMS data is fixed. Exact phrases only — no prose rewriting.
   */
  copyCorrections?: ReadonlyArray<readonly [from: string, to: string]>;
};

export const projectCardContent: readonly ProjectCardContentItem[] = [
  {
    slug: "northline-enterprise-replatform",
    pathSlug: "flyup-line",
    industry: "Travel and Aviation",
    cardServices: ["Branding", "Website Design", "UX Strategy"],
    cardOutcome: "A responsive travel platform redesigned to simplify the booking experience and drive conversion.",
    title: "FlyUp Line",
    liveUrl: "https://flyupline.com/",
    year: 2025,
    // Branding confirmed by Daniel; Website Design + UX Strategy from the CMS record.
    services: ["Branding", "Website Design", "UX Strategy"]
  },
  {
    slug: "vertex-brand-operations",
    pathSlug: "maven",
    // Daniel: "fashion wear". Not classified more narrowly (e.g. streetwear,
    // women's fashion) unless project content later supports it.
    industry: "Fashion",
    cardServices: ["Brand", "Design System"],
    cardOutcome: "A complete brand identity system for a contemporary fashion label built around precision and typographic clarity.",
    title: "Maven",
    retiredTerms: ["streetwear", "women's fashion", "women’s fashion"],
    copyCorrections: [
      ["Women's Fashion Brand Identity", "Fashion Brand Identity"],
      ["Women’s Fashion Brand Identity", "Fashion Brand Identity"],
      ["women's fashion label", "fashion label"],
      ["women’s fashion label", "fashion label"],
      ["women's fashion brand", "fashion brand"],
      ["women’s fashion brand", "fashion brand"],
      ["streetwear label", "fashion label"]
    ]
  },
  {
    slug: "axis-growth-platform",
    pathSlug: "boss-medical-clinic",
    industry: "Healthcare / Medical Clinic",
    cardServices: ["Website Design", "Branding"],
    cardOutcome: "A professional clinic website built to communicate authority while remaining approachable.",
    title: "B.O.S.S. Medical Clinic",
    liveUrl: "https://www.bossmedclinic.com/",
    retiredNames: ["BOSS Medical Clinic", "Boss Medical Clinic", "B.O.S.S Medical Clinic"],
    copyCorrections: [
      ["B.O.S.S Medical Clinic", "B.O.S.S. Medical Clinic"],
      ["BOSS Medical Clinic", "B.O.S.S. Medical Clinic"],
      ["Boss Medical Clinic", "B.O.S.S. Medical Clinic"]
    ]
  },
  {
    slug: "lumen-commerce-redesign",
    pathSlug: "pharmacy-on-king",
    industry: "Healthcare / Pharmacy",
    cardServices: ["Website Design", "UI/UX"],
    cardOutcome: "An accessible, trust-focused website for a community-focused pharmacy.",
    title: "Pharmacy On King",
    liveUrl: "https://pharmacyonking.ca/",
    year: 2024
  },
  {
    slug: "atlas-fintech-experience-hub",
    pathSlug: "luka-hair-salon",
    industry: "Beauty / Hair Salon",
    cardServices: ["Website Design", "Branding"],
    cardOutcome: "A polished salon website and visual identity built to attract and convert new clients.",
    title: "Luka Hair Salon",
    year: 2023
  },
  {
    slug: "meridian-health-network-portal",
    pathSlug: "king-medical-art-pharmacy",
    industry: "Healthcare / Pharmacy",
    cardServices: ["Website Design", "UI/UX"],
    cardOutcome: "A refined, accessible pharmacy website built to improve usability and reinforce credibility.",
    title: "King Medical Arts Pharmacy",
    liveUrl: "https://www.kingmedicalartspharmacy.ca/",
    year: 2023
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

// Verified renames only: an earlier public slug for the SAME client project.
// `boss-raam-pharmacy` is the same CMS record as B.O.S.S. Medical Clinic (see
// supabase/seed-works-seo.sql). The former aliases northline-enterprise-platform,
// orion-saas-relaunch, solace-investor-relations-portal and
// kite-commerce-experience-refresh were removed on 2026-09-29: they were
// template demo projects (supabase/seed.sql) unrelated to any real case study,
// so they must 404 rather than redirect to an unrelated client's page.
const legacySlugToCanonicalSlug = new Map<string, string>([
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

/**
 * Non-public slugs that resolve to the SAME case study as their target, paired
 * with its public path slug. next.config.ts turns these into permanent
 * redirects. Two kinds, both verified equivalent (docs/SEO-AI-SEARCH-QC-REPORT.md):
 *  - internal keys ("northline-enterprise-replatform"): production served the
 *    identical real case study at these URLs (200 + canonical to the target);
 *  - verified renames (legacySlugToCanonicalSlug).
 * Self-contained on purpose — imported by next.config.ts, so no app imports.
 */
export function legacyWorkPathRedirects(): Array<readonly [from: string, to: string]> {
  const pairs = new Map<string, string>();
  for (const item of projectCardContent) {
    if (item.slug !== item.pathSlug) {
      pairs.set(item.slug, item.pathSlug);
    }
  }
  for (const legacySlug of legacySlugToCanonicalSlug.keys()) {
    const target = getProjectPathSlug(legacySlug);
    if (target !== legacySlug) {
      pairs.set(legacySlug, target);
    }
  }
  return Array.from(pairs.entries());
}

export function getProjectCardContent(slug: string) {
  return projectCardByCanonicalSlug.get(normalizeProjectSlug(slug)) ?? null;
}

export function getProjectDisplayTitle(slug: string, fallbackTitle: string) {
  return getProjectCardContent(slug)?.title ?? fallbackTitle;
}

/** Applies the project's exact-phrase copy corrections (official name, normalized industry terms). */
export function applyConfirmedCopy<T extends string | null | undefined>(slug: string, text: T): T {
  const corrections = getProjectCardContent(slug)?.copyCorrections;
  if (!text || !corrections) return text;
  let result: string = text;
  for (const [from, to] of corrections) {
    result = result.split(from).join(to);
  }
  return result as T;
}

/** Confirmed delivery year, or undefined when not confirmed. */
export function getConfirmedProjectYear(slug: string): number | undefined {
  return getProjectCardContent(slug)?.year;
}

/**
 * Applies the confirmed facts (name, industry, and year/services where
 * confirmed) on top of a CMS or fallback record. Only keys the item already
 * has are touched, so card/preview shapes keep their shape.
 */
export function withProjectCardContent<
  T extends { slug: string; title: string; industry?: string; liveUrl?: string; year?: number; services?: string[] }
>(item: T): T {
  const content = getProjectCardContent(item.slug);
  if (!content) {
    return item;
  }

  return {
    ...item,
    title: content.title,
    ...(typeof item.industry === "string" ? { industry: content.industry } : {}),
    ...(typeof item.year === "number" && content.year ? { year: content.year } : {}),
    ...(Array.isArray(item.services) && content.services ? { services: content.services } : {}),
    liveUrl: content.liveUrl ?? item.liveUrl
  } as T;
}

export type ProjectFactDrift = { slug: string; field: string; cms: string; confirmed: string };

/**
 * Compares CMS work rows with the confirmed facts. Pure (no logging), so it is
 * shared by the build-time warning and any future admin check.
 */
export function findProjectFactDrift(rows: ReadonlyArray<{ slug: string }>): ProjectFactDrift[] {
  const drift: ProjectFactDrift[] = [];
  for (const record of rows) {
    const row = record as Record<string, unknown> & { slug: string };
    const facts = getProjectCardContent(row.slug);
    if (!facts) continue;
    const slug = facts.pathSlug;
    if (typeof row.title === "string" && row.title.trim() !== facts.title) {
      drift.push({ slug, field: "title", cms: row.title, confirmed: facts.title });
    }
    if (typeof row.industry === "string" && row.industry.trim() !== facts.industry) {
      drift.push({ slug, field: "industry", cms: row.industry, confirmed: facts.industry });
    }
    if (facts.year && typeof row.year === "number" && row.year !== facts.year) {
      drift.push({ slug, field: "year", cms: String(row.year), confirmed: String(facts.year) });
    }
    if (facts.services && Array.isArray(row.services)) {
      const cmsServices = row.services as unknown[];
      if (facts.services.some((service) => !cmsServices.includes(service))) {
        drift.push({ slug, field: "services", cms: cmsServices.join(", "), confirmed: facts.services.join(", ") });
      }
    }
    for (const [field, value] of Object.entries(row)) {
      if (typeof value !== "string" || field === "slug") continue;
      // Names match case-sensitively, so the official "B.O.S.S. Medical Clinic"
      // never matches a retired variant by accident; terms match case-insensitively.
      const name = facts.retiredNames?.find((retired) => value.includes(retired));
      const term = facts.retiredTerms?.find((retired) => value.toLowerCase().includes(retired.toLowerCase()));
      if (name) drift.push({ slug, field, cms: `contains "${name}"`, confirmed: facts.title });
      if (term) drift.push({ slug, field, cms: `contains "${term}"`, confirmed: `industry: ${facts.industry}` });
    }
  }
  return drift;
}
