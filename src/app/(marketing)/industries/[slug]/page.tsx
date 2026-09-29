import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { ServiceFaq } from "@/components/marketing/service-faq";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceCatalog } from "@/lib/constants";
import { getPublishedIndustryPage, getPublishedIndustryPages } from "@/lib/industries";
import { getProjectCardContent, resolveProjectSlugFromPathSlug } from "@/lib/project-card-content";
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
  const caseStudies = page.caseStudies
    .map((pathSlug) => {
      const card = getProjectCardContent(resolveProjectSlugFromPathSlug(pathSlug));
      return card ? { pathSlug, title: card.title, industry: card.industry, outcome: card.cardOutcome } : null;
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

      <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
        <SectionReveal className="container" effect="up">
          <div className="mx-auto max-w-4xl">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
              {page.name}
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">{page.heading}</h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">{page.intro}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <span>Start a Project</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="container mt-14 md:mt-16" effect="up">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="section-shell border-border/18 bg-card/74 p-7 md:p-9">
              <h2 className="text-2xl font-semibold">Common challenges</h2>
              <div className="mt-6 space-y-5">
                {page.challenges.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-sm font-semibold text-fg/86">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg/62">{item.body}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="section-shell border-border/18 bg-card/74 p-7 md:p-9">
              <h2 className="text-2xl font-semibold">How we approach it</h2>
              <div className="mt-6 space-y-5">
                {page.approach.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-sm font-semibold text-fg/86">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg/62">{item.body}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </SectionReveal>

        {caseStudies.length > 0 ? (
          <SectionReveal className="container mt-10 md:mt-14" effect="up">
            <h2 className="mb-5 text-2xl font-semibold md:text-3xl">{page.name} projects</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {caseStudies.map((project) => (
                <Link
                  key={project.pathSlug}
                  href={`/works/${project.pathSlug}`}
                  className="group flex flex-col rounded-[1.2rem] border border-border/18 bg-card/72 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accentA/22 hover:bg-card/85"
                >
                  <p className="text-[0.6rem] uppercase tracking-[0.18em] text-fg/44">{project.industry}</p>
                  <h3 className="mt-2 text-[1.05rem] font-semibold leading-tight">{project.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-fg/56">{project.outcome}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-accentA">
                    {project.title} case study
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </SectionReveal>
        ) : null}

        {services.length > 0 ? (
          <SectionReveal className="container mt-10 md:mt-14" effect="up">
            <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
              <h2 className="text-xl font-semibold">Related services</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service.key}>
                    <Link
                      href={service.path}
                      className="group flex items-start justify-between rounded-xl border border-border/16 bg-bg/45 px-4 py-3.5 transition-all duration-200 hover:border-accentA/22 hover:bg-bg/65"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-fg/90">{service.name}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-fg/56">{service.description}</span>
                      </span>
                      <ArrowUpRight className="ml-3 h-3.5 w-3.5 shrink-0 text-fg/38 group-hover:text-accentA" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>
        ) : null}

        {page.faqs.length > 0 ? (
          <SectionReveal className="container mt-10 md:mt-14" effect="up">
            <ServiceFaq items={page.faqs} />
          </SectionReveal>
        ) : null}

        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <SiteCtaSection />
        </SectionReveal>
      </div>
    </>
  );
}
