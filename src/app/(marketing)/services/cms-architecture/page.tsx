export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "CMS Architecture — Structured Content Systems for Canadian Businesses",
  description:
    "Graphxify designs structured content management systems with defined roles, workflows, and content models your team can manage confidently. Delivered standalone or as part of a web development engagement.",
  path: "/services/cms-architecture",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "CMS Architecture — Content Systems Your Team Can Own | Graphxify",
  ogDescription: "We build the structure, workflows, and content models your team needs to publish confidently — no developer required for day-to-day updates.",
  ogImageAlt: "CMS architecture and structured content systems designed by Graphxify"
});

const deliverables = [
  "Content model design and documentation",
  "CMS platform setup and configuration",
  "User roles and permissions structure",
  "Custom editing workflows",
  "Editor training guide",
  "Governance documentation"
];

const guidance = [
  { label: "Best for", value: "Teams who need to update their site regularly without developer help" },
  {
    label: "Typical project",
    value: "Delivered as part of a web development engagement or as a standalone CMS migration"
  },
  {
    label: "Business outcome",
    value: "Your team publishes confidently. Your site stays on-brand without constant developer involvement."
  }
];

const relatedPosts = [
  {
    slug: "professional-website-business-growth-canada",
    label: "How a Professional Website Drives Real Business Growth in Canada"
  },
  {
    slug: "custom-web-development-vs-wordpress-canada",
    label: "Custom Web Development vs. WordPress: A Guide for Canadian Business Owners"
  }
];

function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CMS Architecture",
    description:
      "Structured content management systems with defined roles, workflows, and content models for Canadian businesses that need to publish independently.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed: { "@type": "Country", name: "Canada" },
    url: `${siteConfig.url}/services/cms-architecture`
  };
}

export default function CmsArchitecturePage() {
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Services", url: `${siteConfig.url}/services` },
    { name: "CMS Architecture", url: `${siteConfig.url}/services/cms-architecture` }
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
              <span className="text-fg/70">CMS Architecture</span>
            </nav>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
              Service
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">
              CMS Architecture
            </h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">
              We design content management systems where your team can publish pages, blog posts, and updates without
              designer involvement — and without breaking the layout. Content models, user roles, and publishing
              workflows are defined before a line of code is written, so the CMS fits how your team actually works.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <span>Discuss a CMS Project</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="px-6">
                <Link href="/services/web-development">See Web Development</Link>
              </Button>
            </div>
          </div>
        </SectionReveal>

        {/* What's Included */}
        <SectionReveal className="container mt-14 md:mt-16 lg:mt-20" effect="up">
          <article className="section-shell border-border/18 bg-card/74 p-7 md:p-10 lg:p-14">
            <div className="flex items-center gap-2.5">
              <Blocks className="h-4 w-4 text-accentA" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-fg/52">What&apos;s Included</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Structured content systems built for scale</h2>
            <span className="mt-3 block h-px w-20 bg-accent-gradient" />
            <p className="mt-6 max-w-2xl text-[1.01rem] leading-[1.78] text-fg/68">
              Most CMS problems are structural, not technical. Content gets siloed, layouts break on editor updates, and
              publishing requires developer involvement for every change. We solve this at the architecture level — before
              any code is written.
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
                  Content models are designed before a line of code is written, so the CMS fits how your team works —
                  not the other way around.
                </div>
              </div>
            </div>
          </article>
        </SectionReveal>

        {/* How it fits */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
            <h2 className="text-xl font-semibold">How CMS Architecture fits into a project</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg/66">
              CMS Architecture is most often delivered as part of a{" "}
              <Link href="/services/web-development" className="link-sweep text-accentA hover:text-accentA/80">
                Web Development
              </Link>{" "}
              engagement — the content model is defined in parallel with the build so the two are fully integrated from
              launch. It can also be scoped as a standalone migration if your existing site needs a publishing
              restructure without a full rebuild.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "With a new build",
                  body: "Content model defined before development starts. The CMS is shaped around how your team publishes, not the framework defaults."
                },
                {
                  title: "As a migration",
                  body: "Existing content restructured and migrated into a clean, governed CMS setup. Editors trained on the new workflow before handoff."
                },
                {
                  title: "As an audit",
                  body: "Current CMS reviewed for structural problems. Recommendations delivered for how to improve governance without rebuilding from scratch."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border/16 bg-bg/45 p-4">
                  <p className="text-sm font-semibold text-fg/90">{item.title}</p>
                  <p className="mt-2 text-sm text-fg/62">{item.body}</p>
                </div>
              ))}
            </div>
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
                  <ArrowUpRight className="ml-3 h-3.5 w-3.5 shrink-0 text-fg/38 group-hover:text-accentA" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <p className="mt-5 text-sm text-fg/52">
              <Link href="/services" className="link-sweep text-accentA hover:text-accentA/80">
                Back to all services
              </Link>
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
