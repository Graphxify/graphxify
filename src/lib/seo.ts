import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

/** Generated OG cards are always rendered at this size by /og. */
const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Appends " | GRAPHXIFY" unless the title already ends with the brand.
 *
 * CMS-authored `meta_title` / `seo_title` values are typically written with the
 * brand already on the end ("… Case Study | Graphxify"). Appending
 * unconditionally produced "… | Graphxify | GRAPHXIFY" on every CMS-driven page,
 * which wastes the ~60 characters Google will actually render and gets the tail
 * truncated. Matching is case-insensitive so either casing is recognised.
 */
function withBrandSuffix(title: string): string {
  const trimmed = title.trim();
  const brand = siteConfig.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const alreadyBranded = new RegExp(`[|\\u2013\\u2014-]\\s*${brand}\\s*$`, "i").test(trimmed);
  return alreadyBranded ? trimmed : `${trimmed} | ${siteConfig.name}`;
}

/**
 * Builds the URL of a generated 1200x630 Open Graph card for a page.
 * Used as the default share image so every page gets a correctly
 * proportioned card instead of one shared square image.
 */
export function ogImageUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title });
  if (eyebrow) {
    params.set("eyebrow", eyebrow);
  }
  return `/og?${params.toString()}`;
}

export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Eyebrow line on the generated OG card. Ignored when `image` is set. */
  ogEyebrow?: string;
  // Per-field OG overrides (used verbatim when provided)
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogImageAlt?: string | null;
  // Per-field Twitter overrides
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  twitterCard?: string | null;
  // Canonical override
  canonicalUrl?: string | null;
}): Metadata {
  const canonical = input.canonicalUrl?.trim() || new URL(input.path, siteConfig.url).toString();
  // Default to a generated 1200x630 card. Callers may still pass `image`
  // (a real cover photo, or a CMS override) to replace it.
  const generatedImage = ogImageUrl(input.title, input.ogEyebrow);
  const baseImage = input.image?.trim() || generatedImage;
  const pageTitle = withBrandSuffix(input.title);

  const ogTitle = input.ogTitle?.trim() || pageTitle;
  const ogDescription = input.ogDescription?.trim() || input.description;
  const ogImage = input.ogImage?.trim() || baseImage;

  const twitterCard = (input.twitterCard?.trim() as "summary" | "summary_large_image" | undefined) || "summary_large_image";
  const twitterTitle = input.twitterTitle?.trim() || ogTitle;
  const twitterDescription = input.twitterDescription?.trim() || ogDescription;
  const twitterImage = input.twitterImage?.trim() || ogImage;

  return {
    title: pageTitle,
    description: input.description,
    metadataBase: new URL(siteConfig.url),
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      shortcut: [{ url: "/favicon.ico" }],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    },
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          // Only declare dimensions for cards we generate — we know those are
          // exactly 1200x630. Asserting a size for arbitrary CMS images would
          // make scrapers letterbox or stretch them.
          ...(ogImage.startsWith("/og?") ? OG_IMAGE_SIZE : {}),
          ...(input.ogImageAlt?.trim() ? { alt: input.ogImageAlt.trim() } : {})
        }
      ]
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage]
    }
  };
}

/**
 * Public social profiles. Used as schema.org `sameAs` so search engines can
 * consolidate these accounts with the site into a single entity.
 */
export const socialProfiles = [
  "https://www.facebook.com/Graphxify",
  "https://www.instagram.com/graphxify",
  "https://www.tiktok.com/@graphxify",
  "https://www.behance.net/graphxify"
] as const;

/**
 * NOTE ON TYPE: this is deliberately `ProfessionalService` (a subtype of
 * Organization) and NOT `LocalBusiness`. Google requires a physical `address`
 * on LocalBusiness; without one the node is invalid and can be discarded
 * wholesale. If a real street address and a Google Business Profile are ever
 * added, switch back to ["LocalBusiness", "ProfessionalService"] and include
 * `address` + `geo` at the same time — not before.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/assets/logo-mark.svg`
    },
    image: `${siteConfig.url}/og`,
    description: siteConfig.description,
    telephone: "+16475700334",
    email: "info@graphxify.com",
    areaServed: "Worldwide",
    knowsAbout: ["Web Design", "Web Development", "Brand Identity", "Branding", "Digital Strategy", "CMS Architecture"],
    sameAs: [...socialProfiles],
    priceRange: "$$"
  };
}

export function breadcrumbListJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description
  };
}

export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  keywords?: string[];
  section?: string;
}) {
  const url = `${siteConfig.url}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url,
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.image ? { image: input.image.startsWith("http") ? input.image : `${siteConfig.url}${input.image}` } : {}),
    ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords.join(", ") } : {}),
    ...(input.section ? { articleSection: input.section } : {}),
    author: {
      "@type": "Organization",
      name: input.authorName ?? siteConfig.name,
      url: siteConfig.url
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/assets/logo-mark.svg`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  };
}

/**
 * Generates a standardised case-study page title.
 * Used by /works/[slug] generateMetadata and can be used by any CMS tool.
 *
 * Format: "{projectTitle} {industry} Case Study"
 * Slashes in industry strings are converted to spaces so
 * "Healthcare / Pharmacy" → "Healthcare Pharmacy Case Study".
 */
export function buildCaseStudyTitle(projectTitle: string, industry: string | null | undefined): string {
  const industryNorm = (industry ?? "")
    .replace(/\s*\/\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return industryNorm
    ? `${projectTitle} ${industryNorm} Case Study`
    : `${projectTitle} Case Study`;
}

export function creativeWorkJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    description: input.description,
    datePublished: input.datePublished,
    url: `${siteConfig.url}${input.path}`
  };
}
