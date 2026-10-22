import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/site/arrow-link";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd, canonicalUrl, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Website Growth Checklist",
  description: "A practical website growth checklist for service businesses, covering the conversion, trust, SEO, and content fundamentals you can act on today.",
  path: "/resources/website-growth-checklist",
  ogTitle: "Free Website Growth Checklist | Graphxify",
  ogDescription: "A practical, no-fluff checklist covering conversion, trust signals, SEO, and content fundamentals for service businesses.",
  ogImageAlt: "Free website growth checklist by Graphxify — conversion, trust, and SEO fundamentals"
});

const CHECKLIST_SECTIONS = [
  {
    title: "Foundation",
    items: [
      "State clearly what you do and who you help above the fold.",
      "Use one primary call to action on the homepage and service pages.",
      "Make sure your navigation is simple and understandable on mobile.",
      "Check that every key page loads quickly and feels stable."
    ]
  },
  {
    title: "Trust",
    items: [
      "Show real testimonials, logos, or proof of previous work.",
      "Add a clear contact method and response expectation.",
      "Use consistent branding, typography, and messaging across the site."
    ]
  },
  {
    title: "Conversion",
    items: [
      "Make inquiry forms short, frictionless, and easy to complete.",
      "Add call-to-action buttons at the end of every major section.",
      "Explain what happens after someone reaches out."
    ]
  },
  {
    title: "Local SEO",
    items: [
      "Mention your city or service area naturally in headings and copy.",
      "Use page titles and meta descriptions that match local intent.",
      "Keep business details consistent across your site and listings."
    ]
  }
];

const CHECK_COUNT = CHECKLIST_SECTIONS.reduce((total, section) => total + section.items.length, 0);

// Who it is for: the three outcomes the hero lead promises, each tied to the checklist sections that deliver it.
const AUDIENCE = [
  { title: "Look credible", body: "Clear messaging above the fold, simple mobile navigation, and pages that load fast and feel stable." },
  { title: "Earn trust", body: "Real proof of previous work, a clear contact method and response expectation, and consistent branding." },
  { title: "Convert visitors into inquiries", body: "Short inquiry forms, a call to action after every major section, and local search basics done right." }
] as const;

export default function WebsiteGrowthChecklistPage(): JSX.Element {
  return (
    <>
      <JsonLd data={webPageJsonLd("WebPage", "/resources/website-growth-checklist", "Website Growth Checklist")} />
      <JsonLd data={breadcrumbListJsonLd([{ name: "Home", url: canonicalUrl("/") }, { name: "Website Growth Checklist", url: canonicalUrl("/resources/website-growth-checklist") }])} />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Website Growth Checklist" }]}
        label="Free resource"
        title={
          <>
            Website growth <span className="text-accentB">checklist</span>
          </>
        }
        lead="A concise checklist for service businesses that want a website that looks credible, earns trust, and converts more visitors into inquiries."
        actions={
          <>
            <Button asChild size="lg">
              <a href="#checklist-signup">Get it by email</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#checklist">Read it now</a>
            </Button>
          </>
        }
        facts={[
          { label: "Sections", value: String(CHECKLIST_SECTIONS.length) },
          { label: "Checks", value: String(CHECK_COUNT) },
          { label: "Written for", value: "Service businesses" },
          { label: "Price", value: "Free, no sign-up needed" }
        ]}
      />

      <section id="checklist" className="container section scroll-mt-24 pt-6 md:pt-8">
        <Reveal>
          <SectionIntro
            badge="The checklist"
            title={
              <>
                What&apos;s <span className="text-accentB">inside</span>
              </>
            }
            lead="Conversion, trust, and SEO fundamentals you can act on today."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
          {CHECKLIST_SECTIONS.map((section, index) => (
            <Reveal as="section" key={section.title} delay={(index % 2) * 80} className="flex flex-col rounded-[2rem] bg-white p-7 md:p-9">
              <div className="flex items-center justify-between">
                <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-fg text-[0.9375rem] font-extrabold text-white">
                  {index + 1}
                </span>
                <span className="rounded-full bg-bg px-3 py-1 text-[0.8125rem] font-semibold text-fg/72">{section.items.length} checks</span>
              </div>
              <h3 className="t-h3 mt-8 text-fg">{section.title}</h3>
              <ul className="mt-5 space-y-3.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] font-medium leading-relaxed text-fg/80 md:text-base">
                    <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-fg">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section pt-0 md:pt-0">
        <Reveal>
          <SectionIntro
            badge="Who it's for"
            title={
              <>
                Written for service <span className="text-accentB">businesses</span>
              </>
            }
            lead="For owners who want their website to do three things well."
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {AUDIENCE.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 80} className="rounded-[2rem] bg-white p-7">
              <h3 className="t-h3 text-fg">{item.title}</h3>
              <p className="t-body mt-2 !text-[0.9375rem]">{item.body}</p>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ArrowLink href="/contact">Rather have us do it? Start a project</ArrowLink>
        </div>
      </section>

      {/* Capture, not a gate: the checklist stays readable and indexable, but
          visitors who want it in their inbox (and future guides) can subscribe. */}
      <section id="checklist-signup" className="container scroll-mt-24 pb-20 md:pb-28">
        <Reveal>
          <NewsletterSignup
            source="checklist"
            idPrefix="checklist"
            heading="Want this in your inbox?"
            blurb="Subscribe and we'll email you this checklist to keep, plus practical guides on web design, branding, and growing a business website."
          />
        </Reveal>
      </section>
    </>
  );
}
