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
  LayoutTemplate,
  Palette,
  Rocket,
  X,
  type LucideIcon
} from "lucide-react";
import { useMemo } from "react";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { SiteCtaSection } from "@/components/marketing/site-cta-section";
import { Button } from "@/components/ui/button";
import { getProjectDisplayTitle, getProjectPathSlug } from "@/lib/project-card-content";

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
  bestFor: string;
  typicalProject: string;
  businessOutcome: string;
  microProof?: string;
};

const servicesData: ServicePillar[] = [
  {
    key: "brand-systems",
    sectionId: "service-brand-systems",
    title: "Brand Systems",
    description: "Positioning, identity, and scalable brand foundations.",
    icon: Compass,
    body: "We build complete brand identity systems for Canadian businesses that need to look credible from day one. Logo suite, typography, colour palette, brand voice, and usage documentation are all delivered together so your brand stays consistent across your website, social, print, and pitch materials without needing a designer to make every decision.",
    deliverables: [
      "Logo suite (primary, secondary, icon)",
      "Typography system with font files",
      "Colour palette with hex, RGB, and CMYK",
      "Brand guidelines document (PDF)",
      "Social media templates",
      "Full asset export package"
    ],
    bestFor: "New businesses or companies that have outgrown a DIY logo",
    typicalProject: "Full brand identity from scratch in 2 to 3 weeks",
    businessOutcome: "Look credible and consistent everywhere your business appears",
    microProof: "Every brand system includes a guidelines document your team can use day-to-day. No designer required to stay on-brand."
  },
  {
    key: "web-design",
    sectionId: "service-web-design",
    title: "Web Design",
    description: "Structured interfaces with clarity and hierarchy.",
    icon: Palette,
    body: "We design website interfaces built to communicate clearly and convert visitors into leads. Every layout prioritises hierarchy so your main message, your differentiator, and your call to action are visible before the scroll. Designed mobile-first, responsive across all screen sizes, and built to meet AODA accessibility standards for Ontario businesses.",
    deliverables: [
      "UX wireframes for each key page",
      "High-fidelity desktop and mobile designs",
      "Interactive prototype for client review",
      "Component design system",
      "Responsive layout specifications",
      "Accessibility audit (WCAG 2.1 AA)"
    ],
    bestFor: "Businesses with a clear brand ready to build or redesign their website",
    typicalProject: "4 to 8 pages across a 2 to 4 week design phase",
    businessOutcome: "A website visitors understand and engage with from the first scroll",
    microProof: "All interfaces are designed to WCAG 2.1 AA standards, required for Ontario public-facing businesses under AODA."
  },
  {
    key: "web-development",
    sectionId: "service-web-development",
    title: "Web Development",
    description: "Scalable builds engineered for performance.",
    icon: Code2,
    body: "We build custom websites on Next.js, not WordPress templates, delivering Lighthouse performance scores above 90 out of the box. You own the code outright with no recurring plugin subscriptions, and the architecture is built to scale with your business over the next five years. Optimised for Google Core Web Vitals and Canadian accessibility requirements.",
    deliverables: [
      "Custom Next.js codebase (you own it outright)",
      "Lighthouse scores above 90 across all metrics",
      "Core Web Vitals optimisation",
      "Deployment to Vercel or your preferred host",
      "Integrations (CRM, forms, analytics)",
      "Post-launch handover and documentation"
    ],
    bestFor: "Companies ready to move off WordPress, page builders, or outdated custom sites",
    typicalProject: "4 to 8 week build depending on scope",
    businessOutcome: "A site that loads fast, ranks better, and doesn't need a developer for routine updates",
    microProof: "Built on Next.js 15 with server components, static generation, and edge caching. No plugin subscriptions. No recurring platform fees."
  },
  {
    key: "cms-architecture",
    sectionId: "service-cms-architecture",
    title: "CMS Architecture",
    description: "Structured content systems built for scale.",
    icon: Database,
    body: "We design content management systems where your team can publish pages, blog posts, and updates without designer involvement and without breaking the layout. Content models, user roles, and publishing workflows are defined before a line of code is written, so the CMS fits how your team actually works.",
    deliverables: [
      "Content model design and documentation",
      "CMS platform setup and configuration",
      "User roles and permissions structure",
      "Custom editing workflows",
      "Editor training guide",
      "Governance documentation"
    ],
    bestFor: "Teams who need to update their site regularly without developer help",
    typicalProject: "Delivered as part of a web development engagement or as a standalone CMS migration",
    businessOutcome: "Your team publishes confidently. Your site stays on-brand without constant developer involvement.",
    microProof: "Content models are designed before a line of code is written, so the CMS fits how your team works, not the other way around."
  }
];

const processSteps = [
  {
    phase: "Goal Mapping",
    title: "Discover",
    body: "align goals + scope",
    icon: Compass
  },
  {
    phase: "System Blueprint",
    title: "Define",
    body: "structure the system",
    icon: LayoutTemplate
  },
  {
    phase: "Interface Craft",
    title: "Design",
    body: "craft the interface",
    icon: Palette
  },
  {
    phase: "Launch Engineering",
    title: "Develop",
    body: "build and ship",
    icon: Rocket
  }
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
  const reducedMotion = useReducedMotion();

  if (serviceKey === "brand-systems") {
    return (
      <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
        <span className="absolute left-4 top-0 h-px w-20 bg-accent-gradient" />
        <div className="grid h-full gap-3 sm:grid-cols-[0.95fr_1.05fr]">
          {/* Left: Logo orbit system */}
          <div className="relative overflow-hidden rounded-xl border border-border/18 bg-bg/55 p-3">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Identity System</p>
                <motion.span className="text-[0.5rem] uppercase tracking-[0.14em] text-accentA" animate={reducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>Live</motion.span>
              </div>
              {/* Central logo orbit */}
              <div className="relative mx-auto mt-3 h-28 w-28">
                {/* Orbit rings */}
                <motion.span className="absolute inset-2 rounded-full border border-dashed border-accentA/20" animate={reducedMotion ? undefined : { rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                <motion.span className="absolute inset-0 rounded-full border border-dashed border-fg/10" animate={reducedMotion ? undefined : { rotate: [360, 0] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
                {/* Center mark */}
                <motion.div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-accentA/40 bg-bg/85 shadow-[0_0_20px_rgba(37,99,235,0.15)]" animate={reducedMotion ? undefined : { scale: [1, 1.06, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <span className="text-sm font-bold text-accentA">G</span>
                </motion.div>
                {/* Orbiting elements */}
                {[
                  { label: "Icon", angle: 0, delay: 0 },
                  { label: "Word", angle: 120, delay: 0.3 },
                  { label: "Stack", angle: 240, delay: 0.6 }
                ].map((item) => (
                  <motion.span key={item.label} className="absolute left-1/2 top-0 grid h-5 w-9 -translate-x-1/2 place-items-center rounded-md border border-border/20 bg-card/80 text-[0.4rem] uppercase tracking-[0.12em] text-fg/60" style={{ transformOrigin: "50% 56px" }} animate={reducedMotion ? undefined : { rotate: [item.angle, item.angle + 360] }} transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: item.delay }}>
                    <motion.span animate={reducedMotion ? undefined : { rotate: [-item.angle, -(item.angle + 360)] }} transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: item.delay }}>{item.label}</motion.span>
                  </motion.span>
                ))}
              </div>
              {/* Bottom status */}
              <div className="mt-2 flex items-center justify-center gap-2">
                <motion.span className="h-1.5 w-1.5 rounded-full bg-emerald-400" animate={reducedMotion ? undefined : { opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
                <span className="text-[0.46rem] uppercase tracking-[0.14em] text-fg/50">Brand Consistency: Active</span>
              </div>
            </div>
          </div>

          {/* Right: Guidelines panel */}
          <div className="rounded-xl border border-border/18 bg-bg/48 p-3">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Guidelines</p>
            <div className="relative mt-2 space-y-2">
              {/* Typography hierarchy */}
              {[
                { label: "Display", size: "text-[0.7rem]", weight: "font-bold", width: "90%" },
                { label: "Heading", size: "text-[0.58rem]", weight: "font-semibold", width: "75%" },
                { label: "Body", size: "text-[0.48rem]", weight: "font-normal", width: "60%" }
              ].map((type, index) => (
                <motion.div key={type.label} className="rounded-md border border-border/14 bg-bg/60 px-2 py-1.5" animate={reducedMotion ? undefined : { x: [0, 3, 0], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3 + index * 0.4, delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="flex items-center justify-between">
                    <span className={`${type.size} ${type.weight} text-fg/72`}>{type.label}</span>
                    <span className="text-[0.4rem] uppercase tracking-[0.12em] text-fg/40">AA</span>
                  </div>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-fg/10">
                    <motion.span className="block h-full origin-left rounded-full bg-accent-gradient" style={{ width: type.width }} animate={reducedMotion ? undefined : { scaleX: [0.85, 1] }} transition={{ duration: 2.5 + index * 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} />
                  </span>
                </motion.div>
              ))}
              {/* Color palette row */}
              <div className="flex items-center gap-1.5 pt-1">
                {["#6366F1", "#0EA5E9", "#10B981", "#F59E0B", "#0F172A"].map((color, index) => (
                  <motion.i key={`brand-chip-${color}`} aria-hidden="true" className="h-4 w-4 rounded-full border border-border/20 shadow-[0_2px_8px_rgba(0,0,0,0.15)]" style={{ backgroundColor: color }} animate={reducedMotion ? undefined : { y: [0, -2, 0] }} transition={{ duration: 2.8, delay: index * 0.18, repeat: Infinity, ease: "easeInOut" }} />
                ))}
                <span className="ml-1 text-[0.44rem] uppercase tracking-[0.12em] text-fg/45">Palette</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (serviceKey === "web-design") {
    return (
      <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,rgba(13,13,15,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,13,15,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative h-full overflow-hidden rounded-xl border border-border/18 bg-bg/56 p-3">
          <div className="flex items-center justify-between text-[0.5rem] uppercase tracking-[0.14em] text-fg/52">
            <span>Interface Design Studio</span>
            <motion.span className="rounded-full border border-accentA/30 bg-accentA/10 px-2 py-0.5 text-accentA" animate={reducedMotion ? undefined : { opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>Designing</motion.span>
          </div>
          <div className="relative mt-2 h-[calc(100%-2.5rem)]">
            {/* Desktop frame — main */}
            <motion.div className="absolute left-0 top-0 w-[68%] overflow-hidden rounded-lg border border-border/18 bg-card/72 p-2 shadow-[0_12px_28px_rgba(13,13,15,0.14)]" animate={reducedMotion ? undefined : { y: [0, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <div className="flex items-center gap-1 pb-1.5 border-b border-border/12">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
                <span className="ml-auto text-[0.38rem] text-fg/36">graphxify.com</span>
              </div>
              <motion.span className="mt-2 block h-5 rounded-md bg-accent-gradient/85" animate={reducedMotion ? undefined : { scaleX: [0.8, 1, 0.85], opacity: [0.75, 1, 0.75] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
              <div className="mt-1.5 grid grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.span key={`dt-${i}`} className="h-3.5 rounded bg-fg/10" animate={reducedMotion ? undefined : { opacity: [0.35, 0.8, 0.35] }} transition={{ duration: 2 + i * 0.3, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }} />
                ))}
              </div>
              <motion.span className="mt-1.5 block h-2 w-3/5 rounded bg-fg/8" animate={reducedMotion ? undefined : { scaleX: [0.9, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
            </motion.div>

            {/* Mobile frame */}
            <motion.div className="absolute right-0 top-2 w-[26%] overflow-hidden rounded-xl border border-accentA/30 bg-card/80 p-1.5 shadow-[0_16px_32px_rgba(13,13,15,0.18)]" animate={reducedMotion ? undefined : { y: [0, -6, 0], x: [0, -2, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
              <div className="mx-auto h-0.5 w-4 rounded-full bg-fg/20" />
              <motion.span className="mt-1.5 block h-4 rounded bg-accent-gradient/80" animate={reducedMotion ? undefined : { opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
              <div className="mt-1 space-y-0.5">
                <span className="block h-1.5 rounded-sm bg-fg/10" />
                <span className="block h-1.5 w-4/5 rounded-sm bg-fg/8" />
                <span className="block h-6 rounded bg-fg/7" />
              </div>
            </motion.div>

            {/* Design cursor */}
            <motion.div className="absolute z-10 flex items-center gap-1" animate={reducedMotion ? undefined : { x: [40, 120, 80, 40], y: [30, 60, 90, 30] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none"><path d="M1 1l10 6-5 2-2 6L1 1z" fill="rgba(37,99,235,0.9)" stroke="rgba(37,99,235,1)" strokeWidth="1" /></svg>
              <motion.span className="rounded-full bg-accentA/90 px-1.5 py-0.5 text-[0.36rem] font-medium text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]" animate={reducedMotion ? undefined : { opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>Design</motion.span>
            </motion.div>

            {/* SVG connection lines */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 320 160" preserveAspectRatio="none" aria-hidden="true">
              <motion.path d="M 140 50 C 180 30, 220 40, 250 55" fill="none" stroke="rgba(37,99,235,0.4)" strokeWidth="1" strokeDasharray="4 3" animate={reducedMotion ? undefined : { pathLength: [0, 1], opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            </svg>

            {/* Bottom responsive ruler */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 rounded-md border border-border/14 bg-bg/70 px-2 py-1">
              <span className="mr-auto text-[0.4rem] uppercase tracking-[0.12em] text-fg/44">Viewport</span>
              {["1440", "768", "375"].map((bp, i) => (
                <motion.span key={bp} className="rounded border border-border/18 px-1.5 py-0.5 text-[0.38rem] text-fg/50" animate={reducedMotion ? undefined : { borderColor: ["rgba(13,13,15,0.14)", "rgba(37,99,235,0.5)", "rgba(13,13,15,0.14)"], color: ["rgba(255,255,255,0.4)", "rgba(37,99,235,0.9)", "rgba(255,255,255,0.4)"] }} transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: "easeInOut" }}>{bp}</motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (serviceKey === "web-development") {
    return (
      <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(13,13,15,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,13,15,0.06)_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative h-full overflow-hidden rounded-xl border border-border/18 bg-bg/54 p-3">
          <div className="relative z-10 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.14em] text-fg/52">
            <span>Build Engine</span>
            <motion.span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-emerald-400" animate={reducedMotion ? undefined : { opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <motion.span className="h-1.5 w-1.5 rounded-full bg-emerald-400" animate={reducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />Deploying
            </motion.span>
          </div>
          <div className="relative z-10 mt-2 grid h-[calc(100%-1.45rem)] grid-cols-[1.1fr_0.9fr] gap-2">
            <div className="rounded-lg border border-border/16 bg-[#0a0a0c] p-2">
              <div className="flex items-center gap-1 pb-1.5 border-b border-fg/8">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400/50" /><span className="h-1.5 w-1.5 rounded-full bg-yellow-400/50" /><span className="h-1.5 w-1.5 rounded-full bg-emerald-400/50" />
                <span className="ml-auto text-[0.38rem] text-fg/30">terminal</span>
              </div>
              <div className="mt-2 space-y-1.5 font-mono">
                {[{ text: "$ next build", c: "text-fg/60" }, { text: "✓ Compiled (2.1s)", c: "text-emerald-400/80" }, { text: "✓ Types checked", c: "text-emerald-400/70" }, { text: "✓ Routes bundled", c: "text-emerald-400/60" }].map((l, i) => (
                  <motion.div key={l.text} className={`text-[0.4rem] ${l.c}`} animate={reducedMotion ? undefined : { opacity: [0, 1] }} transition={{ duration: 0.4, delay: i * 0.8, repeat: Infinity, repeatDelay: 4, ease: "easeOut" }}>{l.text}</motion.div>
                ))}
                <motion.span className="inline-block h-2.5 w-1 bg-accentA/80" animate={reducedMotion ? undefined : { opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }} />
              </div>
            </div>
            <div className="grid gap-1.5">
              {[{ label: "Commit", pct: "84%" }, { label: "Build", pct: "68%" }, { label: "Test", pct: "92%" }, { label: "Deploy", pct: "100%" }].map((s, i) => (
                <motion.div key={s.label} className="rounded-md border border-border/16 bg-card/68 px-2 py-1" animate={reducedMotion ? undefined : { borderColor: ["rgba(13,13,15,0.14)", "rgba(16,185,129,0.4)", "rgba(13,13,15,0.14)"] }} transition={{ duration: 3, delay: i * 0.7, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="flex items-center justify-between text-[0.42rem] uppercase tracking-[0.12em] text-fg/54">
                    <span>{s.label}</span>
                    <motion.span className="text-emerald-400/80" animate={reducedMotion ? undefined : { opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}>done</motion.span>
                  </div>
                  <span className="mt-0.5 block h-1 overflow-hidden rounded-full bg-fg/10">
                    <motion.span className="block h-full origin-left rounded-full bg-gradient-to-r from-emerald-400 to-accentA" style={{ width: s.pct }} animate={reducedMotion ? undefined : { scaleX: [0, 1] }} transition={{ duration: 1.5, delay: i * 0.6, repeat: Infinity, repeatDelay: 3, ease: "easeOut" }} />
                  </span>
                </motion.div>
              ))}
              <div className="flex items-center gap-2 rounded-md border border-border/16 bg-bg/64 px-2 py-1">
                <div className="relative h-6 w-6">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90"><circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" /><motion.circle cx="18" cy="18" r="14" fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth="3" strokeLinecap="round" strokeDasharray="88" animate={reducedMotion ? undefined : { strokeDashoffset: [88, 5, 88] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} /></svg>
                  <motion.span className="absolute inset-0 flex items-center justify-center text-[0.38rem] font-bold text-emerald-400" animate={reducedMotion ? undefined : { opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>98</motion.span>
                </div>
                <span className="text-[0.4rem] uppercase tracking-[0.12em] text-fg/48">Lighthouse</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CMS Architecture (default/fallback)
  return (
    <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(13,13,15,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,13,15,0.05)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative grid h-full gap-3 sm:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-border/18 bg-bg/52 p-3">
          <div className="flex h-4 items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Content Schema</p>
            <Database className="h-3.5 w-3.5 text-accentA/85" />
          </div>
          <div className="relative mt-2 h-[12rem]">
            {[
              { label: "pages", x: "5%", y: "0", fields: ["title", "slug", "seo"] },
              { label: "posts", x: "55%", y: "0", fields: ["content", "author"] },
              { label: "media", x: "5%", y: "52%", fields: ["url", "alt", "size"] },
              { label: "taxonomy", x: "55%", y: "52%", fields: ["name", "type"] }
            ].map((entity, i) => (
              <motion.div key={entity.label} className="absolute w-[42%] rounded-md border border-border/16 bg-card/72 p-1.5" style={{ left: entity.x, top: entity.y }} animate={reducedMotion ? undefined : { borderColor: ["rgba(13,13,15,0.14)", "rgba(37,99,235,0.35)", "rgba(13,13,15,0.14)"], y: [0, -2, 0] }} transition={{ duration: 3.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}>
                <div className="flex items-center gap-1 text-[0.44rem] uppercase tracking-[0.12em] text-accentA/80">
                  <Database className="h-2 w-2" />{entity.label}
                </div>
                <div className="mt-1 space-y-0.5">
                  {entity.fields.map((f) => (
                    <span key={f} className="block rounded bg-fg/[0.06] px-1 py-0.5 text-[0.36rem] text-fg/50">{f}</span>
                  ))}
                </div>
              </motion.div>
            ))}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 200 180" preserveAspectRatio="none" aria-hidden="true">
              <motion.line x1="42" y1="30" x2="55" y2="30" stroke="rgba(37,99,235,0.35)" strokeWidth="1" strokeDasharray="3 2" animate={reducedMotion ? undefined : { opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
              <motion.line x1="25" y1="55" x2="25" y2="90" stroke="rgba(37,99,235,0.3)" strokeWidth="1" strokeDasharray="3 2" animate={reducedMotion ? undefined : { opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} />
              <motion.line x1="75" y1="55" x2="75" y2="90" stroke="rgba(37,99,235,0.3)" strokeWidth="1" strokeDasharray="3 2" animate={reducedMotion ? undefined : { opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }} />
            </svg>
          </div>
        </div>
        <div className="rounded-xl border border-border/18 bg-bg/45 p-3">
          <div className="flex h-4 items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Content Workflow</p>
            <motion.span className="flex items-center gap-1 text-[0.46rem] uppercase tracking-[0.12em] text-emerald-400/70" animate={reducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <span className="h-1 w-1 rounded-full bg-emerald-400" />Live
            </motion.span>
          </div>
          <div className="relative mt-2 h-[8rem] rounded-lg border border-border/14 bg-card/66 p-1.5">
            <div className="grid grid-cols-3 gap-1 text-[0.42rem] uppercase tracking-[0.11em] text-fg/48">
              <span className="text-center">Draft</span>
              <span className="text-center">Review</span>
              <span className="text-center">Published</span>
            </div>
            <div className="mt-1.5 grid grid-cols-3 gap-1 h-[calc(100%-1.2rem)]">
              {[0, 1, 2].map((col) => (
                <div key={col} className="rounded border border-border/10 bg-bg/50 p-0.5 space-y-0.5">
                  {Array.from({ length: col === 1 ? 2 : 1 }).map((_, j) => (
                    <motion.div key={`card-${col}-${j}`} className="rounded bg-fg/[0.06] p-1" animate={reducedMotion ? undefined : { opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 2.5, delay: col * 0.3 + j * 0.2, repeat: Infinity, ease: "easeInOut" }}>
                      <span className="block h-1 w-3/4 rounded-full bg-fg/18" />
                      <span className="mt-0.5 block h-1 w-1/2 rounded-full bg-fg/10" />
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
            <motion.div className="absolute left-[6%] top-[2rem] w-[28%] rounded-md border border-accentA/34 bg-bg/85 p-1 shadow-[0_8px_18px_rgba(13,13,15,0.15)]" animate={reducedMotion ? undefined : { x: ["0%", "110%", "220%", "110%", "0%"], y: [0, -2, 1, -1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <span className="block h-1 w-2/3 rounded-full bg-accentA/40" />
              <span className="mt-0.5 block h-2 rounded-sm bg-fg/10" />
            </motion.div>
          </div>
          <div className="mt-2 rounded-md border border-border/14 bg-bg/62 px-2 py-1.5">
            <div className="flex items-center justify-between text-[0.42rem] uppercase tracking-[0.12em] text-fg/48">
              <span>Schedule</span><span>This Week</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              {["M", "T", "W", "T", "F"].map((day, i) => (
                <div key={`day-${day}-${i}`} className="flex-1 text-center">
                  <span className="text-[0.36rem] text-fg/36">{day}</span>
                  <motion.div className="mx-auto mt-0.5 h-2 w-2 rounded-full border border-border/16" animate={reducedMotion ? undefined : { backgroundColor: ["rgba(255,255,255,0.04)", "rgba(37,99,235,0.5)", "rgba(255,255,255,0.04)"] }} transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }} />
                </div>
              ))}
            </div>
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
          <h1 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-tight">
            <span className="block">Branding and websites.</span>
            <span className="mt-3 block md:mt-4">Built as one system.</span>
          </h1>
          <span className="mt-4 block h-px w-24 bg-accent-gradient" />
          <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.08rem]">
            We handle brand identity, web design, and development as a complete, connected system. No handoffs, no gaps, no version mismatch between what was designed and what was built.
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

      <SectionReveal className="container mt-14 md:mt-16 lg:mt-20" effect="up">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {servicesData.map((service, index) => {
            const Icon = service.icon;
            return (
              <button
                key={`service-pillars-${service.key}`}
                type="button"
                onClick={() => scrollToService(service.sectionId)}
                className="group flex flex-col rounded-[1.2rem] border border-border/18 bg-card/72 p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg hover:-translate-y-0.5 hover:border-accentA/22 hover:bg-card/85"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accentA/24 bg-accentA/8 text-accentA transition-colors duration-200 group-hover:border-accentA/38 group-hover:bg-accentA/14">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-[0.62rem] font-medium tabular-nums text-fg/36 group-hover:text-fg/52 transition-colors duration-200">
                    0{index + 1}
                  </span>
                </div>
                <h2 className="mt-4 text-[1.05rem] font-semibold leading-tight">{service.title}</h2>
                <p className="mt-2 text-xs leading-relaxed text-fg/54">{service.description}</p>
              </button>
            );
          })}
        </div>
      </SectionReveal>

      <div className="container mt-12 space-y-[3.75rem] md:mt-16 md:space-y-20 lg:space-y-[7.5rem]">
        {servicesData.map((service, index) => {
          const textFirst = index % 2 === 0;
          return (
            <SectionReveal key={`service-deep-dive-${service.key}`} effect={textFirst ? "left" : "right"}>
              <article id={service.sectionId} className="section-shell scroll-mt-28 border-border/18 bg-card/74 p-7 md:p-10 lg:p-14">

                {/* ── Section header ───────────────────────────────────── */}
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
                  <p className="text-xs uppercase tracking-[0.2em] text-fg/52">{service.title}</p>
                </div>
                <h3 className="mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.05] tracking-tight">
                  {service.title}
                </h3>
                <span className="mt-3 block h-px w-20 bg-accent-gradient" />

                {/* ── Visual + body text — alternating columns ─────────── */}
                <div className="mt-10 grid items-center gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">

                  {/* Body column */}
                  <div className={`flex flex-col gap-5 ${!textFirst ? "lg:order-2" : ""}`}>
                    <p className="text-[1.01rem] leading-[1.78] text-fg/68">{service.body}</p>
                    {service.microProof ? (
                      <p className="rounded-xl border border-accentA/14 bg-accentA/[0.045] px-5 py-4 text-sm italic leading-relaxed text-fg/60">
                        {service.microProof}
                      </p>
                    ) : null}
                  </div>

                  {/* Visual column */}
                  <div className={!textFirst ? "lg:order-1" : ""}>
                    <ServiceVisual serviceKey={service.key} />
                  </div>
                </div>

                {/* ── Bottom split: guidance + deliverables ─────────────── */}
                <div className="mt-10 grid gap-8 border-t border-border/10 pt-10 md:mt-12 md:pt-12 lg:grid-cols-2 lg:gap-0">

                  {/* Guidance metadata */}
                  <div className="space-y-5 lg:pr-12">
                    {[
                      { label: "Best for", value: service.bestFor },
                      { label: "Typical project", value: service.typicalProject },
                      { label: "Business outcome", value: service.businessOutcome },
                    ].map(({ label, value }) => (
                      <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-4">
                        <p className="pt-0.5 text-[0.61rem] uppercase tracking-[0.17em] text-fg/42 leading-tight">{label}</p>
                        <p className="text-sm leading-relaxed text-fg/74">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Deliverables */}
                  <div className="lg:border-l lg:border-border/10 lg:pl-12">
                    <p className="mb-4 text-[0.67rem] uppercase tracking-[0.18em] text-fg/52">Deliverables</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {service.deliverables.map((item) => (
                        <li
                          key={`${service.key}-${item}`}
                          className="flex items-start gap-2.5 rounded-lg border border-border/16 bg-bg/45 px-3.5 py-2.5 text-sm text-fg/70"
                        >
                          <span className="mt-[0.3rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accentA/45" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </article>
            </SectionReveal>
          );
        })}
      </div>

      <SectionReveal className="container mt-8 md:mt-10" effect="up">
        <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
          <h2 className="text-2xl font-semibold md:text-3xl">How We Build</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.article
                key={`services-process-${step.title}`}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.56, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-xl border border-border/16 bg-bg/44 px-4 py-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border/28"
              >
                <div className="flex items-center justify-between">
                  <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-accentA/34 bg-accentA/10 text-accentA">
                    <span aria-hidden className="pointer-events-none absolute -inset-1 -z-10 rounded-lg bg-accentA/18 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                    <step.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-[0.62rem] uppercase tracking-[0.16em] text-fg/56">{step.phase}</p>
                </div>
                <p className="mt-3 text-lg font-medium">{step.title}</p>
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
          <article className="graphxify-glow-card group relative rounded-[1.2rem] border border-border/16 bg-card/60 p-5 md:p-6">
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
        <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/50">Where to Start</p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Not sure which service you need?</h2>
            <p className="mt-3 text-base text-fg/64">Most projects combine two or three services. Here is a quick guide.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {([
              {
                scenario: "Starting from scratch",
                recommendation: "Begin with Brand Systems to establish your identity, then move into Web Design and Development.",
                sectionId: "service-brand-systems"
              },
              {
                scenario: "You have a brand but need a new website",
                recommendation: "Web Design and Web Development using your existing brand assets.",
                sectionId: "service-web-design"
              },
              {
                scenario: "Your site is live but your team can't update it",
                recommendation: "CMS Architecture as a standalone engagement to restructure your content management.",
                sectionId: "service-cms-architecture"
              }
            ] as const).map((item) => (
              <div key={item.scenario} className="flex flex-col rounded-xl border border-border/16 bg-bg/45 p-5">
                <p className="text-sm font-semibold text-fg/90">{item.scenario}</p>
                <p className="mt-2 flex-1 text-sm text-fg/62">{item.recommendation}</p>
                <button
                  type="button"
                  onClick={() => scrollToService(item.sectionId)}
                  className="mt-4 self-start text-xs uppercase tracking-[0.14em] text-accentA transition-colors hover:text-accentA/72"
                >
                  See the service
                </button>
              </div>
            ))}
          </div>
          <p className="mt-7 text-center text-sm text-fg/54">
            Still not sure?{" "}
            <Link href="/contact" className="link-sweep text-accentA hover:text-accentA/80">
              Tell us about your project
            </Link>{" "}
            and we will recommend the right path.
          </p>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-14" effect="zoom">
        <SiteCtaSection />
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
