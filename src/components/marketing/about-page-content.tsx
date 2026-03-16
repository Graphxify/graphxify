"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Blocks,
  Brush,
  Cable,
  Clock,
  Code2,
  Compass,
  Database,
  Eye,
  Feather,
  FolderTree,
  Globe,
  LayoutGrid,
  Lightbulb,
  MessageSquare,
  Milestone,
  Puzzle,
  Search,
  Send,
  Sparkles,
  Terminal,
  Workflow,
  type LucideIcon
} from "lucide-react";
import aboutGraphxifyVisual from "../../../public/images/about/about-graphxify-visual.png";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { Button } from "@/components/ui/button";
import { getProjectDisplayTitle, getProjectPathSlug } from "@/lib/project-card-content";
import { cn } from "@/lib/utils";

/* ── Types ── */
type AboutWorkPreview = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

type AboutTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating?: number;
};

/* ── Data — every icon is unique across ALL sections ── */
const snapshotItems = [
  { label: "Focus", value: "Brand · Websites · CMS", icon: Eye },
  { label: "Delivery", value: "Design + Dev aligned", icon: Workflow },
  { label: "Response", value: "within 48 hours", icon: Clock }
] as const;

const approachSteps = [
  { num: "01", title: "Discover", body: "Research your goals, audience, and competitive landscape to build a clear strategic foundation.", icon: Search },
  { num: "02", title: "Structure", body: "Map content architecture, define systems, and establish the information hierarchy.", icon: FolderTree },
  { num: "03", title: "Design", body: "Craft a visual identity and interface system that communicates with clarity and purpose.", icon: Brush },
  { num: "04", title: "Build & Ship", body: "Develop, test, and deploy a performant product ready for real-world scale.", icon: Send }
] as const;

const capabilities: { title: string; body: string; href: string; icon: LucideIcon }[] = [
  { title: "Brand Systems", body: "Positioning, visual language, and usage standards that keep your brand consistent as content scales.", href: "/services#service-brand-systems", icon: Compass },
  { title: "Web Design", body: "Clear, conversion-focused interfaces built with responsive behavior and reusable design patterns.", href: "/services#service-web-design", icon: LayoutGrid },
  { title: "Web Development", body: "Performant, maintainable websites with clean architecture, accessibility, and production quality.", href: "/services#service-web-development", icon: Terminal },
  { title: "CMS Architecture", body: "Content models and editor workflows so your team can publish confidently without breaking consistency.", href: "/services#service-cms-architecture", icon: Database }
];

const differentiators = [
  { text: "System-driven identity + web design", icon: Puzzle },
  { text: "Clean, maintainable development", icon: Code2 },
  { text: "Structured CMS architecture", icon: Blocks },
  { text: "Consistent components and documentation", icon: Cable },
  { text: "Clear process and predictable delivery", icon: Milestone },
  { text: "Transparent communication, kickoff to launch", icon: MessageSquare }
] as const;

const principles = [
  { title: "Systems First", body: "Every decision is made through the lens of scalable, reusable systems, not isolated one-off deliverables.", icon: Globe },
  { title: "Quality as Standard", body: "Accessibility, performance, and clean code aren't extras. They're the baseline of every project.", icon: Sparkles },
  { title: "Transparent Process", body: "Clear timelines, predictable delivery, and open communication from the first call to final launch.", icon: Lightbulb }
];

/* ── Hero Visual — clean, no overlays ── */
function HeroVisualPanel(): JSX.Element {
  return (
    <div className="section-shell relative h-full min-h-[16rem] overflow-hidden border-border/18 bg-card/74 p-2.5 md:p-3">
      <div className="relative h-full min-h-[15rem] overflow-hidden rounded-[1.1rem] border border-border/16">
        <Image
          src={aboutGraphxifyVisual}
          alt="Graphxify brand and web system preview"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 46vw"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/34 via-black/6 to-transparent" />
      </div>
    </div>
  );
}

/* ── Main Component ── */
export function AboutPageContent({
  works,
  testimonials = []
}: {
  works: AboutWorkPreview[];
  testimonials?: AboutTestimonial[];
}): JSX.Element {
  const reducedMotion = useReducedMotion();
  const previewWorks = works.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
      {/* ── Hero ── */}
      <SectionReveal className="container" effect="up">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
              <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
              About Graphxify
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.96] tracking-tight">
              Built on <span className="gradient-text">Structure</span>.<br className="hidden md:block" /> Designed to Scale.
            </h1>
            <span className="mt-4 block h-px w-24 bg-accent-gradient" />
            <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.04rem]">
              Graphxify is a design and development studio focused on structured brand and web systems. We align identity, interface, and
              architecture into one cohesive platform, built for clarity, consistency, and long-term growth.
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

      {/* ── Snapshot Strip ── */}
      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {snapshotItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.label}
                initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, delay: 0.08 * index, ease: [0.23, 1, 0.32, 1] }}
                className="group flex items-center gap-4 rounded-xl border border-border/16 bg-card/72 px-5 py-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accentA/25 hover:shadow-[0_8px_24px_rgba(0,82,204,0.06)]"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accentA/25 bg-accentA/10 text-accentA transition-colors group-hover:bg-accentA/18">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-fg/50">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-fg/82">{item.value}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </SectionReveal>

      {/* ── Our Approach — timeline layout ── */}
      <SectionReveal className="container mt-14 md:mt-16" effect="up">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-accentA">How We Work</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Our Approach</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-fg/60">A proven four-stage process that turns ideas into structured, scalable digital products.</p>
        </div>
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="pointer-events-none absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-accentA/40 via-accentA/20 to-transparent md:left-1/2 md:-translate-x-px" />
          <div className="space-y-6 md:space-y-8">
            {approachSteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.num}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: 0.1 * index, ease: [0.23, 1, 0.32, 1] }}
                  className={cn("relative flex items-start gap-5 md:gap-0", isEven ? "md:flex-row" : "md:flex-row-reverse")}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accentA/30 bg-bg shadow-[0_8px_24px_rgba(0,82,204,0.08)]">
                      <Icon className="h-5 w-5 text-accentA" />
                    </span>
                  </div>
                  {/* Content card */}
                  <div className={`group flex-1 rounded-xl border border-border/16 bg-card/72 p-5 transition-all duration-200 hover:border-accentA/25 hover:shadow-[0_12px_32px_rgba(0,82,204,0.06)] ${isEven ? "md:mr-[calc(50%+2rem)] md:text-right" : "md:ml-[calc(50%+2rem)]"}`}>
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-accentA">{step.num}</span>
                    <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg/62">{step.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      {/* ── What We Do ── */}
      <SectionReveal className="container mt-14 md:mt-16" effect="up">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accentA">Capabilities</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">What We Do</h2>
          </div>
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fg/72 transition-colors hover:text-accentA">
            All Services
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: 0.1 * index, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link
                  href={item.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/16 bg-card/72 p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accentA/30 hover:shadow-[0_16px_40px_rgba(0,82,204,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accentA/[0.04] blur-xl" />
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accentA/25 bg-accentA/8 text-accentA transition-colors group-hover:bg-accentA/16 group-hover:shadow-[0_4px_16px_rgba(0,82,204,0.15)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="mt-1 h-4 w-4 text-fg/25 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accentA" />
                  </div>
                  <h3 className="mt-3 text-[1.12rem] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg/60">{item.body}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </SectionReveal>

      {/* ── Why Graphxify ── */}
      <SectionReveal className="container mt-14 md:mt-16" effect="up">
        <div className="section-shell overflow-hidden border-border/18 bg-card/74 p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accentA">The Difference</p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Why Graphxify</h2>
            </div>
            <Feather className="mt-1 h-5 w-5 text-fg/20" />
          </div>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.text}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: 0.07 * index, ease: [0.23, 1, 0.32, 1] }}
                  className="group flex items-center gap-3 rounded-lg border border-border/14 bg-bg/44 px-3.5 py-3 transition-[border-color,background-color,box-shadow] duration-200 hover:border-accentA/25 hover:bg-accentA/[0.03] hover:shadow-[0_4px_16px_rgba(0,82,204,0.04)]"
                >
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accentA/20 bg-accentA/8 text-accentA transition-colors group-hover:bg-accentA/16">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-fg/72">{item.text}</span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </SectionReveal>

      {/* ── Behind the Studio ── */}
      <SectionReveal className="container mt-14 md:mt-16" effect="up">
        <div className="section-shell overflow-hidden border-border/18 bg-card/74 p-5 md:p-7">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <div className="relative mx-auto md:mx-0">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border border-border/18 bg-gradient-to-br from-accentA/12 via-card/60 to-accentB/12 md:h-28 md:w-28">
                <div className="grid h-full w-full place-items-center">
                  <span className="text-3xl font-bold text-accentA">G</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-accentA/40 bg-bg/90 shadow-lg">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            </div>
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-fg/50">Behind the Studio</p>
              <h2 className="mt-1 text-xl font-semibold md:text-2xl">Built by a designer who <span className="gradient-text">codes</span>.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg/62">
                Graphxify was founded on the belief that brand, design, and development should operate as one unified system, not three
                disconnected services. Every project is approached with a builder&apos;s mindset: structured, intentional, and engineered
                for long-term growth. No handoff friction, no misalignment. Just cohesive systems from concept to launch.
              </p>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ── Testimonials — single-row marquee ── */}
      {featuredTestimonials.length > 0 && (
        <SectionReveal className="container mt-14 md:mt-16" effect="up">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-accentA">Testimonials</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Trusted by <span className="gradient-text">Clients</span></h2>
          </div>
          <TestimonialsSection items={featuredTestimonials} singleRow />
        </SectionReveal>
      )}

      {/* ── Our Principles ── */}
      <SectionReveal className="container mt-14 md:mt-16" effect="up">
        <div className="section-shell overflow-hidden border-border/18 bg-card/74 p-5 md:p-7">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-accentA">Core Values</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Our Principles</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-fg/58">The core beliefs that drive how we design, develop, and deliver.</p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {principles.map((p, index) => {
              const Icon = p.icon;
              return (
                <motion.article
                  key={p.title}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: 0.1 * index, ease: [0.23, 1, 0.32, 1] }}
                  className="group relative overflow-hidden rounded-xl border border-border/16 bg-bg/44 p-5 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accentA/25 hover:shadow-[0_12px_32px_rgba(0,82,204,0.05)]"
                >
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-accentA/[0.03] blur-2xl" />
                  <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-accentA/25 bg-accentA/8 text-accentA transition-colors group-hover:bg-accentA/16">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg/58">{p.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      {/* ── CTA ── */}
      <SectionReveal className="container mt-14 md:mt-16" effect="zoom">
        <SiteCtaSection />
      </SectionReveal>

      {/* ── Selected Work ── */}
      <SectionReveal className="container mt-14 md:mt-16" effect="up">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accentA">Portfolio</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Selected Work</h2>
          </div>
          <Link href="/works" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fg/72 transition-colors hover:text-accentA">
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
                  href={`/works/${getProjectPathSlug(work.slug)}`}
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
                        className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.025] group-hover:brightness-[0.55]"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/12 transition-colors duration-200 group-hover:bg-black/38" />
                    <div className="absolute inset-x-4 bottom-4 z-10 transition-[opacity,transform] duration-200 group-hover:translate-y-2 group-hover:opacity-0">
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
    </div>
  );
}

