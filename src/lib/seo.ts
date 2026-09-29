import type { Metadata } from "next";
import { companyContact, serviceCatalog, siteConfig, type ServiceKey } from "@/lib/constants";

/** Generated OG cards are always rendered at this size by /og. */
const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// ── Stable entity identifiers ────────────────────────────────────────────────
// Every JSON-LD node on the site points at these instead of repeating a fresh,
// disconnected Organization object, so search engines resolve one entity graph.
export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;
const LOGO_ID = `${siteConfig.url}/#logo`;

type JsonLdNode = Record<string, unknown>;

/** Resolves a site-relative path (or passes through an absolute URL) to an absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return new URL(pathOrUrl, `${siteConfig.url}/`).toString();
}

/** Canonical absolute URL for a site path. The homepage resolves to the bare origin. */
export function canonicalUrl(path: string): string {
  if (!path || path === "/") {
    return siteConfig.url;
  }
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Appends " | Graphxify" unless the title already ends with the brand.
 *
 * CMS-authored `meta_title` / `seo_title` values are typically written with the
 * brand already on the end ("… Case Study | Graphxify"). Appending
 * unconditionally produced "… | Graphxify | Graphxify" on every CMS-driven page,
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

/**
 * Social scrapers (Facebook, LinkedIn, X) do not render SVG share images, so an
 * SVG override (e.g. a placeholder like /assets/post-3.svg left in a CMS
 * og_image field) would produce a blank preview. Such values are ignored and
 * the next candidate (cover photo, then generated card) is used instead.
 */
function usableShareImage(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return /\.svg(\?|#|$)/i.test(trimmed) ? undefined : trimmed;
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
  /** Advertise the blog Atom feed (/feed.xml) via <link rel="alternate">. */
  rss?: boolean;
  /** Keep the page out of the index (still followable). */
  noIndex?: boolean;
}): Metadata {
  const canonical = input.canonicalUrl?.trim() || canonicalUrl(input.path);
  // Default to a generated 1200x630 card. Callers may still pass `image`
  // (a real cover photo, or a CMS override) to replace it.
  const generatedImage = ogImageUrl(input.title, input.ogEyebrow);
  const baseImage = usableShareImage(input.image) || generatedImage;
  const pageTitle = withBrandSuffix(input.title);

  const ogTitle = input.ogTitle?.trim() || pageTitle;
  const ogDescription = input.ogDescription?.trim() || input.description;
  const ogImage = usableShareImage(input.ogImage) || baseImage;
  const ogImageAlt = input.ogImageAlt?.trim() || ogTitle;

  const twitterCard = (input.twitterCard?.trim() as "summary" | "summary_large_image" | undefined) || "summary_large_image";
  const twitterTitle = input.twitterTitle?.trim() || ogTitle;
  const twitterDescription = input.twitterDescription?.trim() || ogDescription;
  const twitterImage = usableShareImage(input.twitterImage) || ogImage;

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
      canonical,
      ...(input.rss ? { types: { "application/atom+xml": [{ url: "/feed.xml", title: `${siteConfig.name} Blog` }] } } : {})
    },
    ...(input.noIndex ? { robots: { index: false, follow: true } } : {}),
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
          ...(ogImage.startsWith("/og?") ? { ...OG_IMAGE_SIZE, type: "image/png" } : {}),
          alt: ogImageAlt
        }
      ]
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: [{ url: twitterImage, alt: ogImageAlt }]
    }
  };
}

/**
 * Official Graphxify social profiles (the same four linked in the site footer
 * and stored in dashboard settings). Used as schema.org `sameAs` so search
 * engines can consolidate these accounts with the site into a single entity.
 * Add LinkedIn / Dribbble / Clutch here only once those profiles really exist.
 */
export const socialProfiles = [
  "https://www.facebook.com/Graphxify",
  "https://www.instagram.com/graphxify",
  "https://www.tiktok.com/@graphxify",
  "https://www.behance.net/graphxify"
] as const;

/**
 * NOTE ON TYPE: this is deliberately plain `Organization`. The previous
 * `ProfessionalService` type is a schema.org subtype of `LocalBusiness`, which
 * Google expects to carry a full street `address`. Graphxify is based in Canada
 * and works with clients worldwide but publishes no office address, so a
 * LocalBusiness-family type would be inaccurate. The `address` below is
 * country-level only (no street, city or office). If a real, public business
 * address and a Google Business Profile ever exist, revisit this — not before.
 *
 * Only verified facts from the codebase are included: name, URL, logo, contact
 * email/phone (footer + contact page), country (Canada) and service area
 * (worldwide), and social profiles.
 * No founder, address, founding date, ratings or price range — see
 * docs/ENTITY-DATA-NEEDED.md for what is still required.
 */
export function organizationJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: absoluteUrl(siteConfig.logoPath),
      contentUrl: absoluteUrl(siteConfig.logoPath),
      width: 512,
      height: 512,
      caption: siteConfig.name
    },
    image: { "@id": LOGO_ID },
    description: siteConfig.description,
    email: companyContact.email,
    telephone: companyContact.phoneHref,
    address: { "@type": "PostalAddress", addressCountry: companyContact.country },
    areaServed: companyContact.serviceArea,
    knowsAbout: [...serviceCatalog.map((service) => service.name), "Brand Identity", "Next.js"],
    makesOffer: serviceCatalog.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": serviceId(service.path),
        name: service.name,
        url: canonicalUrl(service.path)
      }
    })),
    sameAs: [...socialProfiles]
  };
}

export function websiteJsonLd(): JsonLdNode {
  // No SearchAction: the site has no search results page to point it at.
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID }
  };
}

export function breadcrumbListJsonLd(items: Array<{ name: string; url: string }>): JsonLdNode {
  const last = items[items.length - 1];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(last ? { "@id": `${last.url}#breadcrumb` } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function serviceId(path: string): string {
  return `${canonicalUrl(path)}#service`;
}

/** schema.org Service for one of the four real service pages, linked to the Organization. */
export function serviceJsonLd(key: ServiceKey): JsonLdNode {
  const service = serviceCatalog.find((item) => item.key === key);
  if (!service) {
    throw new Error(`Unknown service key: ${key}`);
  }
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": serviceId(service.path),
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: canonicalUrl(service.path),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: companyContact.serviceArea
  };
}

/** /services index: an ItemList whose items reference the Service entities above. */
export function servicesItemListJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonicalUrl("/services")}#services`,
    name: `${siteConfig.name} services`,
    url: canonicalUrl("/services"),
    itemListElement: serviceCatalog.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        "@id": serviceId(service.path),
        name: service.name,
        description: service.description,
        url: canonicalUrl(service.path),
        provider: { "@id": ORGANIZATION_ID },
        areaServed: companyContact.serviceArea
      }
    }))
  };
}

/** Default CMS byline. Posts carrying it are attributed to the Organization, not a person. */
const TEAM_AUTHOR_NAMES = new Set(["graphxify team", "graphxify"]);

function articleAuthor(authorName?: string): JsonLdNode {
  const name = authorName?.trim();
  if (!name || TEAM_AUTHOR_NAMES.has(name.toLowerCase())) {
    return { "@id": ORGANIZATION_ID };
  }
  // A named CMS author. Only the name is known — no profile URL is invented.
  return { "@type": "Person", name, worksFor: { "@id": ORGANIZATION_ID } };
}

export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  path: string;
  /** Must come from the CMS record. Omitted from the output when unknown. */
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  keywords?: string[];
  section?: string;
  wordCount?: number;
}): JsonLdNode {
  const url = canonicalUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: input.title,
    description: input.description,
    url,
    inLanguage: "en",
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords.join(", ") } : {}),
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    author: articleAuthor(input.authorName),
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@type": "Blog", "@id": `${canonicalUrl("/blog")}#blog`, name: `${siteConfig.name} Blog`, url: canonicalUrl("/blog") },
    mainEntityOfPage: { "@type": "WebPage", "@id": url }
  };
}

/** /blog index: a Blog entity listing its posts. */
export function blogJsonLd(posts: Array<{ title: string; slug: string; publishedAt?: string }>): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${canonicalUrl("/blog")}#blog`,
    name: `${siteConfig.name} Blog`,
    url: canonicalUrl("/blog"),
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${canonicalUrl(`/blog/${post.slug}`)}#article`,
      headline: post.title,
      url: canonicalUrl(`/blog/${post.slug}`),
      ...(post.publishedAt ? { datePublished: post.publishedAt } : {})
    }))
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

/**
 * A portfolio project as a schema.org CreativeWork (there is no "CaseStudy"
 * type). Only fields present in the CMS / project record are emitted — no
 * invented client names, metrics or ratings.
 *
 * No `dateCreated` / `datePublished`: only the delivery YEAR is confirmed, and a
 * year must not be turned into a precise date. (The CMS `updated_at` is a
 * content-edit time, not the project date, so it is not used either.)
 */
export function caseStudyJsonLd(input: {
  title: string;
  description: string;
  path: string;
  industry?: string;
  services?: string[];
  images?: string[];
  liveUrl?: string;
}): JsonLdNode {
  const url = canonicalUrl(input.path);
  const images = Array.from(new Set((input.images ?? []).filter(Boolean).map((src) => absoluteUrl(src))));
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: input.title,
    headline: input.title,
    description: input.description,
    url,
    inLanguage: "en",
    creator: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    ...(input.industry ? { about: { "@type": "Thing", name: input.industry } } : {}),
    ...(input.services && input.services.length > 0 ? { keywords: input.services.join(", ") } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    ...(input.liveUrl ? { mentions: { "@type": "WebSite", url: input.liveUrl, name: input.title } } : {}),
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${canonicalUrl("/works")}#collection`,
      name: `${siteConfig.name} portfolio`,
      url: canonicalUrl("/works")
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url }
  };
}

/** /works index: a CollectionPage whose ItemList links every case study. */
export function worksCollectionJsonLd(items: Array<{ title: string; path: string }>): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl("/works")}#collection`,
    name: `${siteConfig.name} portfolio`,
    url: canonicalUrl("/works"),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: canonicalUrl(item.path),
        name: item.title
      }))
    }
  };
}
