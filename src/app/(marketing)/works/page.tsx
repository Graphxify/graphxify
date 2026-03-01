import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getPublishedWorks } from "@/db/queries/works";
import { demoWorks } from "@/lib/demo-content";

export const metadata: Metadata = buildMetadata({
  title: "Selected Works",
  description: "Selected Graphxify projects blending brand design, engineering, and measurable outcomes.",
  path: "/works"
});

export default async function WorksPage() {
  let works = demoWorks;
  try {
    const dbWorks = await getPublishedWorks();
    if (dbWorks.length > 0) works = dbWorks;
  } catch {
    // Degraded mode fallback.
  }

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-semibold">Works</h1>
      <p className="mt-3 max-w-2xl text-[rgba(242,240,235,0.75)]">Case studies from growth-driven teams shipping premium digital products.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <article key={work.id} className="rounded-xl border border-[rgba(242,240,235,0.18)] p-4 transition-transform hover:-translate-y-1">
            <div className="relative h-52 overflow-hidden rounded-lg">
              <Image
                src={work.cover_image_url || "/assets/work-fallback.svg"}
                alt={work.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{work.title}</h2>
            <p className="mt-2 text-sm text-[rgba(242,240,235,0.75)]">{work.excerpt}</p>
            <Link className="mt-3 inline-block text-sm text-accentA" href={`/works/${work.slug}`}>
              View details
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
