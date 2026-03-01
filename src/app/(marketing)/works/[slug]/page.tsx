import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
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
            datePublished: ("created_at" in work && typeof work.created_at === "string" ? work.created_at : undefined) || new Date().toISOString()
          }) as Record<string, unknown>
        }
      />

      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-4">
          <Link href="/works" className="link-sweep text-sm text-fg/68">
            Back to works
          </Link>
          <h1 className="text-4xl font-semibold md:text-5xl">{work.title}</h1>
          <p className="max-w-3xl text-fg/68">{work.excerpt}</p>
        </RevealItem>

        <RevealItem>
          <div className="relative h-[28rem] overflow-hidden rounded-2xl border border-border/18">
            <Image
              src={work.cover_image_url || "/assets/work-fallback.svg"}
              alt={work.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              sizes="100vw"
              priority
            />
          </div>
        </RevealItem>

        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <RevealItem>
            <div className="section-shell border-border/18 bg-card/72 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Project Snapshot</p>
              <ul className="mt-4 space-y-3 text-sm text-fg/72">
                <li>Year: {work.year || "Recent"}</li>
                <li>Role: {work.role || "Delivery Partner"}</li>
                <li>Services: {(work.services || []).join(", ") || "Strategy, Design, Engineering"}</li>
              </ul>
            </div>
          </RevealItem>
          <RevealItem>
            <div className="section-shell border-border/18 bg-card/72 p-6 text-fg/78">
              <p>{work.content}</p>
            </div>
          </RevealItem>
        </div>
      </RevealStagger>
    </article>
  );
}
