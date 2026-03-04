"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Code2,
  Compass,
  Database,
  Palette,
  X,
  type LucideIcon
} from "lucide-react";
import { useMemo } from "react";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { Button } from "@/components/ui/button";
import { getProjectDisplayTitle } from "@/lib/project-card-content";

type ServiceWorkPreview = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

type ServicePillar = {
  key: string;
  sectionId: string;
  title: string;
  description: string;
  icon: LucideIcon;
  body: string;
  deliverables: string[];
};

const servicesData: ServicePillar[] = [
  {
    key: "brand-systems",
    sectionId: "service-brand-systems",
    title: "Brand Systems",
    description: "Positioning, identity, and scalable brand foundations.",
    icon: Compass,
    body: "Structured brand identity systems designed to stay consistent across every touchpoint.",
    deliverables: ["Logo system", "Typography hierarchy", "Color + usage rules", "Brand guidelines", "Asset library", "Social templates"]
  },
  {
    key: "web-design",
    sectionId: "service-web-design",
    title: "Web Design",
    description: "Structured interfaces with clarity and hierarchy.",
    icon: Palette,
    body: "Modern website interfaces built with clear structure and clean visual rhythm.",
    deliverables: ["UX structure", "UI components", "Responsive layouts", "Interaction patterns", "Design system", "Page templates"]
  },
  {
    key: "web-development",
    sectionId: "service-web-development",
    title: "Web Development",
    description: "Scalable builds engineered for performance.",
    icon: Code2,
    body: "Custom-coded websites built for maintainability and long-term growth.",
    deliverables: ["Frontend build", "Component architecture", "Performance best practices", "Accessibility implementation", "Integrations", "Deployment setup"]
  },
  {
    key: "cms-architecture",
    sectionId: "service-cms-architecture",
    title: "CMS Architecture",
    description: "Structured content systems built for scale.",
    icon: Database,
    body: "Content systems your team can edit confidently without breaking the design.",
    deliverables: ["Content modeling", "CMS setup", "Roles & permissions", "Collections structure", "Editing workflows", "Governance rules"]
  }
];

const processSteps = [
  { id: "01", title: "Discover", body: "align goals + scope" },
  { id: "02", title: "Define", body: "structure the system" },
  { id: "03", title: "Design", body: "craft the interface" },
  { id: "04", title: "Develop", body: "build and ship" }
] as const;

const graphxifyComparisonItems = [
  "Structured brand systems",
  "Scalable website architecture",
  "Clean CMS structure",
  "Fast modern performance",
  "Built for long-term growth"
] as const;

const typicalAgencyItems = [
  "One-off designs",
  "Hard-to-manage websites",
  "Rigid page builders",
  "Slow heavy builds",
  "Frequent redesigns required"
] as const;

function ServiceVisual({ serviceKey }: { serviceKey: ServicePillar["key"] }): JSX.Element {
  if (serviceKey === "brand-systems") {
    return (
      <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
        <span className="absolute left-4 top-0 h-px w-20 bg-accent-gradient" />
        <div className="grid h-full gap-3 sm:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-border/18 bg-bg/55 p-3">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Identity</p>
            <div className="mt-3 grid gap-2">
              <span className="h-7 rounded-md bg-accent-gradient opacity-85" />
              <span className="h-2 rounded-full bg-fg/14" />
              <span className="h-2 rounded-full bg-fg/10" />
            </div>
          </div>
          <div className="rounded-xl border border-border/18 bg-bg/48 p-3">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Guidelines</p>
            <div className="mt-3 space-y-2">
              <span className="block h-2 rounded-full bg-fg/16" />
              <span className="block h-2 rounded-full bg-fg/12" />
              <span className="block h-2 rounded-full bg-fg/10" />
              <span className="block h-2 rounded-full bg-fg/8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (serviceKey === "web-design") {
    return (
      <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-accentA/75" />
        <div className="rounded-xl border border-border/18 bg-bg/52 p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-fg/35" />
            <span className="h-2 w-2 rounded-full bg-fg/22" />
            <span className="h-2 w-2 rounded-full bg-fg/12" />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
            <div className="rounded-lg border border-border/16 bg-card/65 p-2.5">
              <span className="mb-2 block h-2.5 w-1/2 rounded-full bg-fg/20" />
              <span className="block h-20 rounded-md bg-fg/10" />
            </div>
            <div className="rounded-lg border border-border/16 bg-card/65 p-2.5">
              <span className="mb-2 block h-2.5 w-2/3 rounded-full bg-fg/20" />
              <div className="grid gap-2">
                <span className="h-7 rounded-md bg-fg/10" />
                <span className="h-7 rounded-md bg-fg/10" />
                <span className="h-7 rounded-md bg-fg/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (serviceKey === "web-development") {
    return (
      <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
        <span className="absolute inset-y-4 right-4 w-px bg-accent-gradient opacity-75" />
        <div className="grid h-full gap-3">
          <div className="rounded-xl border border-border/18 bg-bg/52 p-3">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Component Graph</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <span key={`dev-node-${index}`} className="h-6 rounded-md border border-border/14 bg-fg/[0.07]" />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border/18 bg-bg/45 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Performance</span>
              <span className="text-[0.58rem] uppercase tracking-[0.16em] text-accentA">95+</span>
            </div>
            <span className="mt-3 block h-2 rounded-full bg-fg/10">
              <span className="block h-full w-[78%] rounded-full bg-accent-gradient" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
      <span className="absolute -right-8 -top-10 h-24 w-24 rounded-full border border-accentA/35" />
      <div className="grid h-full gap-3 sm:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-xl border border-border/18 bg-bg/52 p-3">
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Collections</p>
          <div className="mt-3 space-y-2">
            <span className="flex items-center justify-between rounded-md border border-border/14 bg-fg/[0.07] px-2 py-1.5 text-[0.62rem] text-fg/65">
              Pages <i className="h-1.5 w-1.5 rounded-full bg-accentA/75" />
            </span>
            <span className="flex items-center justify-between rounded-md border border-border/14 bg-fg/[0.07] px-2 py-1.5 text-[0.62rem] text-fg/65">
              Case Studies <i className="h-1.5 w-1.5 rounded-full bg-fg/45" />
            </span>
            <span className="flex items-center justify-between rounded-md border border-border/14 bg-fg/[0.07] px-2 py-1.5 text-[0.62rem] text-fg/65">
              Blog <i className="h-1.5 w-1.5 rounded-full bg-fg/45" />
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border/18 bg-bg/45 p-3">
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Access</p>
          <div className="mt-3 grid gap-2">
            <span className="h-7 rounded-md bg-fg/[0.09]" />
            <span className="h-7 rounded-md bg-fg/[0.09]" />
            <span className="h-7 rounded-md bg-accent-gradient/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesPageContent({ works }: { works: ServiceWorkPreview[] }): JSX.Element {
  const reducedMotion = useReducedMotion();
  const previewWorks = useMemo(() => works.slice(0, 3), [works]);

  function scrollToService(sectionId: string): void {
    const node = document.getElementById(sectionId);
    if (!node) {
      return;
    }
    node.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
      <SectionReveal className="container" effect="up">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
            <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
            Services
          </p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">Brand Systems. Websites. Built to Scale.</h1>
          <span className="mt-4 block h-px w-24 bg-accent-gradient" />
          <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">
            Graphxify builds structured brand identity and modern websites - designed and developed as one cohesive system.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="px-6">
              <Link href="/contact">Start a Project</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="px-6">
              <Link href="/works">View Work</Link>
            </Button>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-11 md:mt-14" effect="up">
        <div className="grid gap-4 md:grid-cols-2">
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={`service-pillars-${service.key}`}
                type="button"
                onClick={() => scrollToService(service.sectionId)}
                className="group rounded-[1.2rem] border border-border/18 bg-card/72 p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg hover:-translate-y-0.5 hover:border-border/34"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-[1.2rem] font-semibold leading-tight md:text-[1.38rem]">{service.title}</h2>
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accentA" />
                </div>
                <p className="mt-3 max-w-[42ch] text-sm text-fg/64">{service.description}</p>
              </button>
            );
          })}
        </div>
      </SectionReveal>

      <div className="container mt-8 space-y-5 md:mt-10 md:space-y-6">
        {servicesData.map((service, index) => (
          <SectionReveal key={`service-deep-dive-${service.key}`} effect={index % 2 === 0 ? "left" : "right"}>
            <article id={service.sectionId} className="section-shell scroll-mt-28 border-border/18 bg-card/74 p-5 md:p-7 lg:p-9">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:gap-9">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
                    <p className="text-xs uppercase tracking-[0.18em] text-fg/58">{service.title}</p>
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{service.title}</h3>
                  <span className="mt-3 block h-px w-20 bg-accent-gradient" />
                  <p className="mt-4 max-w-2xl text-fg/68 md:text-[1.02rem]">{service.body}</p>

                  <div className="mt-6">
                    <div className="flex items-center gap-2">
                      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-fg/58">Deliverables</p>
                      {index === 2 ? <span className="h-px w-10 bg-accent-gradient" /> : null}
                    </div>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {service.deliverables.map((item) => (
                        <li key={`${service.key}-${item}`} className="rounded-lg border border-border/16 bg-bg/45 px-3 py-2 text-sm text-fg/72">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  {index === 3 ? <span className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 rounded-full border border-accentA/55" /> : null}
                  <ServiceVisual serviceKey={service.key} />
                </div>
              </div>
            </article>
          </SectionReveal>
        ))}
      </div>

      <SectionReveal className="container mt-8 md:mt-10" effect="up">
        <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
          <h2 className="text-2xl font-semibold md:text-3xl">How We Build</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.article
                key={`services-process-${step.id}`}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: 0.04 * index, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-border/16 bg-bg/44 px-4 py-4"
              >
                <p className="text-[0.64rem] uppercase tracking-[0.16em] text-accentA">{step.id}</p>
                <p className="mt-2 text-lg font-medium">{step.title}</p>
                <p className="mt-1 text-sm text-fg/62">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-14" effect="up">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">Built Differently</h2>
          <p className="mt-3 text-fg/66">A more structured way to design brands and build modern websites.</p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="group relative rounded-[1.2rem] border border-border/16 bg-card/60 p-5 md:p-6">
            <h3 className="text-xl font-semibold">Graphxify</h3>
            <ul className="mt-4">
              {graphxifyComparisonItems.map((item) => (
                <li
                  key={`graphxify-compare-${item}`}
                  className="flex items-center gap-3 border-b border-border/14 py-3.5 last:border-b-0 last:pb-0 first:pt-0"
                >
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accentA/35 bg-accentA/12 text-accentA">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-fg/86">{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.2rem] border border-border/16 bg-card/60 p-5 md:p-6">
            <h3 className="text-xl font-semibold text-fg/84">Typical Agency</h3>
            <ul className="mt-4">
              {typicalAgencyItems.map((item) => (
                <li
                  key={`typical-compare-${item}`}
                  className="flex items-center gap-3 border-b border-border/12 py-3.5 last:border-b-0 last:pb-0 first:pt-0"
                >
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/26 bg-bg/40 text-fg/50">
                    <X className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-fg/64">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-14" effect="up">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold md:text-3xl">Selected Work</h2>
          <Link href="/works" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fg/72 hover:text-fg">
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {previewWorks.map((work) => {
            const displayTitle = getProjectDisplayTitle(work.slug, work.title);
            return (
            <Link
              key={work.id}
              href={`/works/${work.slug}`}
              className="group block overflow-hidden rounded-[1.1rem] border border-border/18 bg-card/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              data-cursor-label="Open"
              aria-label={`Open project ${displayTitle}`}
            >
              <div className="relative h-[14.5rem] overflow-hidden">
                <Image
                  src={work.coverImage}
                  alt={displayTitle}
                  fill
                  className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:blur-[1.2px] group-hover:brightness-[0.66]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/56 via-black/12 to-transparent" />
              </div>
              <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                <p className="line-clamp-2 text-sm text-fg/88">{displayTitle}</p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-fg/52 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
            );
          })}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-14" effect="zoom">
        <div className="section-shell border-border/18 bg-card/76 p-6 text-center md:p-9">
          <h2 className="text-2xl font-semibold md:text-3xl">Let&apos;s Build Something Structured.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-fg/66">Clarity first. Scalable systems next. A launch-ready foundation from day one.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Start a Project</Link>
            </Button>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
