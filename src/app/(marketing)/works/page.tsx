export const revalidate = 60;

import type { Metadata } from "next";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { getPublishedWorks } from "@/db/queries/works";
import { CtaBlock } from "@/components/site/cta-block";
import { PageHero } from "@/components/site/page-hero";
import { ProjectStage } from "@/components/site/project-stage";
import { Reveal } from "@/components/site/reveal";
import { normalizeImage, firstGalleryImage, withImageVersion } from "@/lib/content-helpers";
import {
  applyConfirmedCopy,
  getProjectCardContent,
  getProjectDisplayTitle,
  getProjectPathSlug,
  projectCardContent,
  resolveProjectSlugFromPathSlug,
  withProjectCardContent
} from "@/lib/project-card-content";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbListJsonLd, buildMetadata, canonicalUrl, worksCollectionJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Web Design & Branding Portfolio",
  description:
    "Explore Graphxify's portfolio of web design, branding, and development work — real brand identities and high-performance sites for businesses worldwide.",
  path: "/works",
  ogTitle: "Portfolio — Real Projects by Graphxify",
  ogDescription: "Brand identities, custom websites, and digital platforms for businesses worldwide. Every project is built for performance, clarity, and long-term impact.",
  ogImageAlt: "Graphxify portfolio — web design and branding case studies for modern businesses"
});

type WorkCard = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  /** [cover, ...gallery] in CMS order, the indexing project-art.ts expects. */
  images: string[];
  cardServices: string[];
  cardOutcome: string;
  industry: string;
};

async function getWorkCards(): Promise<WorkCard[]> {
  const fallbackBySlug = new Map(graphxifyProjects.map((project) => [project.slug, project]));

  // Build cards from CMS as the primary source (sorted by sort_order from the query)
  const buildCardsFromCms = (cmsWorks: Awaited<ReturnType<typeof getPublishedWorks>>): WorkCard[] =>
    cmsWorks.map((cms, index) => {
      const canonicalSlug = resolveProjectSlugFromPathSlug(cms.slug);
      const fallback = getProjectBySlug(canonicalSlug) ?? fallbackBySlug.get(canonicalSlug);
      const cardMeta = getProjectCardContent(canonicalSlug);

      const coverImageBase =
        normalizeImage(cms.cover_image_url) ??
        firstGalleryImage(cms.gallery_images) ??
        fallback?.coverImage ??
        `/assets/work-${(index % 3) + 1}.svg`;

      // CMS fields take priority; local hardcoded data is the fallback
      const cmsCardServices = Array.isArray(cms.card_services) && cms.card_services.length > 0
        ? cms.card_services
        : null;

      return withProjectCardContent({
        id: cms.id,
        slug: canonicalSlug,
        title: cms.title ?? fallback?.title ?? cardMeta?.title ?? "",
        coverImage: withImageVersion(coverImageBase, cms.updated_at ?? null),
        images: Array.from(new Set([coverImageBase, ...(cms.gallery_images ?? []).map((src) => normalizeImage(src)).filter((src): src is string => Boolean(src))])),
        industry: cms.industry || cardMeta?.industry || fallback?.industry || "",
        // Confirmed service facts (e.g. FlyUp Line branding) take precedence over CMS tags.
        cardServices: (cardMeta?.services ? cardMeta.cardServices : null) ?? cmsCardServices ?? cardMeta?.cardServices ?? [],
        cardOutcome: applyConfirmedCopy(canonicalSlug, cms.card_outcome) || cardMeta?.cardOutcome || ""
      });
    });

  // Local fallback when CMS is unavailable
  const buildFallbackCards = (): WorkCard[] =>
    projectCardContent.map((card, index) => {
      const fallback = getProjectBySlug(card.slug) ?? fallbackBySlug.get(card.slug);
      const cardMeta = getProjectCardContent(card.slug);
      const coverImageBase = fallback?.coverImage ?? `/assets/work-${(index % 3) + 1}.svg`;
      return withProjectCardContent({
        id: fallback?.id ?? `work-card-${index + 1}`,
        slug: card.slug,
        title: fallback?.title ?? card.title,
        coverImage: coverImageBase,
        images: [coverImageBase, ...(fallback?.images ?? []).map((image) => image.src)],
        industry: cardMeta?.industry ?? "",
        cardServices: cardMeta?.cardServices ?? [],
        cardOutcome: cardMeta?.cardOutcome ?? ""
      });
    });

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      // Deduplicate by canonical slug, keep the one with the latest updated_at
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
      // Preserve query sort order (sort_order ASC, year DESC from the DB)
      const dedupedWorks = cmsWorks
        .filter((w) => cmsBySlug.get(resolveProjectSlugFromPathSlug(w.slug))?.id === w.id);
      return buildCardsFromCms(dedupedWorks);
    }
  } catch {
    // local fallback below
  }

  return buildFallbackCards();
}

export default async function WorksPage() {
  const works = await getWorkCards();

  return (
    <>
      <JsonLd
        data={worksCollectionJsonLd(
          works.map((work) => ({
            title: getProjectDisplayTitle(work.slug, work.title),
            path: `/works/${getProjectPathSlug(work.slug)}`
          }))
        )}
      />
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: "Home", url: canonicalUrl("/") },
          { name: "Work", url: canonicalUrl("/works") }
        ])}
      />
      <ContentRefreshListener pathPrefixes={["/works"]} />

      <PageHero
        label="Our work"
        title={<>Every project, in its own <span className="text-accentB">brand</span></>}
        lead="A curated collection of brand and web projects combining strong identity, clear structure, and scalable digital experiences."
      />

      <section aria-label="Projects" className="container pb-20 md:pb-28 lg:pb-32">
        <ul className="flex flex-col gap-5 md:gap-6">
          {works.map((work, index) => (
            <Reveal as="li" key={work.id}>
              <ProjectStage
                project={{
                  slug: work.slug,
                  href: `/works/${getProjectPathSlug(work.slug)}`,
                  title: getProjectDisplayTitle(work.slug, work.title),
                  industry: work.industry,
                  images: work.images,
                  summary: work.cardOutcome,
                  tags: work.cardServices
                }}
                headingLevel="h2"
                flip={index % 2 === 1}
                priority={index === 0}
              />
            </Reveal>
          ))}
        </ul>
      </section>

      <CtaBlock />
    </>
  );
}
