import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { getPublishedWorks } from "@/db/queries/works";
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
  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      return cmsWorks.map((work) => {
        const fallback = getProjectBySlug(work.slug);
        return {
          id: work.id,
          slug: work.slug,
          title: work.title,
          coverImage: normalizeImage(work.cover_image_url) ?? fallback?.coverImage ?? "/assets/work-1.svg"
        };
      });
    }
  } catch {
    // local fallback below
  }

  return graphxifyProjects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    coverImage: project.coverImage
  }));
}

export default async function WorksPage() {
  const works = await getWorkCards();

  return (
    <section className="container py-14 md:py-16">
      <RevealStagger className="space-y-10" effect="up">
        <RevealItem className="space-y-3" effect="left">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Portfolio</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Selected Works</h1>
          <p className="max-w-2xl text-fg/68">
            Six signature projects. Six intentionally different detail experiences. One unified Graphxify brand system.
          </p>
        </RevealItem>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work, index) => (
            <RevealItem key={work.id} effect={index % 3 === 0 ? "left" : index % 3 === 1 ? "zoom" : "right"}>
              <Link
                href={`/works/${work.slug}`}
                className="group block rounded-[1.05rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label={`Open project ${work.title}`}
                data-cursor-label="Open"
              >
                <article className="relative h-[20rem] overflow-hidden rounded-[1.05rem] border border-border/18 shadow-[0_14px_30px_rgba(13,13,15,0.08)] md:h-[22rem]">
                  <div className="absolute inset-0">
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:blur-[2px] group-hover:brightness-[0.55]"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/12 transition-colors duration-500 group-hover:bg-black/38" />

                  <div className="absolute inset-x-4 bottom-4 z-10 transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0">
                    <h2 className="text-sm font-medium text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:text-base">
                      {work.title}
                    </h2>
                  </div>

                  <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-5 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="text-[1.6rem] font-semibold leading-tight text-ivory drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] md:text-[1.9rem]">
                      {work.title}
                    </h3>
                  </div>
                </article>
              </Link>
            </RevealItem>
          ))}
        </div>
      </RevealStagger>
    </section>
  );
}
