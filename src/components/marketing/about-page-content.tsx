"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Code2, Compass, Database, Palette, type LucideIcon } from "lucide-react";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { Button } from "@/components/ui/button";
import { getProjectDisplayTitle } from "@/lib/project-card-content";

type SnapshotItem = {
  label: string;
  value: string;
};

type ApproachStep = {
  id: string;
  title: string;
  body: string;
};

type CapabilityItem = {
  title: string;
  body: string;
  href: string;
  icon: LucideIcon;
};

type AboutWorkPreview = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

const snapshotItems: SnapshotItem[] = [
  { label: "Focus", value: "Brand Systems + Websites + CMS" },
  { label: "Delivery", value: "Design + Development aligned" },
  { label: "Response", value: "24-48 hours" }
];

const approachSteps: ApproachStep[] = [
  { id: "01", title: "Discover", body: "clarify goals + scope" },
  { id: "02", title: "Structure", body: "define systems + content" },
  { id: "03", title: "Design", body: "craft interface + identity" },
  { id: "04", title: "Build", body: "develop + launch" }
];

const capabilities: CapabilityItem[] = [
  {
    title: "Brand Systems",
    body: "We define positioning, visual language, and usage standards so your brand stays consistent across every channel as content scales.",
    href: "/services#service-brand-systems",
    icon: Compass
  },
  {
    title: "Web Design",
    body: "We design clear, conversion-focused interfaces with structured hierarchy, responsive behavior, and reusable design patterns.",
    href: "/services#service-web-design",
    icon: Palette
  },
  {
    title: "Web Development",
    body: "We build performant, maintainable websites with clean component architecture, accessibility best practices, and production-ready quality.",
    href: "/services#service-web-development",
    icon: Code2
  },
  {
    title: "CMS Architecture",
    body: "We architect content models, editor workflows, and permissions so your team can publish confidently without breaking consistency.",
    href: "/services#service-cms-architecture",
    icon: Database
  }
];

const differentiators = [
  "System-driven identity + web design",
  "Clean, maintainable development",
  "Structured CMS architecture",
  "Consistent components and documentation",
  "Clear process and predictable delivery",
  "Transparent communication from kickoff to launch"
] as const;

function HeroVisualPanel(): JSX.Element {
  return (
    <div className="section-shell relative h-full min-h-[16rem] overflow-hidden border-border/18 bg-card/74 p-2.5 md:p-3">
      <div className="relative h-full min-h-[15rem] overflow-hidden rounded-[1.1rem] border border-border/16">
        <Image
          src="/assets/work-2.svg"
          alt="Graphxify brand and web system preview"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 46vw"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/34 via-black/6 to-transparent" />
      </div>
    </div>
  );
}

export function AboutPageContent({ works }: { works: AboutWorkPreview[] }): JSX.Element {
  const reducedMotion = useReducedMotion();
  const previewWorks = works.slice(0, 3);

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
      <SectionReveal className="container" effect="up">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
              About Graphxify
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.96] tracking-tight">
              Built on Structure. Designed to Scale.
            </h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.04rem]">
              Graphxify is a design and development studio focused on structured brand and web systems. We align identity, interface, and
              architecture into one cohesive platform - built for clarity, consistency, and long-term growth.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="px-6 hover:border-accentA/45 hover:bg-accent-gradient hover:text-ivory">
                <Link href="/works">View Work</Link>
              </Button>
            </div>
          </div>
          <HeroVisualPanel />
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {snapshotItems.map((item) => (
            <article key={`about-snapshot-${item.label}`} className="rounded-xl border border-border/16 bg-card/72 px-4 py-4">
              <p className="text-[0.66rem] uppercase tracking-[0.16em] text-fg/56">{item.label}</p>
              <p className="mt-1.5 text-sm text-fg/82">{item.value}</p>
            </article>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
          <h2 className="text-2xl font-semibold md:text-3xl">Our Approach</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {approachSteps.map((step, index) => (
              <motion.article
                key={`about-approach-${step.id}`}
                initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.42, delay: 0.05 * index, ease: [0.16, 1, 0.3, 1] }}
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

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold md:text-3xl">What We Do</h2>
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fg/72 hover:text-fg">
            Services
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={`about-capability-${item.title}`}
                href={item.href}
                className="group rounded-xl border border-border/16 bg-card/72 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/34 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[1.18rem] font-semibold">{item.title}</h3>
                  <Icon className="mt-0.5 h-4 w-4 text-accentA" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-fg/64">{item.body}</p>
              </Link>
            );
          })}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
          <h2 className="text-2xl font-semibold md:text-3xl">Why Graphxify</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {differentiators.map((item) => (
              <li key={`about-why-${item}`} className="inline-flex items-center gap-2 rounded-lg border border-border/14 bg-bg/44 px-3 py-2 text-sm text-fg/74">
                <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
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
              <div key={work.id}>
                <Link
                  href={`/works/${work.slug}`}
                  className="group block rounded-[1.05rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  data-cursor-label="Open"
                  aria-label={`Open project ${displayTitle}`}
                >
                  <article className="relative h-[20rem] overflow-hidden rounded-[1.05rem] border border-border/18 shadow-[0_14px_30px_rgba(13,13,15,0.08)] md:h-[22rem]">
                    <div className="absolute inset-0">
                      <Image
                        src={work.coverImage}
                        alt={displayTitle}
                        fill
                        className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:blur-[2px] group-hover:brightness-[0.55]"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    <div className="absolute inset-0 bg-black/12 transition-colors duration-500 group-hover:bg-black/38" />

                    <div className="absolute inset-x-4 bottom-4 z-10 transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0">
                      <h3 className="text-sm font-medium text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:text-base">{displayTitle}</h3>
                    </div>

                    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-5 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <h4 className="text-[1.6rem] font-semibold leading-tight text-ivory drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] md:text-[1.9rem]">
                        {displayTitle}
                      </h4>
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="zoom">
        <div className="section-shell border-border/18 bg-card/76 p-6 text-center md:p-8">
          <h2 className="text-2xl font-semibold md:text-3xl">Ready to build?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-fg/66">Start with clear goals, then we structure and ship.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="px-6">
              <Link href="/contact">Start a Project</Link>
            </Button>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
