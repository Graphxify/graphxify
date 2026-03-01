import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const canonical = new URL(input.path, siteConfig.url).toString();
  const image = input.image || "/opengraph-image";

  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: siteConfig.name,
      images: [{ url: image }]
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image]
    }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: []
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

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: "Global",
    url: `${siteConfig.url}${input.path}`
  };
}

export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name
    },
    mainEntityOfPage: `${siteConfig.url}${input.path}`
  };
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
    url: `${siteConfig.url}${input.path}`,
    creator: {
      "@type": "Organization",
      name: siteConfig.name
    }
  };
}
