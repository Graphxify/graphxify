export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/site/arrow-link";
import { CtaBlock } from "@/components/site/cta-block";
import { FaqList } from "@/components/site/faq-list";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { ProcessStageNav } from "@/components/marketing/process-stage-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd, canonicalUrl } from "@/lib/seo";

// One visual per stage (.design-qa/scenes.mjs), built from real material: this site's own
// sitemap, then a real client page as wireframe, as final design, and live on phones.
const stageVisuals = [
  { src: "/images/scenes/process-discover.webp", alt: "The Graphxify sitemap: home, the main pages and the four service pages" },
  { src: "/images/scenes/process-structure.webp", alt: "The Pharmacy On King homepage as a blueprint wireframe" },
  { src: "/images/scenes/process-design.webp", alt: "The Pharmacy On King homepage in a design file: desktop and mobile artboards, its colour and type styles, and reusable components" },
  { src: "/images/scenes/process-ship.webp", alt: "The live Pharmacy On King website on three phones" }
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Our Process — How a Project Actually Runs",
  description:
    "The four stages of a Graphxify project: Discover, Structure, Design, Build & Ship. What happens at each, what you get, and how long it takes.",
  path: "/process",
  ogEyebrow: "Process",
  ogTitle: "How We Work — The Graphxify Process",
  ogDescription:
    "Discover, Structure, Design, Build & Ship. Four stages, clear deliverables at each one, and an honest account of what makes projects run late.",
  ogImageAlt: "The Graphxify process — discover, structure, design, build and ship"
});

/**
 * Stages intentionally match the four `approachSteps` on /about so the two
 * pages never describe different processes. /about summarises; this page is
 * the detail: deliverables, client input, and duration per stage.
 */
const stages: Array<{
  num: string;
  title: string;
  duration: string;
  summary: string;
  weDo: readonly string[];
  youGet: readonly string[];
  weNeed: string;
}> = [
  {
    num: "01",
    title: "Discover",
    duration: "3 to 5 days",
    summary:
      "Before anything gets designed we need to understand what the business actually needs the site to do. Not a workshop for its own sake, but a short, focused stage that prevents expensive changes later.",
    weDo: [
      "Review your current site, analytics, and enquiry flow",
      "Clarify goals, audience, and what a win looks like",
      "Look at how competitors position themselves",
      "Agree scope, tiering, and the page list"
    ],
    youGet: ["A written scope with an agreed page list", "A fixed quote", "A project timeline with review dates"],
    weNeed: "One conversation, access to any analytics you have, and an honest account of what is not working today."
  },
  {
    num: "02",
    title: "Structure",
    duration: "3 to 5 days",
    summary:
      "The stage most agencies skip. We decide what goes on each page and in what order before worrying about how it looks, because layout decisions made without a content plan get redone.",
    weDo: [
      "Map the site architecture and navigation",
      "Wireframe each key page",
      "Design the content model the CMS will use",
      "Identify content you need to write or supply"
    ],
    youGet: ["Sitemap and navigation structure", "Wireframes for every key page", "A content checklist with owners"],
    weNeed: "Feedback on the wireframes, and a decision on who is writing the copy: you, us, or both."
  },
  {
    num: "03",
    title: "Design",
    duration: "1 to 3 weeks",
    summary:
      "Now it looks like something. You see high-fidelity designs and click through a real prototype before a line of production code is written. Nothing gets built that you have not approved.",
    weDo: [
      "Design desktop and mobile for every page",
      "Build a reusable component system",
      "Assemble an interactive prototype",
      "Run an accessibility review against WCAG guidelines"
    ],
    youGet: ["High-fidelity designs, desktop and mobile", "A clickable prototype", "A component design system"],
    weNeed: "Consolidated feedback at each review. One round of collected comments beats five separate messages."
  },
  {
    num: "04",
    title: "Build & Ship",
    duration: "2 to 4 weeks",
    summary:
      "Custom Next.js development, tested across real devices, then deployed to your own hosting account with the CMS configured and your team trained on it.",
    weDo: [
      "Build the approved designs in Next.js",
      "Configure the CMS, roles, and workflows",
      "Test performance, accessibility, and cross-device behaviour",
      "Migrate content and set up redirects to protect rankings"
    ],
    youGet: ["A live site on hosting you own", "The full codebase, yours outright", "Editor training guide and handover session"],
    weNeed: "Final content sign-off, and domain or hosting access when it is time to go live."
  }
];

const slippageFactors = [
  {
    title: "Content that is not ready",
    body: "By a wide margin the most common cause of delay. A project waiting on copy cannot move, no matter how much design is finished."
  },
  {
    title: "Feedback arriving in pieces",
    body: "Scattered comments over two weeks cost far more than one consolidated round. We build review dates into the timeline for this reason."
  },
  {
    title: "Scope added mid-build",
    body: "New pages or features are fine, but they are quoted and scheduled rather than absorbed silently. You will always know the cost before we proceed."
  },
  {
    title: "Approvals with no clear owner",
    body: "Projects run fastest when one person can make the final call. Design by committee is the slowest possible route to a website."
  }
];

// No FAQPage schema on purpose: Google retired the FAQ rich result in May 2026
// for everything except government and health sites. Answers stay in the HTML.
const processFaqs = [
  {
    q: "How long does a whole project take?",
    a: "Four to eight weeks end to end for most projects, depending on tier. A Brand Identity alone is two to three weeks; a full brand and website is six to eight. The stage durations above add up to a realistic range, not a best case."
  },
  {
    q: "How much of my time will this take?",
    a: "Less than most people expect: roughly one conversation per stage plus consolidated feedback at each review, so a few hours in total. The exception is content. If you are writing the copy, budget properly for that."
  },
  {
    q: "What if I don't like the design?",
    a: "That is what the review stages are for. You see wireframes before design and a prototype before build, so disagreements surface early when they are cheap to resolve rather than after everything is coded."
  },
  {
    q: "Do you work in sprints or all at once?",
    a: "Stages run in sequence because each one depends on the last. You always know which stage the project is in and what is needed from you next."
  },
  {
    q: "What happens after launch?",
    a: "You get a handover session and documentation so your team can run the site independently. We stay available for changes, but you are never dependent on us to keep the site working."
  }
] as const;

export default function ProcessPage(): JSX.Element {
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: canonicalUrl("/") },
    { name: "Process", url: canonicalUrl("/process") }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Process" }]}
        label="Process"
        title={
          <>
            How a project actually <span className="text-accentB">runs</span>.
          </>
        }
        lead="Four stages, in sequence, each ending in something you can look at and approve. Below is what happens at every stage, what you receive, what we need from you, and roughly how long it takes. Including the parts that go wrong."
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/contact">Start a project</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/services">See services</Link>
            </Button>
          </>
        }
        facts={[
          { label: "Stages", value: "4, in sequence" },
          { label: "Typical timeline", value: "4 to 8 weeks" },
          { label: "Reviews", value: "At every stage" },
          { label: "Ownership", value: "Code and hosting are yours" }
        ]}
      />

      {/* ── Stages ── */}
      <div className="container">
        <ProcessStageNav stages={stages.map((stage) => ({ id: `stage-${stage.num}`, title: stage.title }))} />
        <div className="flex flex-col gap-5 md:mt-6 md:gap-6">
          {stages.map((stage, index) => (
            <Reveal key={stage.num}>
              <section
                id={`stage-${stage.num}`}
                aria-labelledby={`stage-${stage.num}-title`}
                className="scroll-mt-24 rounded-[2rem] bg-white p-6 sm:p-8 md:scroll-mt-44 md:rounded-[2.5rem] md:p-10 lg:p-12"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 md:gap-6">
                    <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-fg text-xl font-extrabold text-white md:h-20 md:w-20 md:text-[1.75rem]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="t-small">Stage {index + 1} of {stages.length}</p>
                      <h2 id={`stage-${stage.num}-title`} className="mt-1 text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-fg">
                        {stage.title}
                      </h2>
                    </div>
                  </div>
                  <p className="self-start rounded-full bg-bg px-4 py-2 text-[0.875rem] font-semibold text-fg/72 sm:self-auto">Typically {stage.duration}</p>
                </div>

                <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-center lg:gap-10">
                  <p className="t-lead max-w-[62ch] lg:col-span-6">{stage.summary}</p>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-bg lg:col-span-6">
                    <Image src={stageVisuals[index].src} alt={stageVisuals[index].alt} fill sizes="(max-width: 1023px) 100vw, 560px" className="object-cover" />
                  </div>
                </div>

                <div className="mt-10 grid gap-8 border-t border-fg/10 pt-8 md:grid-cols-2 md:gap-10 md:pt-10 lg:grid-cols-3">
                  <div>
                    <h3 className="text-[1.0625rem] font-bold tracking-[-0.015em] text-fg">What we do</h3>
                    <ul className="mt-5 space-y-3.5">
                      {stage.weDo.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[0.9375rem] font-medium leading-relaxed text-fg/72">
                          <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-fg" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[1.0625rem] font-bold tracking-[-0.015em] text-fg">What you get</h3>
                    <ul className="mt-5 space-y-3.5">
                      {stage.youGet.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[0.9375rem] font-semibold leading-relaxed text-fg">
                          <span aria-hidden="true" className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green text-fg">
                            <Check className="h-3 w-3" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[1.5rem] bg-bg p-6 md:col-span-2 lg:col-span-1">
                    <h3 className="text-[1.0625rem] font-bold tracking-[-0.015em] text-fg">From you</h3>
                    <p className="mt-4 text-[0.9375rem] font-medium leading-relaxed text-fg/72">{stage.weNeed}</p>
                  </div>
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── What makes projects run late ── */}
      <section className="container section">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-charcoal px-6 py-14 md:rounded-[2.5rem] md:px-14 md:py-20">
          <div aria-hidden="true" className="absolute -left-32 -top-40 -z-10 h-[42rem] w-[42rem] -m-[8rem] bg-[radial-gradient(closest-side,rgba(0,163,255,0.24),transparent)]" />
          <SectionIntro
            tone="dark"
            badge="Honestly"
            title={
              <>
                What makes projects run <span className="text-accentA">late</span>.
              </>
            }
            lead="Timelines slip for a small number of predictable reasons, and almost all of them are avoidable if both sides know about them at the start. So here they are."
          />
          <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
            {slippageFactors.map((factor, index) => (
              <li key={factor.title} className="rounded-[1.5rem] bg-charcoal-2 p-7 md:p-8">
                <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[0.875rem] font-extrabold text-white">
                  {index + 1}
                </span>
                <h3 className="t-h3 mt-8 text-white">{factor.title}</h3>
                <p className="mt-3 max-w-[46ch] text-[0.9375rem] font-medium leading-relaxed text-white/64">{factor.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ── FAQ ── */}
      <section className="container section pt-0 md:pt-0">
        <Reveal>
          <SectionIntro
            badge="FAQ"
            title={
              <>
                Common <span className="text-accentB">questions</span>.
              </>
            }
          />
        </Reveal>
        <FaqList className="mx-auto mt-12 max-w-3xl md:mt-16" items={processFaqs} />
        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.9375rem] font-medium text-fg/64">
          Want to see the output?
          <ArrowLink href="/works">Browse the work</ArrowLink>
        </p>
      </section>

      <CtaBlock />
    </>
  );
}
