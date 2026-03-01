import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedWorkBySlug } from "@/db/queries/works";
import { demoWorks } from "@/lib/demo-content";
import { buildMetadata, creativeWorkJsonLd } from "@/lib/seo";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  let work = demoWorks.find((item) => item.slug === params.slug) ?? null;
  try {
    const dbWork = await getPublishedWorkBySlug(params.slug);
    if (dbWork) work = dbWork;
  } catch {
    // fallback
  }
  if (!work) return buildMetadata({ title: "Work Not Found", description: "Work item not found.", path: `/works/${params.slug}` });

  return buildMetadata({
    title: work.title,
    description: work.excerpt,
    path: `/works/${work.slug}`,
    image: work.cover_image_url || "/assets/og-default.svg"
  });
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  let work = demoWorks.find((item) => item.slug === params.slug) ?? null;
  try {
    const dbWork = await getPublishedWorkBySlug(params.slug);
    if (dbWork) work = dbWork;
  } catch {
    // fallback
  }

  if (!work) {
    notFound();
  }

  return (
    <article className="container py-16">
      <JsonLd
        data={
          creativeWorkJsonLd({
            title: work.title,
            description: work.excerpt,
            path: `/works/${work.slug}`,
            datePublished: work.created_at || new Date().toISOString()
          }) as Record<string, unknown>
        }
      />
      <p className="text-sm text-[rgba(242,240,235,0.7)]">Work</p>
      <h1 className="mt-2 text-4xl font-semibold">{work.title}</h1>
      <p className="mt-3 max-w-3xl text-[rgba(242,240,235,0.75)]">{work.excerpt}</p>
      <div className="relative mt-8 h-80 overflow-hidden rounded-xl border border-[rgba(242,240,235,0.18)]">
        <Image
          src={work.cover_image_url || "/assets/work-fallback.svg"}
          alt={work.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="mt-8 max-w-3xl space-y-4 text-[rgba(242,240,235,0.85)]">
        <p>{work.content}</p>
      </div>
    </article>
  );
}
