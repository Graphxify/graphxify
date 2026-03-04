import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedWorks } from "@/db/queries/works";
import { getProjectDisplayTitle, projectCardContent, withProjectCardContent } from "@/lib/project-card-content";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Selected Works",
  description: "Six premium Graphxify project stories, each presented with a distinct layout system.",
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
      }
    > = new Map()
  ): WorkCard[] =>
    projectCardContent.map((card, index) => {
      const fallback = getProjectBySlug(card.slug) ?? fallbackBySlug.get(card.slug);
      const cms = cmsBySlug.get(card.slug);

      return withProjectCardContent({
        id: cms?.id ?? fallback?.id ?? `work-card-${index + 1}`,
        slug: card.slug,
        title: cms?.title ?? fallback?.title ?? card.title,
        coverImage: normalizeImage(cms?.cover_image_url) ?? fallback?.coverImage ?? `/assets/work-${(index % 3) + 1}.svg`
      });
    });

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      const cmsBySlug = new Map(cmsWorks.map((work) => [work.slug, work]));
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
          <h1 className="text-3xl font-semibold md:text-4xl">Selected Works</h1>
          <p className="max-w-2xl text-fg/68">
            Six signature projects. Six intentionally different detail experiences. One unified Graphxify brand system.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => {
            const displayTitle = getProjectDisplayTitle(work.slug, work.title);
            return (
            <div key={work.id}>
              <Link
                href={`/works/${work.slug}`}
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
