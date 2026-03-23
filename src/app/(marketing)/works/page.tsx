export const revalidate = 60;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { getPublishedWorks } from "@/db/queries/works";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { normalizeImage, firstGalleryImage, withImageVersion, shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import {
  getProjectCardContent,
  getProjectDisplayTitle,
  getProjectPathSlug,
  projectCardContent,
  resolveProjectSlugFromPathSlug,
  withProjectCardContent
} from "@/lib/project-card-content";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Web Design & Branding Portfolio",
  description:
    "Explore Graphxify's portfolio of web design, branding, and custom development projects for Canadian businesses. Real work delivering brand identity, high-performance websites, and scalable digital platforms.",
  path: "/works",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "Portfolio — Real Projects by Graphxify",
  ogDescription: "Brand identities, custom websites, and digital platforms for Canadian businesses. Every project is built for performance, clarity, and long-term impact.",
  ogImageAlt: "Graphxify portfolio — web design and branding case studies for Canadian businesses"
});

type WorkCard = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
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
        industry: cms.industry || cardMeta?.industry || fallback?.industry || "",
        cardServices: cmsCardServices ?? cardMeta?.cardServices ?? [],
        cardOutcome: cms.card_outcome || cardMeta?.cardOutcome || ""
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
      <ContentRefreshListener pathPrefixes={["/works"]} />
      <section className="pb-16 pt-10 md:pb-20 md:pt-12">
      {/* ── Hero Header ── */}
      <div className="container">
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-accentA/6 blur-[80px]" />

          <p className="relative inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-accentA/80">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-accentA/50" aria-hidden="true" />
            Portfolio
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-accentA/50" aria-hidden="true" />
          </p>

          <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">
            Featured{" "}
            <span className="gradient-text">Projects</span>
          </h1>

          {/* Accent line */}
          <div className="mx-auto mt-4 h-[2px] w-16 overflow-hidden rounded-full bg-border/20">
            <div className="h-full w-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-accentA/70 to-transparent" />
          </div>

          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-fg/56 md:text-base">
            A curated collection of brand and web projects combining strong identity,
            clear structure, and scalable digital experiences.
          </p>

          {/* Project count badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/16 bg-card/50 px-4 py-1.5 text-xs text-fg/50">
            <span className="h-1.5 w-1.5 rounded-full bg-accentA/60 shadow-[0_0_6px_rgba(0,163,255,0.4)]" />
            <span>{works.length} Projects</span>
          </div>
        </div>
      </div>

      {/* ── Project Grid ── */}
      <div className="container mt-12 md:mt-16">
        <div className="grid gap-7 md:grid-cols-2 lg:gap-9">
          {works.map((work, index) => {
            const displayTitle = getProjectDisplayTitle(work.slug, work.title);
            return (
              <Link
                key={work.id}
                href={`/works/${getProjectPathSlug(work.slug)}`}
                className="group relative block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label={`Open project ${displayTitle}`}
                data-cursor-label="View"
              >
                <article className="relative h-[24rem] overflow-hidden rounded-2xl border border-border/20 text-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:border-accentA/30 group-hover:shadow-[0_28px_64px_rgba(0,0,0,0.26),0_0_0_1px_rgba(0,163,255,0.1)] md:h-[28rem]">
                  {/* Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={work.coverImage}
                      alt={displayTitle}
                      fill
                      priority={index < 2}
                      unoptimized={shouldBypassNextImageOptimization(work.coverImage)}
                      className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-[0.48]"
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                  </div>

                  {/* Gradient scrim — strong at bottom, clears at top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/6" />

                  {/* ── TOP ROW: industry ── */}
                  {work.industry ? (
                    <div className="absolute right-0 top-0 z-10 p-5">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-gradient px-2.5 py-[0.22rem] shadow-[0_2px_10px_rgba(0,163,255,0.28)] backdrop-blur-sm transition-[box-shadow,opacity] duration-400 group-hover:shadow-[0_0_18px_rgba(0,163,255,0.48)]">
                        <span className="h-[3px] w-[3px] rounded-full bg-white/70" aria-hidden="true" />
                        <span className="text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-white/95">{work.industry}</span>
                      </div>
                    </div>
                  ) : null}

                  {/* ── BOTTOM CONTENT ── */}
                  <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-7">

                    {/* Service tags — staggered reveal on hover */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {work.cardServices.map((tag, tagIndex) => (
                        <span
                          key={tag}
                          className="-translate-y-2 rounded-full border border-white/18 bg-graphite/82 px-3 py-[0.28rem] text-[0.58rem] font-medium uppercase tracking-[0.12em] text-white/88 opacity-0 backdrop-blur-md transition-[opacity,transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:border-white/28 group-hover:opacity-100"
                          style={{ transitionDelay: `${tagIndex * 50}ms` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title — always visible */}
                    <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
                      <h2 className="text-xl font-semibold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-[1.4rem]">
                        {displayTitle}
                      </h2>
                    </div>

                    {/* Context line — revealed on hover */}
                    <p className="mt-2 max-w-[34ch] translate-y-1 text-xs leading-relaxed text-white/68 opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:80ms] group-hover:translate-y-0 group-hover:opacity-100">
                      {work.cardOutcome}
                    </p>

                    {/* Accent rule — expands on hover */}
                    <div className="mt-3 h-px w-7 origin-left rounded-full bg-white/20 opacity-0 transition-[width,background-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:80ms] group-hover:w-10 group-hover:bg-accentA/55 group-hover:opacity-100" />

                    {/* View project CTA — revealed on hover */}
                    <div className="mt-2.5 inline-flex items-center gap-1.5 opacity-0 transition-[opacity,gap] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:130ms] group-hover:gap-2.5 group-hover:opacity-100">
                      <span className="text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-accentA/88">View project</span>
                      <svg className="h-3 w-3 text-accentA/88 transition-transform duration-300 group-hover:translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom accent bar — sweeps in on hover */}
                  <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-accentA to-accentB transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </article>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container mt-14 md:mt-18">
        <SectionReveal effect="zoom">
          <SiteCtaSection />
        </SectionReveal>
      </div>
      </section>
    </>
  );
}
