export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Web Development Services — Custom Next.js Websites Worldwide",
  description:
    "Graphxify builds custom websites on Next.js, not WordPress templates. Lighthouse scores above 90, Core Web Vitals optimised, and full code ownership. Serving businesses worldwide.",
  path: "/services/web-development",
  ogTitle: "Web Development — Fast, Scalable Next.js Sites | Graphxify",
  ogDescription: "Custom Next.js websites with Lighthouse 90+, Core Web Vitals optimised, and full code ownership. Built to rank, load instantly, and scale without friction.",
  ogImageAlt: "Web development with Next.js — high-performance websites by Graphxify"
});

const deliverables = [
  "Custom Next.js codebase (you own it outright)",
  "Lighthouse scores above 90 across all metrics",
  "Core Web Vitals optimisation",
  "Deployment to Vercel or your preferred host",
  "Integrations (CRM, forms, analytics)",
  "Post-launch handover and documentation"
];

const guidance = [
  {
    label: "Best for",
    value: "Companies ready to move off WordPress, page builders, or outdated custom sites"
  },
  { label: "Typical project", value: "4 to 8 week build depending on scope" },
  {
    label: "Business outcome",
    value: "A site that loads fast, ranks better, and doesn't need a developer for routine updates"
  }
];

const relatedProjects = [
  {
    pathSlug: "flyup-line",
    title: "FlyUp Line",
    industry: "Travel and Aviation",
    outcome: "Responsive platform with a streamlined booking flow and optimised performance across devices.",
    liveUrl: "https://flyupline.com/"
  },
  {
    pathSlug: "boss-raam-pharmacy",
    title: "BOSS Medical Clinic",
    industry: "Healthcare / Medical Clinic",
    outcome: "Full website build with service-driven layout and clear content structure for a medical clinic.",
    liveUrl: "https://www.bossmedclinic.com/"
  },
  {
    pathSlug: "pharmacy-on-king",
    title: "Pharmacy On King",
    industry: "Healthcare / Pharmacy",
    outcome: "Responsive website with intuitive navigation and clear service presentation for a community pharmacy.",
    liveUrl: "https://pharmacyonking.ca/"
  }
];

const relatedPosts = [
  {
    slug: "custom-web-development-vs-wordpress",
    label: "Custom Web Development vs. WordPress: A Guide for Business Owners"
  },
  {
    slug: "professional-website-business-growth",
    label: "How a Professional Website Drives Real Business Growth"
  },
  {
    slug: "mobile-first-website-small-businesses",
    label: "Why Small Businesses Need a Mobile-First Website in 2026"
  }
];

function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Development",
    description:
      "Custom websites built on Next.js with Lighthouse scores above 90, Core Web Vitals optimisation, and full code ownership. No WordPress. No page builders.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: "Worldwide",
    url: `${siteConfig.url}/services/web-development`
  };
}

export default function WebDevelopmentPage() {
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Services", url: `${siteConfig.url}/services` },
    { name: "Web Development", url: `${siteConfig.url}/services/web-development` }
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
              <span className="text-fg/70">Web Development</span>
            </nav>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
              Service
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">
              Web Development
            </h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">
              We build custom websites on Next.js — not WordPress templates — delivering Lighthouse performance scores
              above 90 out of the box. You own the code outright with no recurring plugin subscriptions, and the
              architecture is built to scale with your business over the next five years.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <span>Discuss a Build</span>
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
              <Terminal className="h-4 w-4 text-accentA" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-fg/52">What&apos;s Included</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Scalable builds engineered for performance</h2>
            <span className="mt-3 block h-px w-20 bg-accent-gradient" />
            <p className="mt-6 max-w-2xl text-[1.01rem] leading-[1.78] text-fg/68">
              Every site we build is production-ready from day one. No plugin debt, no fragile theme overrides. A clean
              codebase your team can hand off to any developer in the future, or maintain independently.
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
                  Built on Next.js 15 with server components, static generation, and edge caching. No plugin
                  subscriptions. No recurring platform fees.
                </div>
              </div>
            </div>
          </article>
        </SectionReveal>

        {/* Related Work */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold md:text-3xl">Development Work</h2>
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
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-accentA">
                    View case study
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {project.liveUrl ? (
                    <span className="text-[0.58rem] uppercase tracking-[0.14em] text-fg/38">Live site</span>
                  ) : null}
                </div>
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
              Need a structured CMS alongside your build?{" "}
              <Link href="/services/cms-architecture" className="link-sweep text-accentA hover:text-accentA/80">
                See CMS Architecture
              </Link>{" "}
              or{" "}
              <Link href="/services" className="link-sweep text-accentA hover:text-accentA/80">
                back to all services
              </Link>
              .
            </p>
          </div>
        </SectionReveal>

        {/* CTA */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <SiteCtaSection />
        </SectionReveal>
      </div>
    </>
  );
}
