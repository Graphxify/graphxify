import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { getPublishedWorks } from "@/db/queries/works";
import { demoWorks } from "@/lib/demo-content";
import { buildMetadata } from "@/lib/seo";
import { featuredWorks } from "@/lib/marketing-content";

export const dynamic = "force-dynamic";

type WorkPreview = {
  slug: string;
  cover_image_url: string | null;
};

export const metadata: Metadata = buildMetadata({
  title: "Work - Graphxify",
  description:
    "A curated set of representative engagements focused on brand systems, UX/UI clarity, performance-first development, and structured CMS implementation.",
  path: "/works"
});

function imageFor(slug: string, works: WorkPreview[], index: number): string {
  return works.find((item) => item.slug === slug)?.cover_image_url || `/assets/work-${index + 1}.svg`;
}

export default async function WorksPage() {
  let works: WorkPreview[] = demoWorks.map((item) => ({ slug: item.slug, cover_image_url: item.cover_image_url }));

  try {
    const dbWorks = await getPublishedWorks();
    if (dbWorks.length > 0) {
      works = dbWorks.map((item) => ({ slug: item.slug, cover_image_url: item.cover_image_url }));
    }
  } catch {
    // degraded mode fallback
  }

  return (
    <section className="container py-16">
      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Work</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Selected Work</h1>
          <p className="max-w-3xl text-fg/72">
            A curated set of representative engagements focused on brand systems, UX/UI clarity, performance-first
            development, and structured CMS implementation.
          </p>
        </RevealItem>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredWorks.map((work, index) => (
            <RevealItem key={work.slug}>
              <article className="section-shell lift-hover h-full overflow-hidden p-4">
                <div className="relative h-52 overflow-hidden rounded-lg border border-border/18">
                  <Image
                    src={imageFor(work.slug, works, index)}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold">{work.title}</h2>
                <p className="mt-2 text-sm text-fg/72">{work.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border/20 px-3 py-1 text-xs text-fg/72">
                      {tag}
                    </span>
                  ))}
                </div>
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
