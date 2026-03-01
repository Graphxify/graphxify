import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedWorkBySlug } from "@/db/queries/works";
import { demoWorks } from "@/lib/demo-content";
import { buildMetadata, creativeWorkJsonLd } from "@/lib/seo";
import { findCaseStudy } from "@/lib/marketing-content";
import { Button } from "@/components/ui/button";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const study = findCaseStudy(params.slug);
  if (study) {
    return buildMetadata({
      title: `${study.title} - Graphxify`,
      description: study.intro,
      path: `/works/${study.slug}`
    });
  }

  try {
    const dbWork = await getPublishedWorkBySlug(params.slug);
    if (dbWork) {
      return buildMetadata({
        title: `${dbWork.title} - Graphxify`,
        description: dbWork.excerpt,
        path: `/works/${dbWork.slug}`,
        image: dbWork.cover_image_url || "/opengraph-image"
      });
    }
  } catch {
    // degraded mode
  }

  return buildMetadata({
    title: "Work Not Found - Graphxify",
    description: "Work item not found.",
    path: `/works/${params.slug}`
  });
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  const study = findCaseStudy(params.slug);

  let dbWork = null as
    | {
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        cover_image_url: string | null;
        created_at?: string;
      }
    | null;

  try {
    const row = await getPublishedWorkBySlug(params.slug);
    if (row) {
      dbWork = {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        cover_image_url: row.cover_image_url,
        created_at: row.created_at
      };
    }
  } catch {
    // degraded mode
  }

  const fallbackWork = demoWorks.find((item) => item.slug === params.slug) ?? null;

  if (!study && !dbWork && !fallbackWork) {
    notFound();
  }

  const title = study?.title || dbWork?.title || fallbackWork?.title || "Work";
  const description = study?.intro || dbWork?.excerpt || fallbackWork?.excerpt || "";
  const image = dbWork?.cover_image_url || fallbackWork?.cover_image_url || "/assets/work-fallback.svg";
  const publishedAt = dbWork?.created_at || fallbackWork?.created_at || new Date().toISOString();

  return (
    <article className="container py-16">
      <JsonLd
        data={
          creativeWorkJsonLd({
            title,
            description,
            path: `/works/${params.slug}`,
            datePublished: publishedAt
          }) as Record<string, unknown>
        }
      />

      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-4">
          <Link href="/works" className="link-sweep text-sm text-fg/68">
            Back to works
          </Link>
          <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-fg/72">{description}</p>
        </RevealItem>

        <RevealItem>
          <div className="relative h-[26rem] overflow-hidden rounded-2xl border border-border/18">
            <Image src={image} alt={title} fill className="object-cover" sizes="100vw" priority />
          </div>
        </RevealItem>

        {study ? (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              <RevealItem>
                <article className="section-shell p-6">
                  <h2 className="text-2xl font-semibold">Context</h2>
                  <p className="mt-3 text-sm text-fg/76">{study.context}</p>
                </article>
              </RevealItem>
              <RevealItem>
                <article className="section-shell p-6">
                  <h2 className="text-2xl font-semibold">Challenge</h2>
                  <ul className="mt-3 space-y-2 text-sm text-fg/76">
                    {study.challenge.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            </div>

            <RevealItem>
              <article className="section-shell p-6">
                <h2 className="text-2xl font-semibold">What we did</h2>
                <ul className="mt-3 space-y-2 text-sm text-fg/76">
                  {study.whatWeDid.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            </RevealItem>

            <div className="grid gap-5 md:grid-cols-2">
              <RevealItem>
                <article className="section-shell p-6">
                  <h2 className="text-2xl font-semibold">CMS architecture</h2>
                  <ul className="mt-3 space-y-2 text-sm text-fg/76">
                    {study.cmsArchitecture.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
              <RevealItem>
                <article className="section-shell p-6">
                  <h2 className="text-2xl font-semibold">Technical notes</h2>
                  <ul className="mt-3 space-y-2 text-sm text-fg/76">
                    {study.technicalNotes.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            </div>

            <RevealItem>
              <article className="section-shell p-6">
                <h2 className="text-2xl font-semibold">Outcome</h2>
                <ul className="mt-3 space-y-2 text-sm text-fg/76">
                  {study.outcome.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-fg/74">
                  <span className="font-semibold">Stack:</span> {study.stack}
                </p>
              </article>
            </RevealItem>

            <RevealItem>
              <article className="section-shell p-6 md:p-8">
                <p className="text-sm text-fg/70">{study.ctaPrompt}</p>
                <Button asChild className="mt-4">
                  <Link href="/contact#inquiry">Start a project inquiry</Link>
                </Button>
              </article>
            </RevealItem>
          </>
        ) : (
          <RevealItem>
            <article className="section-shell p-6 text-fg/76">
              <h2 className="text-2xl font-semibold">Project summary</h2>
              <p className="mt-3">{dbWork?.content || fallbackWork?.content}</p>
            </article>
          </RevealItem>
        )}
      </RevealStagger>
    </article>
  );
}
