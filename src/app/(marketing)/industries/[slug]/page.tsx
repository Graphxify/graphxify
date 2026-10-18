import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBlock } from "@/components/site/cta-block";
import { FaqList } from "@/components/site/faq-list";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { getPublishedWorks } from "@/db/queries/works";
import { firstGalleryImage, normalizeImage, withImageVersion } from "@/lib/content-helpers";
import { serviceCatalog } from "@/lib/constants";
import { getPublishedIndustryPage, getPublishedIndustryPages } from "@/lib/industries";
import { getProjectCardContent, resolveProjectSlugFromPathSlug } from "@/lib/project-card-content";
import { getProjectBySlug } from "@/lib/project-details";
import { breadcrumbListJsonLd, buildMetadata, canonicalUrl } from "@/lib/seo";

/**
 * Industry landing page template. Only entries that pass the publishability
 * gate in lib/industries.ts are prerendered; every other /industries/* URL is a
 * real 404. There is intentionally no /industries index until at least two
 * industries are published.
 */
export const revalidate = 3600;
export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPublishedIndustryPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPublishedIndustryPage(slug);
  if (!page) {
    return { robots: { index: false, follow: false } };
  }
  return buildMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: `/industries/${page.slug}`,
    ogEyebrow: page.name
  });
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getPublishedIndustryPage(slug);
  if (!page) {
    notFound();
  }

  const path = `/industries/${page.slug}`;
  const services = serviceCatalog.filter((service) => page.services.includes(service.key));
  // Covers come from the CMS; the static fallback image is used only if the CMS is unreachable.
  const works = await getPublishedWorks().catch(() => []);
  const caseStudies = page.caseStudies
    .map((pathSlug) => {
      const slug = resolveProjectSlugFromPathSlug(pathSlug);
      const card = getProjectCardContent(slug);
      if (!card) return null;
      const work = works.find((item) => resolveProjectSlugFromPathSlug(item.slug) === slug);
      const cover =
        normalizeImage(work?.cover_image_url) ?? firstGalleryImage(work?.gallery_images) ?? getProjectBySlug(slug)?.coverImage ?? "/assets/work-1.svg";
      return { pathSlug, slug, title: card.title, industry: card.industry, outcome: card.cardOutcome, image: withImageVersion(cover, work?.updated_at ?? null) };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <>
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: "Home", url: canonicalUrl("/") },
          { name: page.name, url: canonicalUrl(path) }
        ])}
      />

      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: page.name }]}
        label={page.name}
        title={page.heading}
        lead={page.intro}
        actions={
          <Button asChild size="lg">
            <Link href="/contact">Start a project</Link>
          </Button>
        }
      />

      {([
        { badge: "Challenges", title: "Common challenges", items: page.challenges },
        { badge: "Approach", title: "How we approach it", items: page.approach }
      ] as const).map((group) => (
        <section key={group.title} className="container section first-of-type:pt-0">
          <Reveal>
            <SectionIntro badge={group.badge} title={group.title} />
          </Reveal>
          <ul className="mt-12 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
            {group.items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={(index % 2) * 80} className="rounded-[2rem] bg-white p-7 md:p-9">
                <h3 className="t-h3 text-fg">{item.title}</h3>
                <p className="t-body mt-3">{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </section>
      ))}

      {caseStudies.length > 0 ? (
        <section className="container section">
          <Reveal>
            <SectionIntro badge="Work" title={`${page.name} projects`} />
          </Reveal>
          <ul className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
            {caseStudies.map((project, index) => (
              <Reveal as="li" key={project.pathSlug} delay={(index % 2) * 80}>
                <ProjectCard href={`/works/${project.pathSlug}`} slug={project.slug} title={project.title} industry={project.industry} summary={project.outcome} image={project.image} />
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      {services.length > 0 ? (
        <section className="container section">
          <Reveal>
            <SectionIntro badge="Services" title="Related services" />
          </Reveal>
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 md:mt-14 md:grid-cols-2">
            {services.map((service) => (
              <li key={service.key}>
                <Link
                  href={service.path}
                  className="group flex h-full items-start justify-between gap-6 rounded-[2rem] bg-white p-7 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift motion-reduce:transform-none"
                >
                  <span>
                    <span className="t-h3 block text-fg">{service.name}</span>
                    <span className="t-body mt-2 block max-w-[48ch]">{service.description}</span>
                  </span>
                  <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {page.faqs.length > 0 ? (
        <section className="container section">
          <Reveal>
            <SectionIntro badge="FAQ" title="Questions, answered." />
          </Reveal>
          <FaqList className="mx-auto mt-12 max-w-3xl md:mt-14" items={page.faqs} />
        </section>
      ) : null}

      <CtaBlock />
    </>
  );
}
