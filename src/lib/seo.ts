import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const canonical = new URL(input.path, siteConfig.url).toString();
  const image = input.image || "/assets/og-default.svg";
  const title = `${input.title} | ${siteConfig.name}`;

  return {
    title,
    description: input.description,
    metadataBase: new URL(siteConfig.url),
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }]
    },
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      title,
      description: input.description,
      url: canonical,
      siteName: siteConfig.name,
      images: [{ url: image }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images: [image]
    }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/assets/logo-mark.svg`
    },
    description: siteConfig.description,
    telephone: "+16475700334",
    email: "info@graphxify.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mississauga",
      addressRegion: "Ontario",
      addressCountry: "CA"
    },
    areaServed: [
      { "@type": "City", name: "Toronto" },
      { "@type": "City", name: "Mississauga" },
      { "@type": "State", name: "Ontario" },
      { "@type": "Country", name: "Canada" }
    ],
    knowsAbout: ["Web Design", "Web Development", "Brand Identity", "Branding", "Digital Strategy", "CMS Architecture"],
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
