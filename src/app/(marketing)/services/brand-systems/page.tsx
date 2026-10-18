export const revalidate = 3600;

import type { Metadata } from "next";
import { ServiceDetail, type RelatedPost, type RelatedProject } from "@/components/marketing/service-detail";
import type { ServiceFaqItem } from "@/components/marketing/service-faq";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd, canonicalUrl, serviceJsonLd } from "@/lib/seo";
import { getServiceWorkCards } from "../work-cards";

export const metadata: Metadata = buildMetadata({
  title: "Brand Systems — Visual Identity Design",
  description:
    "Complete brand identity systems: logo suite, typography, colour palette, brand voice, and guidelines — delivered in two to three weeks.",
  path: "/services/brand-systems",
  ogTitle: "Brand Systems — Logo, Identity & Visual Strategy | Graphxify",
  ogDescription: "A complete visual identity built from the ground up: logo, colour, typography, and messaging that works consistently across every touchpoint. Delivered in 2–3 weeks.",
  ogImageAlt: "Brand identity and visual systems by Graphxify — logo, colour, and typography design"
});

const relatedProjects: RelatedProject[] = [
  {
    pathSlug: "maven",
    outcome: "Complete brand identity system built for a minimalist fashion label, scaled across apparel and digital."
  },
  {
    pathSlug: "luka-hair-salon",
    outcome: "A refined visual identity designed to communicate elegance and attract premium salon clients."
  },
  {
    pathSlug: "boss-medical-clinic",
    outcome: "Brand identity and website built to communicate authority and credibility for a modern clinic."
  }
];

const relatedPosts: RelatedPost[] = [
  { slug: "what-makes-a-strong-brand-identity", label: "What Makes a Strong Brand Identity" },
  { slug: "how-to-choose-a-web-design-agency", label: "How to Choose the Right Web Design Agency" }
];

const serviceFaqs: ServiceFaqItem[] = [
  {
    q: "How long does a brand identity take?",
    a: "Two to three weeks for a complete identity, assuming feedback comes back within a couple of days at each stage. Rushed brand work tends to produce brand work you replace in a year."
  },
  {
    q: "What if I already have a logo I like?",
    a: "Then we keep it. Plenty of projects start with a usable logo and need everything around it: type, colour, and the rules for applying them consistently. We will tell you honestly if the logo is holding you back."
  },
  {
    q: "Do I own the files?",
    a: "Yes, outright. You receive the full export package: source files, web and print formats, and the guidelines document. Nothing is licensed back to you."
  },
  {
    q: "Can you do brand without a website?",
    a: "Yes. Brand Identity is a standalone engagement. Many clients do brand first and build the site later, which works well because the site then has something to be designed against."
  }
];

export default async function BrandSystemsPage() {
  const works = await getServiceWorkCards();
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: canonicalUrl("/") },
    { name: "Services", url: canonicalUrl("/services") },
    { name: "Brand Systems", url: canonicalUrl("/services/brand-systems") }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={serviceJsonLd("brand-systems")} />
      <ServiceDetail
        serviceKey="brand-systems"
        lead="We build complete brand identity systems so your business looks credible and consistent from day one. Logo suite, typography, colour palette, brand voice, and usage guidelines, all delivered as one structured system your team can maintain without a designer making every call."
        ctaLabel="Start a brand project"
        statement={{
          title: "Complete identity, delivered as one system.",
          body: "Every brand system we deliver is built to be self-sufficient. Your team gets everything needed to stay on-brand across every format (website, social, print, pitch decks) without calling a designer for every decision."
        }}
        relatedHeading="Brand work."
        relatedProjects={relatedProjects}
        relatedPosts={relatedPosts}
        faqs={serviceFaqs}
        works={works}
      />
    </>
  );
}
