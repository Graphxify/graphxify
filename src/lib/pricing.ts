/**
 * Single source of truth for published starting prices.
 *
 * Consumed by /pricing and by the pricing callout on each /services/* page, so
 * a figure only ever has to change in one place. Tier keys mirror the
 * "Project Scope" options in the contact form (BUDGET_OPTIONS in
 * contact-page-content.tsx) — keep those in sync if a tier is added or renamed.
 */

export type PricingTier = {
  key: string;
  name: string;
  /** Display string with thousands separator, e.g. "2,000". */
  price: string;
  currency: "USD";
  timeline: string;
  summary: string;
  /** The /services/* page that explains this scope in depth. */
  serviceHref: string;
  featured?: boolean;
  includes: readonly string[];
};

export const pricingTiers: readonly PricingTier[] = [
  {
    key: "brand-identity",
    name: "Brand Identity",
    price: "1,200",
    currency: "USD",
    timeline: "2 to 3 weeks",
    summary: "A complete visual identity built from scratch — for new businesses, or ones that have outgrown a DIY logo.",
    serviceHref: "/services/brand-systems",
    includes: [
      "Logo suite (primary, secondary, icon)",
      "Typography system with font files",
      "Colour palette with hex, RGB, and CMYK",
      "Brand guidelines document (PDF)",
      "Social media templates",
      "Full asset export package"
    ]
  },
  {
    key: "starter-website",
    name: "Starter Website",
    price: "2,000",
    currency: "USD",
    timeline: "3 to 4 weeks",
    summary: "A focused, custom-built site that covers the essentials properly — the right starting point for most small businesses.",
    serviceHref: "/services/web-design",
    featured: true,
    includes: [
      "Up to 5 custom-designed pages",
      "Mobile-first, responsive layouts",
      "Custom Next.js build (you own the code)",
      "Contact forms and analytics",
      "Basic CMS so you can edit content",
      "Accessibility review (WCAG guidelines)"
    ]
  },
  {
    key: "professional-website",
    name: "Professional Website",
    price: "4,500",
    currency: "USD",
    timeline: "4 to 6 weeks",
    summary: "A larger custom site with a full content system, built for businesses that publish regularly and care about search.",
    serviceHref: "/services/web-development",
    includes: [
      "Everything in Starter Website",
      "8 to 15 pages with custom layouts",
      "Full CMS with roles and workflows",
      "Technical SEO and structured data",
      "Lighthouse scores above 90",
      "Integrations (CRM, forms, analytics)"
    ]
  },
  {
    key: "full-brand-website",
    name: "Full Brand + Website",
    price: "6,500",
    currency: "USD",
    timeline: "6 to 8 weeks",
    summary: "Brand and website designed together as one system, in a single engagement — nothing retrofitted afterwards.",
    serviceHref: "/services",
    includes: [
      "Complete brand identity package",
      "Professional Website build",
      "Brand applied across every touchpoint",
      "Content model design and documentation",
      "Editor training guide",
      "Post-launch handover and documentation"
    ]
  }
] as const;

export function getPricingTier(key: string): PricingTier {
  const tier = pricingTiers.find((candidate) => candidate.key === key);
  if (!tier) {
    throw new Error(`Unknown pricing tier: ${key}`);
  }
  return tier;
}

/** Numeric form for schema.org Offer/price, e.g. "2,000" -> "2000". */
export function tierPriceNumeric(tier: PricingTier): string {
  return tier.price.replace(/,/g, "");
}
