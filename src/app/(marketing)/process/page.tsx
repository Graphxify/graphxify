export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers2, MessageSquare, PenTool, Rocket, ScanSearch } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { ServiceFaq, type ServiceFaqItem } from "@/components/marketing/service-faq";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Our Process — How a Project Actually Runs",
  description:
    "The four stages of a Graphxify project: Discover, Structure, Design, Build & Ship. What happens at each stage, what you receive, what we need from you, and how long it takes.",
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
 * the detail — deliverables, client input, and duration per stage.
 */
const stages: Array<{
  num: string;
  title: string;
  icon: LucideIcon;
  duration: string;
  summary: string;
  weDo: readonly string[];
  youGet: readonly string[];
  weNeed: string;
}> = [
  {
    num: "01",
    title: "Discover",
    icon: ScanSearch,
    duration: "3 to 5 days",
    summary:
      "Before anything gets designed we need to understand what the business actually needs the site to do. Not a workshop for its own sake — a short, focused stage that prevents expensive changes later.",
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
    icon: Layers2,
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
    weNeed: "Feedback on the wireframes, and a decision on who is writing the copy — you, us, or both."
  },
  {
    num: "03",
    title: "Design",
    icon: PenTool,
    duration: "1 to 3 weeks",
    summary:
      "Now it looks like something. You see high-fidelity designs and click through a real prototype before a line of production code is written — nothing gets built that you have not approved.",
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
    icon: Rocket,
    duration: "2 to 4 weeks",
    summary:
      "Custom Next.js development, tested across real devices, then deployed to your own hosting account with the CMS configured and your team trained on it.",
    weDo: [
      "Build the approved designs in Next.js",
      "Configure the CMS, roles, and workflows",
      "Test performance, accessibility, and cross-device behaviour",
      "Migrate content and set up redirects to protect rankings"
    ],
    youGet: [
      "A live site on hosting you own",
      "The full codebase, yours outright",
      "Editor training guide and handover session"
    ],
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

const processFaqs: ServiceFaqItem[] = [
  {
    q: "How long does a whole project take?",
    a: "Four to eight weeks end to end for most projects, depending on tier. A Brand Identity alone is two to three weeks; a full brand and website is six to eight. The stage durations above add up to a realistic range, not a best case."
  },
  {
    q: "How much of my time will this take?",
    a: "Less than most people expect — roughly one conversation per stage plus consolidated feedback at each review, so a few hours in total. The exception is content: if you are writing the copy, budget properly for that."
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
];

function processJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How a Graphxify project runs",
    description: "The four stages of a brand and website project: Discover, Structure, Design, Build & Ship.",
    url: `${siteConfig.url}/process`,
    step: stages.map((stage, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: stage.title,
      text: stage.summary,
      url: `${siteConfig.url}/process#stage-${stage.num}`
    }))
  };
}

export default function ProcessPage() {
  const breadcrumbs = breadcrumbListJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Process", url: `${siteConfig.url}/process` }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs as Record<string, unknown>} />
      <JsonLd data={processJsonLd() as Record<string, unknown>} />

      <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
        {/* Hero */}
        <SectionReveal className="container" effect="up">
          <div className="mx-auto max-w-4xl">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
              Process
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">
              How a project actually runs.
            </h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">
              Four stages, in sequence, each ending in something you can look at and approve. Below is what happens at
              every stage, what you receive, what we need from you, and roughly how long it takes. Including the parts
              that go wrong.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <span>Start a Project</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="px-6">
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
        </SectionReveal>

        {/* Stages */}
        <SectionReveal className="container mt-14 md:mt-16 lg:mt-20" effect="up">
          <div className="grid gap-4">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <article
                  key={stage.num}
                  id={`stage-${stage.num}`}
                  className="section-shell scroll-mt-24 border-border/18 bg-card/74 p-6 md:p-9"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-accentA/30 bg-bg">
                      <Icon className="h-5 w-5 text-accentA" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-accentA">
                        Stage {stage.num}
                      </span>
                      <h2 className="text-xl font-semibold md:text-2xl">{stage.title}</h2>
                    </div>
                    <span className="ml-auto rounded-full border border-border/20 bg-bg/55 px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-fg/56">
                      {stage.duration}
                    </span>
                  </div>

                  <p className="mt-5 max-w-3xl text-sm leading-[1.75] text-fg/68">{stage.summary}</p>

                  <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr]">
                    <div>
                      <p className="mb-3 text-[0.62rem] uppercase tracking-[0.18em] text-fg/48">What we do</p>
                      <ul className="grid gap-2">
                        {stage.weDo.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-fg/70">
                            <span
                              className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accentA/45"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-3 text-[0.62rem] uppercase tracking-[0.18em] text-fg/48">What you get</p>
                      <ul className="grid gap-2">
                        {stage.youGet.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-fg/70">
                            <span
                              className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accentA/45"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-accentA/14 bg-accentA/[0.045] px-5 py-4">
                      <p className="mb-2 inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-accentA">
                        <MessageSquare className="h-3 w-3" aria-hidden="true" />
                        From you
                      </p>
                      <p className="text-xs leading-relaxed text-fg/62">{stage.weNeed}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionReveal>

        {/* What makes projects slip */}
        <SectionReveal className="container mt-12 md:mt-16" effect="up">
          <article className="section-shell border-border/18 bg-card/74 p-7 md:p-10 lg:p-14">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/52">Honestly</p>
            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">What makes projects run late</h2>
            <span className="mt-3 block h-px w-20 bg-accent-gradient" />
            <p className="mt-6 max-w-2xl text-[1.01rem] leading-[1.78] text-fg/68">
              Timelines slip for a small number of predictable reasons, and almost all of them are avoidable if both
              sides know about them at the start. So here they are.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {slippageFactors.map((factor) => (
                <div key={factor.title} className="rounded-xl border border-border/16 bg-bg/45 px-5 py-4">
                  <h3 className="text-sm font-semibold text-fg/86">{factor.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-fg/58">{factor.body}</p>
                </div>
              ))}
            </div>
          </article>
        </SectionReveal>

        {/* FAQ */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <ServiceFaq items={processFaqs} />
        </SectionReveal>

        {/* Cross-links */}
        <SectionReveal className="container mt-10 md:mt-14" effect="up">
          <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
            <p className="text-sm text-fg/60">
              Want the numbers?{" "}
              <Link href="/pricing" className="link-sweep text-accentA hover:text-accentA/80">
                See pricing
              </Link>
              . Want to see the output?{" "}
              <Link href="/works" className="link-sweep text-accentA hover:text-accentA/80">
                Browse the work
              </Link>
              <span className="inline-flex items-center">
                <ArrowUpRight className="ml-1 h-3.5 w-3.5 text-fg/38" aria-hidden="true" />
              </span>
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
