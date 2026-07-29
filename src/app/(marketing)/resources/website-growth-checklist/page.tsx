import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Website Growth Checklist",
  description: "A practical website growth checklist for service businesses covering conversion, trust, SEO, and content fundamentals.",
  path: "/resources/website-growth-checklist",
  ogTitle: "Free Website Growth Checklist for Modern Businesses | Graphxify",
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

export default function WebsiteGrowthChecklistPage() {
  return (
    <main className="container py-16 md:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="section-shell border-border/18 bg-card/78 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Free Resource</p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.98] tracking-tight">
            Website Growth Checklist
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg/62 md:text-base">
            A concise checklist for service businesses that want a website that looks credible, earns trust, and converts more visitors into inquiries.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {CHECKLIST_SECTIONS.map((section) => (
            <section key={section.title} className="section-shell border-border/18 bg-card/72 p-6">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-fg/62">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accentA" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Capture, not a gate: the checklist stays readable and indexable, but
            visitors who want it in their inbox (and future guides) can subscribe. */}
        <NewsletterSignup
          source="checklist"
          idPrefix="checklist"
          heading="Want this in your inbox?"
          blurb="Subscribe and we'll email you this checklist to keep, plus practical guides on web design, branding, and growing a business website."
        />
      </div>
    </main>
  );
}
