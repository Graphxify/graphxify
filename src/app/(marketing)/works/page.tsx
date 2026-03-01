import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";
import { getPublishedWorks } from "@/db/queries/works";
import { demoWorks } from "@/lib/demo-content";

export const dynamic = "force-dynamic";

type WorkPreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  year?: number;
  role?: string;
  services?: string[];
};

function toWorkPreview(item: Partial<WorkPreview>): WorkPreview | null {
  if (!item.id || !item.title || !item.slug || !item.excerpt) {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    cover_image_url: item.cover_image_url ?? null,
    year: item.year,
    role: item.role,
    services: item.services
  };
}

export const metadata: Metadata = buildMetadata({
  title: "Selected Works",
  description: "Selected Graphxify projects blending brand design, engineering, and measurable outcomes.",
  path: "/works"
});

export default async function WorksPage() {
  let works: WorkPreview[] = demoWorks
    .map((item) => toWorkPreview(item))
    .filter((item): item is WorkPreview => item !== null);

  try {
    const dbWorks = await getPublishedWorks();
    if (dbWorks.length > 0) {
      works = dbWorks
        .map((item) => toWorkPreview(item as Partial<WorkPreview>))
        .filter((item): item is WorkPreview => item !== null);
    }
  } catch {
    // Degraded mode fallback.
  }

  return (
    <section className="container py-16">
      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Portfolio</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Selected Works</h1>
          <p className="max-w-2xl text-fg/68">
            A curated set of systems-focused projects built for clarity, performance, and publishing velocity.
          </p>
        </RevealItem>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <RevealItem key={work.id}>
              <article className="section-shell lift-hover overflow-hidden border-border/18 bg-card/72 p-4">
                <div className="relative h-52 overflow-hidden rounded-lg border border-border/14">
                  <Image
                    src={work.cover_image_url || "/assets/work-fallback.svg"}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-fg/56">{work.year || "Recent"}</p>
                <h2 className="mt-1 text-xl font-semibold">{work.title}</h2>
                <p className="mt-2 text-sm text-fg/68">{work.excerpt}</p>
                <Link className="link-sweep mt-4 inline-flex text-sm text-fg" href={`/works/${work.slug}`}>
                  Open project
                </Link>
              </article>
            </RevealItem>
          ))}
        </div>
      </RevealStagger>
    </section>
  );
}
