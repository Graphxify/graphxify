import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedWorks } from "@/db/queries/works";
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
  title: "Featured Projects",
  description:
    "A curated collection of brand and web projects designed to combine strong identity, clear structure, and scalable digital experiences.",
  path: "/works"
});

type WorkCard = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

function normalizeImage(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function firstGalleryImage(value: string[] | null | undefined): string | null {
  if (!Array.isArray(value)) {
    return null;
  }
  for (const item of value) {
    const normalized = normalizeImage(item);
    if (normalized) {
      return normalized;
    }
  }
  return null;
}

function withImageVersion(src: string, version: string | null | undefined): string {
  if (!version) {
    return src;
  }

  const [path, rawQuery = ""] = src.split("?");
  const params = new URLSearchParams(rawQuery);
  params.set("v", version);
  const nextQuery = params.toString();

  return nextQuery.length > 0 ? `${path}?${nextQuery}` : path;
}

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
    <section className="container py-14 md:py-16">
      <div className="space-y-10">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
            <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
            Portfolio
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Featured Projects</h1>
          <p className="max-w-2xl text-fg/68">
            A curated collection of brand and web projects designed to combine strong identity, clear structure, and scalable digital
            experiences.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => {
            const displayTitle = getProjectDisplayTitle(work.slug, work.title);
            return (
            <div key={work.id}>
              <Link
                href={`/works/${getProjectPathSlug(work.slug)}`}
                className="group block rounded-[1.05rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label={`Open project ${displayTitle}`}
                data-cursor-label="Open"
              >
                <article className="relative h-[20rem] overflow-hidden rounded-[1.05rem] border border-border/18 shadow-[0_14px_30px_rgba(13,13,15,0.08)] md:h-[22rem]">
                  <div className="absolute inset-0">
                    <Image
                      src={work.coverImage}
                      alt={displayTitle}
                      fill
                      className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:blur-[2px] group-hover:brightness-[0.55]"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/12 transition-colors duration-500 group-hover:bg-black/38" />

                  <div className="absolute inset-x-4 bottom-4 z-10 transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0">
                    <h2 className="text-sm font-medium text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:text-base">
                      {displayTitle}
                    </h2>
                  </div>

                  <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-5 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="text-[1.6rem] font-semibold leading-tight text-ivory drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] md:text-[1.9rem]">
                      {displayTitle}
                    </h3>
                  </div>
                </article>
              </Link>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
