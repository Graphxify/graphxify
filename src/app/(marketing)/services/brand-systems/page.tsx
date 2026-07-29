export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { ServiceFaq, type ServiceFaqItem } from "@/components/marketing/service-faq";
import { ServicePricingCallout } from "@/components/marketing/service-pricing-callout";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Brand Systems — Visual Identity Design for Modern Businesses",
  description:
    "Graphxify builds complete brand identity systems: logo suite, typography, colour palette, brand voice, and brand guidelines. Full-system branding for modern businesses delivered in 2–3 weeks.",
  path: "/services/brand-systems",
  ogTitle: "Brand Systems — Logo, Identity & Visual Strategy | Graphxify",
  ogDescription: "A complete visual identity built from the ground up: logo, colour, typography, and messaging that works consistently across every touchpoint. Delivered in 2–3 weeks.",
  ogImageAlt: "Brand identity and visual systems by Graphxify — logo, colour, and typography design"
});

const deliverables = [
  "Logo suite (primary, secondary, icon)",
  "Typography system with font files",
  "Colour palette with hex, RGB, and CMYK",
  "Brand guidelines document (PDF)",
  "Social media templates",
  "Full asset export package"
];

const guidance = [
  { label: "Best for", value: "New businesses or companies that have outgrown a DIY logo" },
  { label: "Typical project", value: "Full brand identity from scratch in 2 to 3 weeks" },
  { label: "Business outcome", value: "Look credible and consistent everywhere your business appears" }
];

const relatedProjects = [
  {
    pathSlug: "maven",
    title: "Maven",
    industry: "Fashion and Streetwear",
    outcome:
      "Complete brand identity system built for a minimalist streetwear concept, scaled across apparel and digital."
  },
  {
    pathSlug: "luka-hair-salon",
    title: "Luka Hair Salon",
    industry: "Beauty and Hair Salon",
    outcome: "A refined visual identity designed to communicate elegance and attract premium salon clients."
  },
  {
    pathSlug: "boss-medical-clinic",
    title: "BOSS Medical Clinic",
    industry: "Healthcare / Medical Clinic",
    outcome: "Brand identity and website built to communicate authority and credibility for a modern clinic."
  }
];

const relatedPosts = [
  {
    slug: "what-makes-a-strong-brand-identity",
    label: "What Makes a Strong Brand Identity"
  },
  {
    slug: "how-to-choose-a-web-design-agency",
    label: "How to Choose the Right Web Design Agency"
  }
];

const serviceFaqs: ServiceFaqItem[] = [
  {
    q: "How long does a brand identity take?",
    a: "Two to three weeks for a complete identity, assuming feedback comes back within a couple of days at each stage. Rushed brand work tends to produce brand work you replace in a year."
  },
  {
    q: "What if I already have a logo I like?",
    a: "Then we keep it. Plenty of projects start with a usable logo and need everything around it — type, colour, and the rules for applying them consistently. We will tell you honestly if the logo is holding you back."
  },
  {
    q: "Do I own the files?",
    a: "Yes, outright. You receive the full export package — source files, web and print formats, and the guidelines document. Nothing is licensed back to you."
  },
  {
    q: "Can you do brand without a website?",
    a: "Yes. Brand Identity is a standalone engagement. Many clients do brand first and build the site later, which works well because the site then has something to be designed against."
  }
];

function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Brand Systems",
    description:
      "Complete brand identity design including logo suite, typography, colour palette, and brand guidelines for modern businesses.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: "Worldwide",
    url: `${siteConfig.url}/services/brand-systems`
  };
}

export default function BrandSystemsPage() {
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Services", url: `${siteConfig.url}/services` },
    { name: "Brand Systems", url: `${siteConfig.url}/services/brand-systems` }
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
              <span className="text-fg/70">Brand Systems</span>
            </nav>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
              Service
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">
              Brand Systems
            </h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">
              We build complete brand identity systems so your business looks credible and consistent from day one. Logo
              suite, typography, colour palette, brand voice, and usage guidelines — all delivered as one structured
              system your team can maintain without a designer making every call.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <span>Start a Brand Project</span>
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
              <Fingerprint className="h-4 w-4 text-accentA" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-fg/52">What&apos;s Included</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Complete identity, delivered as one system</h2>
            <span className="mt-3 block h-px w-20 bg-accent-gradient" />
            <p className="mt-6 max-w-2xl text-[1.01rem] leading-[1.78] text-fg/68">
              Every brand system we deliver is built to be self-sufficient. Your team gets everything needed to stay
              on-brand across every format — website, social, print, pitch decks — without calling a designer for every
              decision.
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
                  Every brand system includes a guidelines document your team can use day-to-day. No designer required to
                  stay on-brand.
                </div>
              </div>
            </div>
          </article>
        </SectionReveal>

        {/* Related Work */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold md:text-3xl">Brand Work</h2>
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
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border/16 bg-bg/45 px-4 py-3.5 transition-all duration-200 hover:border-accentA/22 hover:bg-bg/65"
                >
                  <span className="text-sm text-fg/74 group-hover:text-fg/90">{post.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-fg/38 group-hover:text-accentA" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <p className="mt-5 text-sm text-fg/52">
              Need the full picture?{" "}
              <Link href="/services" className="link-sweep text-accentA hover:text-accentA/80">
                Back to all services
              </Link>
            </p>
          </div>
        </SectionReveal>

        {/* Pricing */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <ServicePricingCallout tierKey="brand-identity" />
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
