export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { pricingTiers as tiers, tierPriceNumeric } from "@/lib/pricing";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — What a Brand and Website Cost",
  description:
    "Transparent starting prices for brand identity, websites, and full brand-and-website projects. Custom-built, no templates, no page builders. See what each package includes and what changes the price.",
  path: "/pricing",
  ogEyebrow: "Pricing",
  ogTitle: "Pricing — Brand and Website Projects | Graphxify",
  ogDescription:
    "Brand identity from $1,200. Starter websites from $2,000. Full brand and website from $6,500. Clear starting prices, no discovery call required to find out.",
  ogImageAlt: "Graphxify pricing — starting prices for brand identity and website projects"
});


const priceFactors = [
  {
    title: "Number of pages",
    body: "A five-page site and a twenty-page site are different builds. Page count is usually the single biggest driver."
  },
  {
    title: "Brand work included",
    body: "If you already have a brand system we can work from, the design phase is shorter. If not, brand comes first."
  },
  {
    title: "CMS complexity",
    body: "A simple content editor costs less than a multi-role system with custom workflows and publishing approvals."
  },
  {
    title: "Integrations",
    body: "Connecting a CRM, booking system, payment provider, or existing tooling adds development and testing time."
  },
  {
    title: "Content readiness",
    body: "Projects move faster and cost less when copy and images are ready. We can help, and that adds scope."
  },
  {
    title: "Timeline",
    body: "Standard timelines are priced as listed. Compressed launches need reordered work and are quoted separately."
  }
];

const pricingFaqs = [
  {
    q: "Are these fixed prices?",
    a: "They are starting prices. Every project is quoted individually once we understand scope — the figures here tell you where each package begins so you can judge fit before getting in touch."
  },
  {
    q: "Why not just publish one flat price?",
    a: "Because it would be misleading. A five-page brochure site and a fifteen-page site with a multi-role CMS are genuinely different amounts of work. Starting prices plus the factors above give you an honest picture."
  },
  {
    q: "What if my project doesn't fit a package?",
    a: "Most don't fit perfectly. The packages exist to give you a reference point. Tell us what you actually need and we will scope it properly."
  },
  {
    q: "Do you build with templates to keep costs down?",
    a: "No. Everything is designed and developed from scratch — no page builders, no off-the-shelf themes. That is what these prices buy."
  },
  {
    q: "Do you work with smaller budgets?",
    a: "Sometimes, depending on scope and timing. If your budget is below the Brand Identity starting price, say so in your enquiry and we will tell you honestly whether we can help."
  }
];

function pricingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Graphxify Pricing",
    description: "Starting prices for brand identity, website, and combined brand-and-website projects.",
    url: `${siteConfig.url}/pricing`,
    itemListElement: tiers.map((tier, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: tier.name,
        description: tier.summary,
        url: `${siteConfig.url}/pricing`,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url
        },
        areaServed: "Worldwide",
        offers: {
          "@type": "Offer",
          price: tierPriceNumeric(tier),
          priceCurrency: "USD",
          // Published figures are floors, not exact quotes.
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: tierPriceNumeric(tier),
            priceCurrency: "USD",
            valueAddedTaxIncluded: false
          },
          availability: "https://schema.org/InStock",
          url: `${siteConfig.url}/contact`
        }
      }
    }))
  };
}

export default function PricingPage() {
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Pricing", url: `${siteConfig.url}/pricing` }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs as Record<string, unknown>} />
      <JsonLd data={pricingJsonLd() as Record<string, unknown>} />

      <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
        {/* Hero */}
        <SectionReveal className="container" effect="up">
          <div className="mx-auto max-w-4xl">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
              Pricing
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">
              What this actually costs.
            </h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">
              Most agencies make you book a call to find out. We would rather you know now. Below are the starting prices
              for each type of project, what is included, and the things that move the number up or down. Every project is
              still quoted individually — but you should not have to guess whether we are in your range.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <span>Get a Quote</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="px-6">
                <Link href="/works">See the Work</Link>
              </Button>
            </div>
          </div>
        </SectionReveal>

        {/* Tiers */}
        <SectionReveal className="container mt-14 md:mt-16 lg:mt-20" effect="up">
          <div className="grid gap-4 lg:grid-cols-2">
            {tiers.map((tier) => (
              <article
                key={tier.key}
                className={`section-shell relative flex flex-col p-6 md:p-8 ${
                  tier.featured
                    ? "border-accentA/26 bg-card/85"
                    : "border-border/18 bg-card/74"
                }`}
              >
                {tier.featured ? (
                  <span className="absolute right-6 top-6 rounded-full border border-accentA/24 bg-accentA/[0.07] px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-accentA">
                    Most requested
                  </span>
                ) : null}

                <h2 className="text-xl font-semibold md:text-2xl">{tier.name}</h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-fg/48">from</span>
                  <span className="text-[2.6rem] font-semibold leading-none tracking-tight md:text-[3rem]">
                    ${tier.price}
                  </span>
                  <span className="text-sm text-fg/48">USD</span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-fg/44">{tier.timeline}</p>
                <span className="mt-5 block h-px w-16 bg-accent-gradient" />
                <p className="mt-5 text-sm leading-relaxed text-fg/68">{tier.summary}</p>

                <ul className="mt-6 grid flex-1 gap-2">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-fg/72">
                      <Check className="mt-[0.15rem] h-3.5 w-3.5 shrink-0 text-accentA/70" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button asChild size="sm" variant={tier.featured ? "default" : "secondary"}>
                    <Link href="/contact">Start a Project</Link>
                  </Button>
                  <Link
                    href={tier.serviceHref}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fg/60 hover:text-fg"
                  >
                    Details
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-fg/48">
            Prices in USD. Quoted individually per project — these are starting points, not fixed quotes.
          </p>
        </SectionReveal>

        {/* What changes the price */}
        <SectionReveal className="container mt-12 md:mt-16" effect="up">
          <article className="section-shell border-border/18 bg-card/74 p-7 md:p-10 lg:p-14">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/52">Scope</p>
            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">What moves the number</h2>
            <span className="mt-3 block h-px w-20 bg-accent-gradient" />
            <p className="mt-6 max-w-2xl text-[1.01rem] leading-[1.78] text-fg/68">
              Six things account for nearly all the variation between a starting price and a final quote. Knowing them up
              front usually shortens the conversation considerably.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {priceFactors.map((factor) => (
                <div key={factor.title} className="rounded-xl border border-border/16 bg-bg/45 px-5 py-4">
                  <h3 className="text-sm font-semibold text-fg/86">{factor.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-fg/58">{factor.body}</p>
                </div>
              ))}
            </div>
          </article>
        </SectionReveal>

        {/* Pricing FAQ */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <div className="section-shell border-border/18 bg-card/74 p-7 md:p-10">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-accentA" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.2em] text-fg/52">Questions</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Straight answers</h2>
            <span className="mt-3 block h-px w-20 bg-accent-gradient" />

            <dl className="mt-8 grid gap-4 md:grid-cols-2">
              {pricingFaqs.map((item) => (
                <div key={item.q} className="rounded-xl border border-border/16 bg-bg/45 px-5 py-4">
                  <dt className="text-sm font-semibold text-fg/86">{item.q}</dt>
                  <dd className="mt-2 text-xs leading-relaxed text-fg/58">{item.a}</dd>
                </div>
              ))}
            </dl>
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
