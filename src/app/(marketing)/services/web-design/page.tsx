export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { ServiceFaq, type ServiceFaqItem } from "@/components/marketing/service-faq";
import { ServicePricingCallout } from "@/components/marketing/service-pricing-callout";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Web Design Services — Custom Website Design for Modern Businesses",
  description:
    "Graphxify designs custom website interfaces built for clarity, hierarchy, and conversion. Mobile-first, accessible, and responsive across all screen sizes. Serving businesses worldwide.",
  path: "/services/web-design",
  ogTitle: "Web Design — Conversion-Focused Websites | Graphxify",
  ogDescription: "Custom, mobile-first websites designed with clear hierarchy and layouts built to guide visitors toward action — WCAG accessible, no templates.",
  ogImageAlt: "Custom web design services by Graphxify — conversion-focused, mobile-first, accessible"
});

const deliverables = [
  "UX wireframes for each key page",
  "High-fidelity desktop and mobile designs",
  "Interactive prototype for client review",
  "Component design system",
  "Responsive layout specifications",
  "Accessibility review (WCAG guidelines)"
];

const guidance = [
  { label: "Best for", value: "Businesses with a clear brand ready to build or redesign their website" },
  { label: "Typical project", value: "4 to 8 pages across a 2 to 4 week design phase" },
  { label: "Business outcome", value: "A website visitors understand and engage with from the first scroll" }
];

const relatedProjects = [
  {
    pathSlug: "flyup-line",
    title: "FlyUp Line",
    industry: "Travel and Aviation",
    outcome: "Structured interface designed to simplify flight discovery and build trust from first visit."
  },
  {
    pathSlug: "pharmacy-on-king",
    title: "Pharmacy On King",
    industry: "Healthcare / Pharmacy",
    outcome: "Clear, accessible layout that helps patients find services and contact information without friction."
  },
  {
    pathSlug: "king-medical-art-pharmacy",
    title: "King Medical Arts Pharmacy",
    industry: "Healthcare / Pharmacy",
    outcome: "Professional website designed to serve a medical arts pharmacy with structure and clarity."
  }
];

const relatedPosts = [
  {
    slug: "how-to-choose-a-web-design-agency",
    label: "How to Choose the Right Web Design Agency"
  },
  {
    slug: "mobile-first-website-small-businesses",
    label: "Why Small Businesses Need a Mobile-First Website in 2026"
  },
  {
    slug: "professional-website-business-growth",
    label: "How a Professional Website Drives Real Business Growth"
  }
];

const serviceFaqs: ServiceFaqItem[] = [
  {
    q: "Do you use templates or page builders?",
    a: "No. Every layout is designed from scratch for your content and your goals. That is the main reason a custom site costs more than a template — and the main reason it performs better."
  },
  {
    q: "What if I don't have copy or photos yet?",
    a: "Common, and not a blocker. We can design around placeholder content and swap it in later, or help shape the copy as part of the project. Just know that content readiness is the single biggest factor in how fast a project moves."
  },
  {
    q: "Will I see the design before it is built?",
    a: "Yes. You review high-fidelity designs and an interactive prototype before a line of production code is written. Nothing gets built that you have not signed off on."
  },
  {
    q: "Is the site accessible?",
    a: "We design to WCAG guidelines — colour contrast, keyboard navigation, focus states, and semantic structure — and run an accessibility review before launch."
  }
];

function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Design",
    description:
      "Custom website interface design built for clarity, hierarchy, and conversion — mobile-first, responsive, accessible layouts for modern businesses.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: "Worldwide",
    url: `${siteConfig.url}/services/web-design`
  };
}

export default function WebDesignPage() {
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Services", url: `${siteConfig.url}/services` },
    { name: "Web Design", url: `${siteConfig.url}/services/web-design` }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs as Record<string, unknown>} />
      <JsonLd data={serviceJsonLd() as Record<string, unknown>} />

      <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
        {/* Hero */}
        <SectionReveal className="container" effect="up">
          <div className="mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-fg/44">
              <Link href="/services" className="transition-colors hover:text-fg/70">
                Services
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-fg/70">Web Design</span>
            </nav>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
              Service
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">
              Web Design
            </h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">
              We design website interfaces built to communicate clearly and convert visitors into leads. Every layout
              prioritises hierarchy so your main message, your differentiator, and your call to action are visible before
              the scroll. Designed mobile-first, responsive across all screen sizes, and built with accessibility in mind.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <span>Start a Design Project</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="px-6">
                <Link href="/works">View Work</Link>
              </Button>
            </div>
          </div>
        </SectionReveal>

        {/* What's Included */}
        <SectionReveal className="container mt-14 md:mt-16 lg:mt-20" effect="up">
          <article className="section-shell border-border/18 bg-card/74 p-7 md:p-10 lg:p-14">
            <div className="flex items-center gap-2.5">
              <Layout className="h-4 w-4 text-accentA" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-fg/52">What&apos;s Included</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Structured interfaces with clarity and hierarchy</h2>
            <span className="mt-3 block h-px w-20 bg-accent-gradient" />
            <p className="mt-6 max-w-2xl text-[1.01rem] leading-[1.78] text-fg/68">
              A well-designed website isn&apos;t just aesthetic — it earns trust, directs attention, and reduces friction
              between a visitor and a decision. We design with that goal in mind from the first wireframe.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-4 text-[0.67rem] uppercase tracking-[0.18em] text-fg/52">Deliverables</p>
                <ul className="grid gap-2">
                  {deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-lg border border-border/16 bg-bg/45 px-3.5 py-2.5 text-sm text-fg/70"
                    >
                      <span className="mt-[0.3rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accentA/45" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-5">
                {guidance.map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-4">
                    <p className="pt-0.5 text-[0.61rem] uppercase leading-tight tracking-[0.17em] text-fg/42">{label}</p>
                    <p className="text-sm leading-relaxed text-fg/74">{value}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-accentA/14 bg-accentA/[0.045] px-5 py-4 text-sm italic leading-relaxed text-fg/60">
                  We design interfaces aligned with WCAG accessibility guidelines so websites are usable and inclusive
                  for every visitor, on any device.
                </div>
              </div>
            </div>
          </article>
        </SectionReveal>

        {/* Related Work */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold md:text-3xl">Design Work</h2>
            <Link
              href="/works"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fg/72 hover:text-fg"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedProjects.map((project) => (
              <Link
                key={project.pathSlug}
                href={`/works/${project.pathSlug}`}
                className="group flex flex-col rounded-[1.2rem] border border-border/18 bg-card/72 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accentA/22 hover:bg-card/85"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.18em] text-fg/44">{project.industry}</p>
                <h3 className="mt-2 text-[1.05rem] font-semibold leading-tight">{project.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-fg/56">{project.outcome}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-accentA">
                  View case study
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </SectionReveal>

        {/* Related Reading */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
            <h2 className="text-xl font-semibold">Related Reading</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border/16 bg-bg/45 px-4 py-3.5 transition-all duration-200 hover:border-accentA/22 hover:bg-bg/65"
                >
                  <span className="text-sm text-fg/74 group-hover:text-fg/90">{post.label}</span>
                  <ArrowUpRight className="ml-3 h-3.5 w-3.5 shrink-0 text-fg/38 group-hover:text-accentA" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <p className="mt-5 text-sm text-fg/52">
              Looking at a full build?{" "}
              <Link href="/services/web-development" className="link-sweep text-accentA hover:text-accentA/80">
                See Web Development
              </Link>{" "}
              or{" "}
              <Link href="/services" className="link-sweep text-accentA hover:text-accentA/80">
                back to all services
              </Link>
              .
            </p>
          </div>
        </SectionReveal>

        {/* Pricing */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <ServicePricingCallout tierKey="starter-website"
            note="Design is priced as part of a website build. The Starter Website tier covers up to five pages; larger sites are quoted from the Professional Website tier upward." />
        </SectionReveal>

        {/* FAQ */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <ServiceFaq items={serviceFaqs} />
        </SectionReveal>

        {/* CTA */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <SiteCtaSection />
        </SectionReveal>
      </div>
    </>
  );
}
