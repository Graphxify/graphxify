export const revalidate = 60;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedWorks } from "@/db/queries/works";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { normalizeImage, firstGalleryImage, withImageVersion } from "@/lib/content-helpers";
import {
  getProjectDisplayTitle,
  getProjectPathSlug,
  projectCardContent,
  resolveProjectSlugFromPathSlug,
  withProjectCardContent
} from "@/lib/project-card-content";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Web Design & Branding Portfolio | Graphxify Canada",
  description:
    "Explore Graphxify's portfolio of web design, branding, and custom development projects for Canadian businesses. Real work delivering brand identity, high-performance websites, and scalable digital platforms.",
  path: "/works"
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
    // local fallback below
  }

  return buildCanonicalCards();
}

export default async function WorksPage() {
  const works = await getWorkCards();

  return (
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
            A curated collection of brand and web projects — combining strong identity,
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
        <div className="grid gap-6 md:grid-cols-2 lg:gap-7">
          {works.map((work, index) => {
            const displayTitle = getProjectDisplayTitle(work.slug, work.title);
            // Alternate between tall and standard cards for visual interest
            const isFeatured = index < 2;

            return (
              <Link
                key={work.id}
                href={`/works/${getProjectPathSlug(work.slug)}`}
                className="group relative block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label={`Open project ${displayTitle}`}
                data-cursor-label="View"
              >
                <article
                  className={`relative overflow-hidden rounded-2xl border border-border/14 transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:border-border/28 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${
                    isFeatured ? "h-[24rem] md:h-[28rem]" : "h-[20rem] md:h-[24rem]"
                  }`}
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={work.coverImage}
                      alt={displayTitle}
                      fill
                      priority={index < 3}
                      className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:brightness-[0.55]"
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

                  {/* Project number */}
                  <div className="absolute left-5 top-5 z-10">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-ivory/20 bg-black/30 text-[0.6rem] font-medium text-ivory/70 backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Bottom content — always visible */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-7">
                    <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                      <h2 className="text-xl font-semibold text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-2xl">
                        {displayTitle}
                      </h2>
                    </div>

                    {/* Reveal arrow on hover */}
                    <div className="mt-3 flex items-center gap-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100">
                      <span className="text-xs uppercase tracking-[0.16em] text-ivory/70">View project</span>
                      <svg className="h-3.5 w-3.5 text-ivory/70 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Top-right accent glow on hover */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accentA/0 blur-[40px] transition-all duration-700 group-hover:bg-accentA/10" />
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
  );
}
