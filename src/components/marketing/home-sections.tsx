"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Code2, Compass, Database, LayoutTemplate, Minus, Palette, Plus, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FounderIntroSection } from "@/components/marketing/founder-intro-section";
import { LeadForm } from "@/components/marketing/lead-form";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { Magnetic } from "@/components/motion/magnetic";
import { faqs, services } from "@/lib/constants";
import { cn } from "@/lib/utils";

type TestimonialCard = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image_url?: string | null;
};

type TestimonialMetricCard = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
};

type StripLogo = {
  key: string;
  alt: string;
  lightSrc: string;
  darkSrc?: string;
  width: number;
  height: number;
  className: string;
};

const stripLogos: StripLogo[] = [
  {
    key: "wordmark-1",
    alt: "Graphxify wordmark",
    lightSrc: "/assets/Graphxify-Logo-Black.webp",
    darkSrc: "/assets/Graphxify-Logo-white.webp",
    width: 246,
    height: 68,
    className: "w-[6.2rem] sm:w-[7rem] md:w-[8.8rem]"
  },
  {
    key: "mark-1",
    alt: "Graphxify logo mark",
    lightSrc: "/assets/logo-mark.svg",
    width: 128,
    height: 32,
    className: "w-[4.8rem] sm:w-[5.6rem] md:w-[7.1rem]"
  },
  {
    key: "wordmark-2",
    alt: "Graphxify wordmark",
    lightSrc: "/assets/Graphxify-Logo-Black.webp",
    darkSrc: "/assets/Graphxify-Logo-white.webp",
    width: 246,
    height: 68,
    className: "w-[6.2rem] sm:w-[7rem] md:w-[8.8rem]"
  },
  {
    key: "mark-2",
    alt: "Graphxify logo mark",
    lightSrc: "/assets/logo-mark.svg",
    width: 128,
    height: 32,
    className: "w-[4.8rem] sm:w-[5.6rem] md:w-[7.1rem]"
  },
  {
    key: "wordmark-3",
    alt: "Graphxify wordmark",
    lightSrc: "/assets/Graphxify-Logo-Black.webp",
    darkSrc: "/assets/Graphxify-Logo-white.webp",
    width: 246,
    height: 68,
    className: "w-[6.2rem] sm:w-[7rem] md:w-[8.8rem]"
  },
  {
    key: "mark-3",
    alt: "Graphxify logo mark",
    lightSrc: "/assets/logo-mark.svg",
    width: 128,
    height: 32,
    className: "w-[4.8rem] sm:w-[5.6rem] md:w-[7.1rem]"
  }
];
const fallbackService = {
  key: "brand-systems",
  title: "Brand Systems",
  body: "We define your positioning, messaging, and visual identity into a structured brand system that stays consistent across every platform."
};

const serviceIcons: Record<string, LucideIcon> = {
  "brand-systems": Compass,
  "web-design": Palette,
  "web-development": Code2,
  "cms-architecture": Database
};

type WorkPhase = {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const workPhases: WorkPhase[] = [
  {
    id: "01",
    title: "Discovery + Scope",
    body: "We audit your current state, define goals, map requirements, and lock a clear scope with priorities.",
    icon: Compass
  },
  {
    id: "02",
    title: "System Design",
    body: "We shape IA, UI components, and content structure so design and CMS stay aligned from day one.",
    icon: LayoutTemplate
  },
  {
    id: "03",
    title: "Build + QA",
    body: "We implement the experience, tune performance, and run quality checks across devices, accessibility, and SEO.",
    icon: Code2
  },
  {
    id: "04",
    title: "Launch + Handover",
    body: "We launch with confidence, document the system, and hand over a clean foundation your team can scale.",
    icon: Rocket
  }
];

type HomeFaq = {
  id: string;
  q: string;
  a: string;
};

const homeFaqs: HomeFaq[] = [
  ...faqs.map((item, index) => ({ id: `faq-${index + 1}`, q: item.q, a: item.a })),
  {
    id: "faq-4",
    q: "How long does a full project usually take?",
    a: "Most projects run between 4 and 8 weeks depending on scope, review speed, and content readiness."
  },
  {
    id: "faq-5",
    q: "Can we keep iterating after launch?",
    a: "Yes. We can continue with optimization sprints for new pages, content modules, and UI refinements."
  },
  {
    id: "faq-6",
    q: "Will our team be able to manage content easily?",
    a: "Absolutely. We structure the CMS with clear fields and reusable blocks, then provide handover guidance."
  }
];

function HeroChip({
  src,
  alt,
  tint
}: {
  src: string;
  alt: string;
  tint: "accent" | "muted";
}): JSX.Element {
  return (
    <span
      className={cn(
        "mx-2 inline-flex h-[0.95em] w-[0.95em] translate-y-[0.08em] items-center justify-center overflow-hidden rounded-full border align-baseline shadow-[0_6px_14px_rgba(13,13,15,0.18)]",
        tint === "accent" ? "border-accentA/45 bg-accentA/18" : "border-border/24 bg-fg/10"
      )}
    >
      <Image src={src} alt={alt} width={84} height={84} className="h-full w-full object-cover" />
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title
}: {
  eyebrow: string;
  title: string;
}): JSX.Element {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-[0.2em] text-fg/58">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold md:text-3xl">{title}</h2>
    </div>
  );
}

export function HomeSections({
  testimonials,
  testimonialMetrics
}: {
  testimonials: TestimonialCard[];
  testimonialMetrics: TestimonialMetricCard[];
}): JSX.Element {
  const reducedMotion = useReducedMotion();
  const [activeService, setActiveService] = useState<string>(services[0]?.key ?? fallbackService.key);
  const [openFaqId, setOpenFaqId] = useState<string>(homeFaqs[0]?.id ?? "");
  const activeServiceData = services.find((item) => item.key === activeService) ?? services[0] ?? fallbackService;
  const faqColumns = [homeFaqs.filter((_, index) => index % 2 === 0), homeFaqs.filter((_, index) => index % 2 !== 0)];

  return (
    <div className="space-y-16 pb-16 pt-4 md:space-y-20 md:pb-20 md:pt-8 lg:space-y-24 lg:pt-10">
      <SectionReveal className="container pt-0 md:pt-2" effect="zoom">
        <div className="mx-auto max-w-[940px]">
          <div className="mx-auto flex w-fit items-center justify-center rounded-full border border-border/18 bg-card/72 px-3.5 py-1.5 text-center shadow-[0_8px_22px_rgba(13,13,15,0.08)]">
            <p className="text-sm text-fg/66">Trusted by founders</p>
          </div>

          <h1 className="mx-auto mt-6 max-w-[940px] text-center text-[clamp(1.75rem,7.6vw,5.1rem)] font-semibold leading-[0.96] tracking-tight">
            <span className="block text-fg">
              Effortless
              <HeroChip src="/assets/work-1.svg" alt="Design token" tint="accent" />
              <span className="text-accentA">Design</span>
            </span>
            <span className="block text-fg/66">
              for
              <HeroChip src="/assets/work-2.svg" alt="Workflow token" tint="muted" />
              Brand Teams
            </span>
            <span className="block text-fg/72">
              <span className="text-accentA">built</span> in Toronto,
              <HeroChip src="/assets/work-3.svg" alt="Location token" tint="muted" />
              Canada
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-center text-[0.96rem] text-fg/60 md:text-[1.14rem]">
            We make it easy for teams to launch, grow, and scale with clean brand systems, calm UX, and fast websites without noise.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            <Magnetic className="flex w-full justify-center sm:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full max-w-[18rem] rounded-full border border-border/26 px-6 text-sm !bg-graphite !text-ivory shadow-[0_12px_24px_rgba(13,13,15,0.22)] hover:!bg-graphite/92 dark:!bg-ivory dark:!text-graphite dark:hover:!bg-ivory/92 sm:w-auto sm:text-base"
              >
                <Link href="/contact">Start a project inquiry</Link>
              </Button>
            </Magnetic>
            <Link href="/works" className="link-sweep text-center text-sm text-fg/72 sm:text-base">
              View selected work
            </Link>
          </div>
        </div>

        <div className="group relative mt-12 overflow-hidden rounded-2xl bg-card/70 py-2.5 md:mt-14">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card via-card/90 to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card via-card/90 to-transparent md:w-24" />
          <div className="flex w-max animate-marquee items-center [animation-duration:30s] [animation-play-state:running] motion-reduce:animate-none group-hover:[animation-play-state:paused] will-change-transform">
            {[0, 1].map((loopIndex) => (
              <ul
                key={`logo-loop-${loopIndex}`}
                aria-hidden={loopIndex === 1}
                className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 md:gap-12 md:pr-12"
              >
                {stripLogos.map((logo) => (
                  <li
                    key={`${loopIndex}-${logo.key}`}
                    className="inline-flex h-8 items-center justify-center opacity-56 transition duration-300 hover:opacity-92 sm:h-9"
                  >
                    <span className={cn("relative inline-flex items-center justify-center", logo.className)}>
                      <Image
                        src={logo.lightSrc}
                        alt={logo.alt}
                        width={logo.width}
                        height={logo.height}
                        className={cn("h-auto w-full object-contain", logo.darkSrc ? "dark:hidden" : "")}
                      />
                      {logo.darkSrc ? (
                        <Image
                          src={logo.darkSrc}
                          alt={logo.alt}
                          width={logo.width}
                          height={logo.height}
                          className="hidden h-auto w-full object-contain dark:block"
                        />
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container" effect="left">
        <SectionHeading eyebrow="About" title="The Founder" />
        <FounderIntroSection showIntroLabel={false} />
      </SectionReveal>

      <SectionReveal className="container" effect="right">
        <SectionHeading eyebrow="Services" title="Everything you need to build a strong digital foundation." />
        <div className="section-shell border-border/18 bg-card/72 p-4 md:p-6">
          <div className="relative grid grid-cols-2 gap-2 border-b border-border/14 pb-4">
            {services.map((service) => {
              const active = service.key === activeService;
              const ServiceIcon = serviceIcons[service.key] ?? Sparkles;
              return (
                <button
                  key={service.key}
                  type="button"
                  onClick={() => setActiveService(service.key)}
                  className={cn(
                    "group relative inline-flex w-full items-center justify-start rounded-full px-4 py-2 text-left text-sm transition-colors duration-300",
                    active ? "text-ivory" : "text-fg/72 hover:text-ivory"
                  )}
                  aria-label={`Select ${service.title}`}
                >
                  {!active ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ) : null}
                  {active ? (
                    <motion.span
                      layoutId="service-tab"
                      className="absolute inset-0 rounded-full border border-accentA/45 bg-accent-gradient"
                      transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : null}
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <ServiceIcon className={cn("h-3.5 w-3.5 transition-colors duration-300", active ? "text-ivory" : "text-accentA group-hover:text-ivory")} />
                    <span>{service.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeServiceData.key}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
              className="pt-6"
            >
              <h3 className="text-2xl font-semibold">{activeServiceData.title}</h3>
              <p className="mt-3 max-w-3xl text-fg/68">{activeServiceData.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </SectionReveal>

      <SectionReveal className="container" effect="zoom">
        <SectionHeading eyebrow="Process" title="Work Phases" />
        <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            {workPhases.map((phase) => {
              const Icon = phase.icon;
              return (
                <motion.article
                  key={phase.id}
                  whileHover={reducedMotion ? undefined : { y: -6, scale: 1.012 }}
                  transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-xl border border-border/16 bg-bg/42 p-5 shadow-[0_8px_20px_rgba(13,13,15,0.08)]"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Phase {phase.id}</p>
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-border/20 bg-card/72 text-accentA transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold">{phase.title}</h3>
                    <p className="mt-2 text-sm text-fg/68 md:text-base">{phase.body}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container" effect="left">
        <SectionHeading eyebrow="Support" title="FAQ" />
        <div className="grid gap-4 md:grid-cols-2">
          {faqColumns.map((column, colIdx) => (
            <div key={`faq-col-${colIdx}`} className="space-y-4">
              {column.map((item) => {
                const open = openFaqId === item.id;
                return (
                  <article key={item.id} className="rounded-[1.9rem] border border-border/16 bg-card/78 px-4 py-4 sm:px-6 sm:py-5 md:px-7">
                    <button
                      type="button"
                      onClick={() => setOpenFaqId((prev) => (prev === item.id ? "" : item.id))}
                      className="group flex w-full items-center justify-between gap-4 text-left"
                      aria-expanded={open}
                      aria-controls={`${item.id}-content`}
                    >
                      <h3 className="text-base font-medium sm:text-lg md:text-[1.32rem]">{item.q}</h3>
                      <span
                        className={cn(
                          "grid h-11 w-11 place-items-center rounded-full border p-[0.45rem] shadow-[0_8px_18px_rgba(13,13,15,0.08)] transition-all duration-300",
                          open
                            ? "border-accentA/40 bg-accent-gradient text-ivory"
                            : "border-border/22 bg-bg/76 text-fg/72 group-hover:border-border/34 group-hover:bg-card/92 group-hover:text-fg"
                        )}
                      >
                        {open ? <Minus className="h-[1.06rem] w-[1.06rem] stroke-[2.6]" /> : <Plus className="h-[1.06rem] w-[1.06rem] stroke-[2.6]" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          id={`${item.id}-content`}
                          key={`${item.id}-open`}
                          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-4 text-sm leading-relaxed text-fg/68 md:text-base">{item.a}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-6 md:mt-8 lg:mt-10" effect="right">
        <SectionHeading eyebrow="Testimonials" title="Client Stories" />
        <TestimonialsSection items={testimonials} metrics={testimonialMetrics} showLeadText={false} />
      </SectionReveal>

      <SectionReveal className="container" effect="zoom">
        <SectionHeading eyebrow="Contact" title="Start a Project Inquiry" />
        <div className="relative overflow-hidden rounded-[1.6rem] border border-border/18 bg-card/78 p-5 md:p-8 lg:p-10">
          <div className="pointer-events-none absolute -bottom-10 right-8 h-44 w-44 rounded-full bg-accentB/20 blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <h3 className="max-w-xl text-xl font-semibold leading-tight md:text-3xl">Let’s build a cleaner, sharper, more memorable digital experience.</h3>
              <p className="mt-4 max-w-lg text-fg/68">
                Share the scope and timeline. We’ll respond with a delivery roadmap tailored to your team and brand.
              </p>
            </div>
            <div className="section-shell border-border/18 bg-bg/58 p-4 md:p-6">
              <LeadForm />
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
