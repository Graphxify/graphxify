export const revalidate = 3600;

import type { Metadata } from "next";
import { ServiceDetail, type RelatedPost, type RelatedProject } from "@/components/marketing/service-detail";
import type { ServiceFaqItem } from "@/components/marketing/service-faq";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd, canonicalUrl, serviceJsonLd } from "@/lib/seo";
import { getServiceWorkCards } from "../work-cards";

export const metadata: Metadata = buildMetadata({
  title: "Web Development — Custom Next.js Websites",
  description:
    "Custom websites built on Next.js, not WordPress templates. Engineered to a Lighthouse 90+ performance target, with full code ownership.",
  path: "/services/web-development",
  ogTitle: "Web Development — Fast, Scalable Next.js Sites | Graphxify",
  ogDescription: "Custom Next.js websites engineered to a Lighthouse 90+ performance target, with a technically sound SEO foundation and full code ownership.",
  ogImageAlt: "Web development with Next.js — high-performance websites by Graphxify"
});

const relatedProjects: RelatedProject[] = [
  {
    pathSlug: "flyup-line",
    outcome: "Responsive platform with a streamlined booking flow and optimised performance across devices."
  },
  {
    pathSlug: "boss-medical-clinic",
    outcome: "Full website build with service-driven layout and clear content structure for a medical clinic."
  },
  {
    pathSlug: "pharmacy-on-king",
    outcome: "Responsive website with intuitive navigation and clear service presentation for a community pharmacy."
  }
];

const relatedPosts: RelatedPost[] = [
  { slug: "custom-web-development-vs-wordpress", label: "Custom Web Development vs. WordPress: A Guide for Business Owners" },
  { slug: "professional-website-business-growth", label: "How a Professional Website Drives Real Business Growth" },
  { slug: "mobile-first-website-small-businesses", label: "Why Small Businesses Need a Mobile-First Website in 2026" }
];

const serviceFaqs: ServiceFaqItem[] = [
  {
    q: "Why Next.js and not WordPress?",
    a: "Speed, security, and control. There are no plugins to break, no theme to fight, and no monthly patching treadmill. We wrote a full comparison if you want the detail; see Related reading above."
  },
  {
    q: "Do I own the code?",
    a: "Yes, outright. The repository is yours, deployed to your own hosting account. You are never locked in to us, and any competent Next.js developer can pick it up."
  },
  {
    q: "Can you rebuild my existing site?",
    a: "Yes, and it is a large share of what we do. We migrate content, preserve your URLs with redirects so rankings survive, and improve performance in the process."
  },
  {
    q: "What happens after launch?",
    a: "You get documentation and a handover session so your team can run the site. We stay available for changes, but you are not obliged to keep paying us to keep the site working."
  }
];

export default async function WebDevelopmentPage() {
  const works = await getServiceWorkCards();
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: canonicalUrl("/") },
    { name: "Services", url: canonicalUrl("/services") },
    { name: "Web Development", url: canonicalUrl("/services/web-development") }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={serviceJsonLd("web-development")} />
      <ServiceDetail
        serviceKey="web-development"
        lead="We build custom websites on Next.js, not WordPress templates, engineered to a Lighthouse 90+ performance target. You own the code outright with no recurring plugin subscriptions, and the architecture is built to scale with your business over the next five years."
        ctaLabel="Discuss a build"
        statement={{
          title: "Scalable builds engineered for performance.",
          body: "Every site we build is production-ready from day one. No plugin debt, no fragile theme overrides. A clean codebase your team can hand off to any developer in the future, or maintain independently."
        }}
        relatedHeading="Development work."
        relatedProjects={relatedProjects}
        relatedPosts={relatedPosts}
        faqs={serviceFaqs}
        works={works}
      />
    </>
  );
}
