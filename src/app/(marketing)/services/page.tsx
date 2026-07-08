export const revalidate = 60;

import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/marketing/services-page-content";
import { getPublishedWorks } from "@/db/queries/works";
import { normalizeImage, firstGalleryImage, withImageVersion } from "@/lib/content-helpers";
import { projectCardContent, resolveProjectSlugFromPathSlug, withProjectCardContent } from "@/lib/project-card-content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";

const servicesSchemaData = [
  { name: "Brand Identity & Brand Systems", description: "Logo systems, typography, colour palettes, brand voice, and brand guidelines for modern businesses." },
  { name: "Web Design", description: "Custom website interface design built for clarity, hierarchy, and conversion — mobile-first, responsive layouts." },
  { name: "Web Development", description: "Custom-coded websites on modern frameworks like Next.js, built for performance, security, and long-term maintainability." },
  { name: "CMS Architecture", description: "Structured content management systems with defined roles, workflows, and content models your team can manage confidently." }
];

function servicesPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Graphxify Services",
    description: "Web design, branding, web development, and CMS services for businesses worldwide.",
    url: `${siteConfig.url}/services`,
    itemListElement: servicesSchemaData.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url
        },
        areaServed: "Worldwide"
      }
    }))
  };
}

export const metadata: Metadata = buildMetadata({
  title: "Web Design & Branding Services for Growing Businesses",
  description: "Professional web design, branding, web development, and CMS services for businesses worldwide. Graphxify delivers structured, high-performance digital solutions to businesses everywhere.",
  path: "/services",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "Web Design, Branding & Development Services | Graphxify",
  ogDescription: "Brand identity, web design, custom development, and CMS architecture — four focused services built for modern businesses ready to grow.",
  ogImageAlt: "Graphxify services — brand systems, web design, web development, and CMS architecture"
});

type WorkCard = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

async function getWorkCards(): Promise<WorkCard[]> {
  const fallbackBySlug = new Map(graphxifyProjects.map((project) => [project.slug, project]));

  const buildCanonicalCards = (
    cmsBySlug: Map<
      string,
      {
        id: string;
        title: string;
        slug: string;
        cover_image_url: string | null;
        gallery_images?: string[] | null;
        updated_at?: string | null;
      }
    > = new Map()
  ): WorkCard[] =>
    projectCardContent.map((card, index) => {
      const fallback = getProjectBySlug(card.slug) ?? fallbackBySlug.get(card.slug);
      const cms = cmsBySlug.get(card.slug);
      const coverImageBase =
        normalizeImage(cms?.cover_image_url) ??
        firstGalleryImage(cms?.gallery_images) ??
        fallback?.coverImage ??
        `/assets/work-${(index % 3) + 1}.svg`;

      return withProjectCardContent({
        id: cms?.id ?? fallback?.id ?? `work-card-${index + 1}`,
        slug: card.slug,
        title: cms?.title ?? fallback?.title ?? card.title,
        coverImage: cms ? withImageVersion(coverImageBase, cms.updated_at ?? null) : coverImageBase
      });
    });

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      const cmsBySlug = new Map<string, (typeof cmsWorks)[number]>();
      for (const work of cmsWorks) {
        const canonicalSlug = resolveProjectSlugFromPathSlug(work.slug);
        const existing = cmsBySlug.get(canonicalSlug);
        const existingUpdated = Number.isFinite(Date.parse(existing?.updated_at ?? "")) ? Date.parse(existing?.updated_at ?? "") : 0;
        const candidateUpdated = Number.isFinite(Date.parse(work.updated_at ?? "")) ? Date.parse(work.updated_at ?? "") : 0;
        if (!existing || candidateUpdated >= existingUpdated) {
          cmsBySlug.set(canonicalSlug, work);
        }
      }
      return buildCanonicalCards(cmsBySlug);
    }
  } catch {
    // fallback below
  }

  return buildCanonicalCards();
}

export default async function ServicesPage() {
  const works = await getWorkCards();
  return (
    <>
      <JsonLd data={servicesPageJsonLd() as Record<string, unknown>} />
      <ServicesPageContent works={works.slice(0, 3)} />
    </>
  );
}
