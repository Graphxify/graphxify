export const revalidate = 3600;

import type { Metadata } from "next";
import { ServiceDetail, type RelatedPost, type RelatedProject } from "@/components/marketing/service-detail";
import type { ServiceFaqItem } from "@/components/marketing/service-faq";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd, canonicalUrl, serviceJsonLd } from "@/lib/seo";
import { getServiceWorkCards } from "../work-cards";

export const metadata: Metadata = buildMetadata({
  title: "Web Design Services — Custom Website Design",
  description:
    "Custom website interface design built for clarity, hierarchy, and conversion. Mobile-first, accessible, and responsive across every screen size.",
  path: "/services/web-design",
  ogTitle: "Web Design — Conversion-Focused Websites | Graphxify",
  ogDescription: "Custom, mobile-first websites designed with clear hierarchy and layouts built to guide visitors toward action — WCAG accessible, no templates.",
  ogImageAlt: "Custom web design services by Graphxify — conversion-focused, mobile-first, accessible"
});

const relatedProjects: RelatedProject[] = [
  {
    pathSlug: "flyup-line",
    outcome: "Structured interface designed to simplify flight discovery and build trust from first visit."
  },
  {
    pathSlug: "pharmacy-on-king",
    outcome: "Clear, accessible layout that helps patients find services and contact information without friction."
  },
  {
    pathSlug: "king-medical-art-pharmacy",
    outcome: "Professional website designed to serve a medical arts pharmacy with structure and clarity."
  }
];

const relatedPosts: RelatedPost[] = [
  { slug: "how-to-choose-a-web-design-agency", label: "How to Choose the Right Web Design Agency" },
  { slug: "mobile-first-website-small-businesses", label: "Why Small Businesses Need a Mobile-First Website in 2026" },
  { slug: "professional-website-business-growth", label: "How a Professional Website Drives Real Business Growth" }
];

const serviceFaqs: ServiceFaqItem[] = [
  {
    q: "Do you use templates or page builders?",
    a: "No. Every layout is designed from scratch for your content and your goals. That is the main reason a custom site costs more than a template, and the main reason it performs better."
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
    a: "We design to WCAG guidelines (colour contrast, keyboard navigation, focus states, and semantic structure) and run an accessibility review before launch."
  }
];

export default async function WebDesignPage() {
  const works = await getServiceWorkCards();
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: canonicalUrl("/") },
    { name: "Services", url: canonicalUrl("/services") },
    { name: "Web Design", url: canonicalUrl("/services/web-design") }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={serviceJsonLd("web-design")} />
      <ServiceDetail
        serviceKey="web-design"
        lead="We design website interfaces built to communicate clearly and convert visitors into leads. Every layout prioritises hierarchy so your main message, your differentiator, and your call to action are visible before the scroll. Designed mobile-first, responsive across all screen sizes, and built with accessibility in mind."
        ctaLabel="Start a design project"
        statement={{
          title: "Structured interfaces with clarity and hierarchy.",
          body: "A well-designed website isn't just aesthetic. It earns trust, directs attention, and reduces friction between a visitor and a decision. We design with that goal in mind from the first wireframe."
        }}
        relatedHeading="Design work."
        relatedProjects={relatedProjects}
        relatedPosts={relatedPosts}
        faqs={serviceFaqs}
        works={works}
      />
    </>
  );
}
