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
  const reducedMotion = useReducedMotion();

  if (serviceKey === "brand-systems") {
    return (
      <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
        <span className="absolute left-4 top-0 h-px w-20 bg-accent-gradient" />
        <div className="grid h-full gap-3 sm:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-xl border border-border/18 bg-bg/55 p-3">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Identity</p>
                <span className="text-[0.5rem] uppercase tracking-[0.14em] text-fg/48">Mark System</span>
              </div>

              <div className="relative mt-2.5 overflow-hidden rounded-lg border border-border/14 bg-card/58 p-2.5">
                <div className="flex items-center justify-between text-[0.5rem] uppercase tracking-[0.14em] text-fg/50">
                  <span>Approval Stamp</span>
                  <span>v1.0</span>
                </div>

                <div className="relative mt-2 h-10">
                  <motion.span
                    className="absolute left-1/2 top-0 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-accentA/35 bg-bg/78 text-accentA shadow-[0_6px_16px_rgba(13,13,15,0.12)]"
                    animate={reducedMotion ? undefined : { x: [-16, 16, -16], y: [0, -1, 0], rotate: [-12, 12, -12] }}
                    transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Compass className="h-3.5 w-3.5" />
                  </motion.span>
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-1/2 top-[1.72rem] h-1.5 w-[5.1rem] -translate-x-1/2 origin-center rounded-full bg-accent-gradient/85"
                    animate={reducedMotion ? undefined : { x: [-18, 18, -18], scaleX: [0.72, 1, 0.72], opacity: [0.45, 0.95, 0.45] }}
                    transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="absolute left-1/2 top-[2.3rem] h-px w-[5.7rem] -translate-x-1/2 bg-fg/24" />
                </div>

                <div className="relative mt-2 grid grid-cols-3 gap-1.5">
                  {[
                    { key: "icon", label: "Icon" },
                    { key: "wordmark", label: "Word" },
                    { key: "stacked", label: "Stack" }
                  ].map((item, index) => (
                    <motion.span
                      key={item.key}
                      className="grid h-6 place-items-center rounded-md border border-border/16 bg-bg/68 text-[0.44rem] uppercase tracking-[0.12em] text-fg/52"
                      animate={reducedMotion ? undefined : { x: [0, 1, 0], y: [0, -1.2, 0], scale: [1, 1.02, 1], opacity: [0.72, 1, 0.72] }}
                      transition={{
                        duration: 3.3 + index * 0.25,
                        delay: index * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {item.label}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="mt-2.5 rounded-md border border-border/14 bg-bg/70 px-2 py-1.5">
                <div className="relative h-4">
                  <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-accentA/72" />
                  <span className="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-accentA/72" />
                  <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-accentA/72" />
                  <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-accentA/72" />
                  <motion.span
                    className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-fg/22"
                    animate={reducedMotion ? undefined : { x: ["-8%", "8%", "-8%"], opacity: [0.36, 0.85, 0.36] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/18 bg-bg/48 p-3">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Guidelines</p>
            <div className="relative mt-3 overflow-hidden rounded-lg border border-border/14 bg-card/62 p-2.5">
              <div className="relative z-10">
                <div className="text-[0.54rem] uppercase tracking-[0.14em] text-fg/56">
                  <span>Logo Lockup</span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <motion.span
                    className="grid h-7 w-7 place-items-center rounded-md border border-accentA/35 bg-bg/70"
                    animate={reducedMotion ? undefined : { rotate: [-3, 3] }}
                    transition={{ duration: 3.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  >
                    <Palette className="h-3.5 w-3.5 text-accentA" />
                  </motion.span>
                  <motion.span
                    className="block h-2 flex-1 origin-left rounded-full bg-accent-gradient"
                    animate={reducedMotion ? undefined : { opacity: [0.78, 1], scaleX: [0.94, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  />
                </div>

                <div className="mt-2.5 space-y-2">
                  {[
                    { key: "type-scale", label: "Type Scale", tag: "AA", width: "78%" },
                    { key: "color-rules", label: "Color Rules", tag: "WCAG", width: "68%" },
                    { key: "spacing-grid", label: "Spacing Grid", tag: "8pt", width: "58%" }
                  ].map((item, index) => (
                    <div key={item.key} className="space-y-1">
                      <div className="flex items-center justify-between text-[0.5rem] uppercase tracking-[0.14em] text-fg/50">
                        <span>{item.label}</span>
                        <span>{item.tag}</span>
                      </div>
                      <span className="block h-1.5 overflow-hidden rounded-full bg-fg/12">
                        <motion.span
                          className="block h-full origin-left rounded-full bg-accent-gradient"
                          style={{ width: item.width }}
                          animate={reducedMotion ? undefined : { scaleX: [0.9, 1], opacity: [0.78, 1] }}
                          transition={{
                            duration: 3 + index * 0.25,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 flex items-center gap-1.5">
                  {["#0EA5E9", "#2563EB", "#0F172A"].map((color, index) => (
                    <motion.i
                      key={`brand-chip-${color}`}
                      aria-hidden="true"
                      className="h-3.5 w-3.5 rounded-full border border-border/18"
                      style={{ backgroundColor: color }}
                      animate={reducedMotion ? undefined : { y: [0, -1.5], opacity: [0.82, 1] }}
                      transition={{
                        duration: 2 + index * 0.1,
                        delay: index * 0.12,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  <span className="ml-1 text-[0.5rem] uppercase tracking-[0.14em] text-fg/50">Primary Palette</span>
                </div>
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
            <span>Responsive Interface Lab</span>
            <span className="rounded-full border border-border/18 bg-card/64 px-2 py-0.5 text-fg/58">Live Prototype</span>
          </div>

          <div className="relative mt-2 h-[calc(100%-1.45rem)]">
            <motion.div
              className="absolute left-0 top-2 w-[74%] overflow-hidden rounded-[0.85rem] border border-border/16 bg-card/72 p-2 shadow-[0_12px_24px_rgba(13,13,15,0.12)]"
              animate={reducedMotion ? undefined : { y: [0, -4, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between text-[0.44rem] uppercase tracking-[0.12em] text-fg/52">
                <span>Desktop Frame</span>
                <span>1440</span>
              </div>
              <motion.span
                className="mt-2 block h-6 origin-left rounded-md bg-accent-gradient/90"
                animate={reducedMotion ? undefined : { scaleX: [0.78, 1, 0.82], opacity: [0.78, 1, 0.78] }}
                transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.span
                    key={`design-tile-${index}`}
                    className="h-4 rounded-md bg-fg/11"
                    animate={reducedMotion ? undefined : { opacity: [0.45, 0.88, 0.45] }}
                    transition={{ duration: 2.4 + (index % 3) * 0.35, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <div className="mt-2 rounded-md border border-border/14 bg-bg/62 p-1.5">
                <div className="flex items-center gap-1.5 text-[0.42rem] uppercase tracking-[0.12em] text-fg/50">
                  <span>Auto Layout</span>
                  <motion.i
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-accentA"
                    animate={reducedMotion ? undefined : { opacity: [0.4, 1], scale: [1, 1.18] }}
                    transition={{ duration: 1.9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-0 top-6 w-[30%] overflow-hidden rounded-[0.85rem] border border-accentA/28 bg-card/78 p-1.5 shadow-[0_14px_26px_rgba(13,13,15,0.16)]"
              animate={reducedMotion ? undefined : { y: [0, -8, 0], x: [0, -3, 0], rotate: [2, -1, 2] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="mx-auto h-1 w-5 rounded-full bg-fg/22" />
              <motion.span
                className="mt-2 block h-4 rounded-md bg-accent-gradient/85"
                animate={reducedMotion ? undefined : { opacity: [0.72, 1, 0.72] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="mt-1.5 space-y-1">
                <span className="block h-2 rounded-sm bg-fg/12" />
                <span className="block h-2 rounded-sm bg-fg/10" />
                <span className="block h-7 rounded-sm bg-fg/9" />
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-2 left-[42%] w-[34%] overflow-hidden rounded-md border border-border/16 bg-card/74 p-1.5"
              animate={reducedMotion ? undefined : { y: [0, -5, 0], rotate: [1, -1, 1] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-[0.42rem] uppercase tracking-[0.12em] text-fg/50">CTA Card</div>
              <span className="mt-1 block h-2 w-3/4 rounded-full bg-fg/20" />
              <span className="mt-1 block h-5 rounded-md bg-fg/10" />
            </motion.div>

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 320 180" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M 122 62 C 154 46, 204 46, 250 82"
                fill="none"
                stroke="rgba(37,99,235,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={reducedMotion ? undefined : { pathLength: [0.2, 1, 0.2], opacity: [0.25, 0.75, 0.25] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>

            <motion.span
              className="absolute left-[46%] top-[40%] grid h-5 w-5 place-items-center rounded-full border border-accentA/38 bg-bg/80 shadow-[0_6px_14px_rgba(13,13,15,0.12)]"
              animate={reducedMotion ? undefined : { x: [0, 18, 10, 0], y: [0, -10, 8, 0], scale: [1, 1.08, 0.96, 1] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Palette className="h-3 w-3 text-accentA/88" />
            </motion.span>

            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 rounded-md border border-border/16 bg-bg/68 px-2 py-1.5 text-[0.42rem] uppercase tracking-[0.12em] text-fg/50">
              <span className="mr-auto">Breakpoint Cycle</span>
              {["Desktop", "Tablet", "Mobile"].map((item, index) => (
                <motion.span
                  key={`breakpoint-pill-${item}`}
                  className="rounded-full border border-border/18 px-1.5 py-0.5"
                  animate={reducedMotion ? undefined : { opacity: [0.45, 1, 0.45], y: [0, -1, 0] }}
                  transition={{ duration: 2.8 + index * 0.25, delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {item}
                </motion.span>
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
            <span>CI/CD Pipeline</span>
            <motion.span
              className="rounded-full border border-border/18 bg-card/64 px-2 py-0.5 text-fg/58"
              animate={reducedMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              Live Build
            </motion.span>
          </div>

          <div className="relative z-10 mt-2 grid h-[calc(100%-1.45rem)] grid-cols-[1.1fr_0.9fr] gap-2">
            <div className="rounded-lg border border-border/16 bg-card/68 p-2">
              <div className="flex items-center justify-between text-[0.46rem] uppercase tracking-[0.13em] text-fg/52">
                <span>Source</span>
                <Code2 className="h-3 w-3 text-accentA/85" />
              </div>

              <div className="mt-2 space-y-1.5">
                {[
                  { key: "import", width: "86%" },
                  { key: "component", width: "73%" },
                  { key: "render", width: "64%" }
                ].map((line, index) => (
                  <motion.span
                    key={`source-${line.key}`}
                    className="block h-1.5 origin-left rounded-full bg-fg/20"
                    style={{ width: line.width }}
                    animate={reducedMotion ? undefined : { scaleX: [0.86, 1], opacity: [0.58, 0.95, 0.58] }}
                    transition={{ duration: 3 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>

              <div className="mt-2.5 rounded-md border border-border/14 bg-bg/62 p-1.5">
                <div className="text-[0.44rem] uppercase tracking-[0.12em] text-fg/48">Build Log</div>
                <div className="mt-1.5 space-y-1">
                  {["Transpile modules", "Bundle routes", "Ship assets"].map((item, index) => (
                    <motion.div
                      key={`log-${item}`}
                      className="flex items-center gap-1.5 text-[0.44rem] text-fg/56"
                      animate={reducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.4 + index * 0.2, delay: index * 0.16, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.i
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-accentA"
                        animate={reducedMotion ? undefined : { scale: [0.88, 1.2, 0.88] }}
                        transition={{ duration: 1.6 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-1.5">
              {[
                { key: "commit", label: "Commit", width: "84%" },
                { key: "build", label: "Build", width: "68%" },
                { key: "deploy", label: "Deploy", width: "92%" }
              ].map((stage, index) => (
                <motion.div
                  key={`stage-${stage.key}`}
                  className="rounded-md border border-border/16 bg-card/68 px-2 py-1.5"
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          borderColor: ["rgba(13,13,15,0.14)", "rgba(0,163,255,0.35)", "rgba(13,13,15,0.14)"],
                          x: [0, 1.5, 0]
                        }
                  }
                  transition={{ duration: 3.6 + index * 0.26, delay: index * 0.24, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-between text-[0.45rem] uppercase tracking-[0.12em] text-fg/54">
                    <span>{stage.label}</span>
                    <motion.i
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-accentA"
                      animate={reducedMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
                      transition={{ duration: 1.8 + index * 0.1, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-fg/12">
                    <motion.span
                      className="block h-full origin-left rounded-full bg-accent-gradient"
                      style={{ width: stage.width }}
                      animate={reducedMotion ? undefined : { scaleX: [0.82, 1], opacity: [0.72, 1] }}
                      transition={{ duration: 2.8 + index * 0.18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    />
                  </span>
                </motion.div>
              ))}

              <div className="rounded-md border border-border/16 bg-bg/64 px-2 py-1.5">
                <div className="flex items-center justify-between text-[0.44rem] uppercase tracking-[0.12em] text-fg/52">
                  <span>Lighthouse</span>
                  <motion.span
                    className="text-accentA"
                    animate={reducedMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    95+
                  </motion.span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[16.5rem] overflow-hidden rounded-[1.2rem] border border-border/18 bg-card/72 p-4">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(13,13,15,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,13,15,0.05)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative grid h-full gap-3 sm:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-border/18 bg-bg/52 p-3">
          <div className="flex h-4 items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Content Model</p>
            <Database className="h-3.5 w-3.5 text-accentA/85" />
          </div>

          <div className="relative mt-2.5 h-[8.1rem] overflow-hidden rounded-lg border border-border/14 bg-card/68 p-2">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border/16 bg-bg/60 px-1.5 py-1 text-[0.46rem] uppercase tracking-[0.12em] text-fg/54">
              <span>page_type</span>
            </div>

            <motion.div
              className="mt-2 rounded-md border border-border/16 bg-bg/64 px-1.5 py-1"
              animate={reducedMotion ? undefined : { x: [0, 2, 0], borderColor: ["rgba(13,13,15,0.14)", "rgba(0,163,255,0.32)", "rgba(13,13,15,0.14)"] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-[0.44rem] uppercase tracking-[0.11em] text-fg/54">
                <span>hero_block[]</span>
              </div>
            </motion.div>

            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {["title", "slug", "seo.meta", "module_ref"].map((field, index) => (
                <motion.span
                  key={`field-${field}`}
                  className="rounded-md border border-border/14 bg-fg/[0.07] px-1.5 py-1 text-[0.42rem] uppercase tracking-[0.11em] text-fg/58"
                  animate={reducedMotion ? undefined : { y: [0, -1, 0], opacity: [0.58, 0.96, 0.58] }}
                  transition={{ duration: 2.6 + index * 0.2, delay: index * 0.14, repeat: Infinity, ease: "easeInOut" }}
                >
                  {field}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="mt-2 h-[4.9rem] overflow-hidden rounded-md border border-border/14 bg-bg/62 p-1.5">
            <div className="text-[0.45rem] uppercase tracking-[0.12em] text-fg/50">Relations</div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {["authors", "media", "taxonomy", "redirects"].map((rel, index) => (
                <motion.span
                  key={`rel-${rel}`}
                  className="rounded-full border border-border/16 bg-card/66 px-1.5 py-0.5 text-[0.4rem] uppercase tracking-[0.11em] text-fg/55"
                  animate={reducedMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }}
                  transition={{ duration: 2.4 + index * 0.2, delay: index * 0.16, repeat: Infinity, ease: "easeInOut" }}
                >
                  {rel}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/18 bg-bg/45 p-3">
          <div className="flex h-4 items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/58">Editorial Board</p>
            <span className="text-[0.46rem] uppercase tracking-[0.12em] text-fg/52">Weekly</span>
          </div>

          <div className="relative mt-2.5 h-[8.1rem] rounded-lg border border-border/14 bg-card/66 p-1.5">
            <div className="grid grid-cols-3 gap-1 text-[0.42rem] uppercase tracking-[0.11em] text-fg/48">
              <span className="text-center">Draft</span>
              <span className="text-center">Review</span>
              <span className="text-center">Scheduled</span>
            </div>

            <div className="absolute inset-x-1.5 bottom-1.5 top-6 grid grid-cols-3 gap-1">
              <div className="rounded-sm border border-border/12 bg-bg/56 p-1">
                <span className="block h-2 rounded-sm bg-fg/12" />
              </div>
              <div className="rounded-sm border border-border/12 bg-bg/56 p-1">
                <span className="block h-2 rounded-sm bg-fg/12" />
                <span className="mt-1 block h-2 rounded-sm bg-fg/9" />
              </div>
              <div className="rounded-sm border border-border/12 bg-bg/56 p-1">
                <span className="block h-2 rounded-sm bg-fg/10" />
              </div>
            </div>

            <motion.div
              className="absolute left-[4%] top-[2.05rem] w-[28%] rounded-md border border-accentA/34 bg-bg/82 p-1 shadow-[0_8px_18px_rgba(13,13,15,0.12)]"
              animate={reducedMotion ? undefined : { x: ["0%", "105%", "210%", "105%", "0%"], y: [0, -1, 1, -1, 0] }}
              transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="block h-1 w-2/3 rounded-full bg-fg/24" />
              <span className="mt-1 block h-3 rounded-sm bg-fg/12" />
            </motion.div>
          </div>

          <div className="mt-2 h-[4.9rem] overflow-hidden rounded-md border border-border/14 bg-bg/62 px-2 py-1.5">
            <div className="flex items-center justify-between text-[0.44rem] uppercase tracking-[0.12em] text-fg/50">
              <span>Publish Queue</span>
              <span>Fri</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[0.39rem] uppercase tracking-[0.1em] text-fg/45">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
            <div className="relative mt-1 h-3">
              <span className="absolute inset-x-0 top-1.5 h-px bg-fg/18" />
              <motion.span
                className="absolute left-0 top-0 h-3 w-3 rounded-full border border-border/18 bg-accent-gradient"
                animate={reducedMotion ? undefined : { x: ["0%", "88%", "0%"] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              />
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
