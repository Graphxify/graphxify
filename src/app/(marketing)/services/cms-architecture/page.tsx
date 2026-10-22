export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { ServiceDetail, type RelatedPost } from "@/components/marketing/service-detail";
import type { ServiceFaqItem } from "@/components/marketing/service-faq";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd, canonicalUrl, serviceJsonLd } from "@/lib/seo";
import { getServiceWorkCards } from "../work-cards";

export const metadata: Metadata = buildMetadata({
  title: "CMS Development & Architecture",
  description:
    "Structured content management systems with defined roles, workflows, and content models your team can manage confidently, without a developer.",
  path: "/services/cms-architecture",
  ogTitle: "CMS Development & Architecture | Graphxify",
  ogDescription: "We build the structure, workflows, and content models your team needs to publish confidently — no developer required for day-to-day updates.",
  ogImageAlt: "CMS architecture and structured content systems designed by Graphxify"
});

const engagementModes = [
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
];

const relatedPosts: RelatedPost[] = [
  { slug: "professional-website-business-growth", label: "How a Professional Website Drives Real Business Growth" },
  { slug: "custom-web-development-vs-wordpress", label: "Custom Web Development vs. WordPress: A Guide for Business Owners" }
];

const serviceFaqs: ServiceFaqItem[] = [
  {
    q: "Which CMS do you use?",
    a: "It depends on the content model, not on a favourite. We have built on headless setups backed by Postgres as well as established platforms. The structure matters far more than the brand name on it."
  },
  {
    q: "Can my team really update the site without a developer?",
    a: "That is the entire point. We design the content model around what your team actually publishes, then set up roles and workflows so people can only change what they should. You get a training guide as part of the handover."
  },
  {
    q: "Is CMS work sold on its own?",
    a: "Usually it is part of a website build rather than a separate line item. Standalone CMS migrations for an existing site are quoted separately. Get in touch and we will scope it."
  },
  {
    q: "What if we outgrow the initial structure?",
    a: "The content model is documented, so extending it later is a defined change rather than a rebuild. That documentation is a deliverable, not an afterthought."
  }
];

export default async function CmsArchitecturePage() {
  const works = await getServiceWorkCards();
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: canonicalUrl("/") },
    { name: "Services", url: canonicalUrl("/services") },
    { name: "CMS Architecture", url: canonicalUrl("/services/cms-architecture") }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={serviceJsonLd("cms-architecture")} />
      <ServiceDetail
        serviceKey="cms-architecture"
        lead="We design content management systems where your team can publish pages, blog posts, and updates without designer involvement, and without breaking the layout. Content models, user roles, and publishing workflows are defined before a line of code is written, so the CMS fits how your team actually works."
        ctaLabel="Discuss a CMS project"
        statement={{
          title: "Structured content systems built for scale.",
          body: "Most CMS problems are structural, not technical. Content gets siloed, layouts break on editor updates, and publishing requires developer involvement for every change. We solve this at the architecture level, before any code is written."
        }}
        relatedPosts={relatedPosts}
        faqs={serviceFaqs}
        works={works}
      >
        {/* How it fits */}
        <section className="container section">
          <Reveal>
            <SectionIntro
              badge="How it fits"
              title={<>How CMS Architecture fits into a <span className="text-accentB">project</span>.</>}
              lead={
                <>
                  CMS Architecture is most often delivered as part of a{" "}
                  <Link href="/services/web-development" className="font-semibold text-accentB underline-offset-4 hover:underline">
                    Web Development
                  </Link>{" "}
                  engagement. The content model is defined in parallel with the build so the two are fully integrated from launch. It can also be
                  scoped as a standalone migration if your existing site needs a publishing restructure without a full rebuild.
                </>
              }
            />
          </Reveal>
          <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
            {engagementModes.map((mode, index) => (
              <Reveal as="li" key={mode.title} delay={index * 80} className="flex flex-col rounded-[2rem] bg-white p-7 md:p-8">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-fg text-[0.9375rem] font-extrabold text-white">{index + 1}</span>
                <h3 className="t-h3 mt-10 text-fg">{mode.title}</h3>
                <p className="t-body mt-2 !text-[0.9375rem]">{mode.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      </ServiceDetail>
    </>
  );
}
