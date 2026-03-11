"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Code2, Compass, Database, Mail, Minus, Palette, Phone, Plus, Sparkles, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FounderIntroSection } from "@/components/marketing/founder-intro-section";
import { HomeProjectsSlider } from "@/components/marketing/home-projects-slider";
import { LeadForm } from "@/components/marketing/lead-form";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { Magnetic } from "@/components/motion/magnetic";
import { companyContact, faqs, services } from "@/lib/constants";
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

type HomeProjectCard = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  coverImage: string;
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

const serviceIcons: Record<string, LucideIcon> = {
  "brand-systems": Compass,
  "web-design": Palette,
  "web-development": Code2,
  "cms-architecture": Database
};

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
  tint,
  className
}: {
  src: string;
  alt: string;
  tint: "accent" | "muted";
  className?: string;
}): JSX.Element {
  return (
    <span
      className={cn(
        "mx-2 inline-flex h-[0.95em] w-[0.95em] translate-y-[0.08em] items-center justify-center overflow-hidden rounded-full border align-baseline shadow-[0_6px_14px_rgba(13,13,15,0.18)] ring-1 ring-inset",
        tint === "accent"
          ? "border-accentA/45 bg-accentA/18 ring-accentA/26"
          : "border-border/24 bg-fg/10 ring-border/22",
        className
      )}
    >
      <Image src={src} alt={alt} width={84} height={84} priority className="h-full w-full object-cover" />
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
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/58">
        <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
        <span>{eyebrow}</span>
      </p>
      <h2 className="mt-1 text-2xl font-semibold md:text-3xl">{title}</h2>
    </div>
  );
}

export function HomeSections({
  testimonials,
  testimonialMetrics,
  homeProjects
}: {
  testimonials: TestimonialCard[];
  testimonialMetrics: TestimonialMetricCard[];
  homeProjects: HomeProjectCard[];
}): JSX.Element {
  const reducedMotion = useReducedMotion();
  const [openFaqId, setOpenFaqId] = useState<string>(homeFaqs[0]?.id ?? "");
  const projectCards = homeProjects.slice(0, 6);

  return (
    <div className="space-y-16 pb-16 pt-4 md:space-y-20 md:pb-20 md:pt-8 lg:space-y-24 lg:pt-10">

      {/* ── Hero ── */}
      <SectionReveal className="container pt-0 md:pt-2" effect="zoom">
        <div className="mx-auto max-w-[940px]">
          <div className="mx-auto flex w-fit items-center justify-center rounded-full border border-border/18 bg-card/72 px-3.5 py-1.5 text-center shadow-[0_8px_22px_rgba(13,13,15,0.08)]">
            <p className="text-sm text-fg/66">Trusted by founders</p>
          </div>

          <div className="relative mt-6">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[48%] -z-10 h-28 w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accentA/14 blur-3xl md:h-36"
            />
            <h1 className="mx-auto max-w-[940px] text-center text-[clamp(1.75rem,7.6vw,5.1rem)] font-semibold leading-[0.96] tracking-tight text-black dark:text-white">
              <span className="block">
                Designing
                <HeroChip src="/assets/work-1.svg" alt="Design token" tint="accent" className="mx-1.5 !h-[0.9em] !w-[0.9em]" />
                <span className="gradient-text">brands</span> and
              </span>
              <span className="mt-1.5 block md:mt-2">websites that make</span>
              <span className="mt-1.5 block md:mt-2">
                <span className="gradient-text">businesses</span>
                <HeroChip src="/assets/work-2.svg" alt="Workflow token" tint="muted" className="mx-1.5 !h-[0.9em] !w-[0.9em]" />
                <span className="relative inline-flex items-center">
                  <span className="text-black dark:text-white">stand out</span>
                </span>
              </span>
            </h1>
          </div>

          <p className="mx-auto mt-5 max-w-3xl text-center text-[0.96rem] text-black dark:text-white md:text-[1.14rem]">
            From brand identity to CMS architecture — we build precise, scalable digital systems for ambitious founders and growth-stage companies who demand clarity, performance, and long-term value.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            <Magnetic className="flex w-full justify-center sm:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full max-w-[18rem] rounded-lg border border-border/26 px-6 text-sm !bg-graphite !text-ivory shadow-[0_12px_24px_rgba(13,13,15,0.22)] hover:!bg-graphite/92 dark:!bg-ivory dark:!text-graphite dark:hover:!bg-ivory/92 sm:w-auto sm:text-base"
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

      {/* ── Selected Work (moved up — leads with proof) ── */}
      <SectionReveal className="container" effect="zoom">
        <SectionHeading eyebrow="Projects" title="Selected Work" />
        <div className="section-shell relative overflow-hidden border-white/14 bg-[#0d0d0f]/94 p-4 md:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accentA/35 to-transparent" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accentA/12 blur-3xl" />

          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/12 pb-4">
            <p className="max-w-xl text-sm text-ivory/66 md:text-base">
              A selection of brands and websites we&apos;ve designed and built with a focus on clarity, structure, and performance.
            </p>
            <Link href="/works" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ivory/74 transition-colors duration-300 hover:text-ivory">
              View all projects
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <HomeProjectsSlider projects={projectCards} />
        </div>
      </SectionReveal>

      {/* ── Mid-page CTA ── */}
      <SectionReveal className="container" effect="zoom">
        <div className="section-shell relative overflow-hidden border-accentA/16 p-0">

          {/* top accent hairline */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accentA/40 to-transparent" />

          {/* ── Main content ── */}
          <div className="relative z-10 px-6 py-6 text-center md:px-12 md:py-10 lg:py-12">
            <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-fg/48">
              <span className="h-px w-8 bg-fg/22" aria-hidden="true" />
              Studio inquiry
              <span className="h-px w-8 bg-fg/22" aria-hidden="true" />
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(1.9rem,5vw,3.5rem)] font-semibold leading-[1.04] tracking-tight">
              Ready to build something<br className="hidden sm:block" />
              <span className="gradient-text"> exceptional?</span>
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-fg/56 md:text-[0.96rem]">
              Share your vision. We handle the structure, craft, and execution —<br className="hidden md:block" />
              from first brief to launch day.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <Button asChild size="lg">
                  <Link href="/contact">Start your project</Link>
                </Button>
              </Magnetic>
              <Link href="/works" className="link-sweep text-sm text-fg/60 sm:text-base">
                Browse our work
              </Link>
            </div>

            {/* ── Social proof micro-strip ── */}
            <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 border-t border-border/12 pt-6">
              {[
                { stat: "26+", label: "projects delivered" },
                { stat: "4–8 wks", label: "average turnaround" },
                { stat: "24h", label: "response time" }
              ].map(({ stat, label }) => (
                <span key={stat} className="inline-flex items-center gap-2 text-xs text-fg/46">
                  <span className="h-1.5 w-1.5 rounded-full bg-accentA/65" aria-hidden="true" />
                  <strong className="font-semibold text-fg/72">{stat}</strong>
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* ── About ── */}
      <SectionReveal className="container" effect="left">
        <SectionHeading eyebrow="About" title="About Graphxify" />
        <FounderIntroSection showIntroLabel={false} />
      </SectionReveal>

      {/* ── Services (always-visible 2×2 card grid) ── */}
      <SectionReveal className="container" effect="right">
        <SectionHeading eyebrow="Services" title="Everything you need to build a strong digital foundation." />
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => {
            const ServiceIcon = serviceIcons[service.key] ?? Sparkles;
            return (
              <motion.article
                key={service.key}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={reducedMotion ? undefined : { y: -2, scale: 1.004, transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 0.56, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border/16 bg-card/72 p-6 shadow-[0_8px_20px_rgba(13,13,15,0.06)] backdrop-blur-sm md:p-7"
              >
                {/* hover accent glow — bg-color alpha transitions correctly */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accentA/0 blur-2xl transition-[background-color] duration-500 group-hover:bg-accentA/8" />
                {/* top hairline — opacity used because background-image cannot be CSS-transitioned */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accentA/28 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accentA/28 bg-accentA/8 text-accentA transition-[border-color,background-color,box-shadow] duration-200 group-hover:border-accentA/44 group-hover:bg-accentA/14 group-hover:shadow-[0_0_0_4px_rgba(0,163,255,0.08)]">
                    <ServiceIcon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-4 text-[1.05rem] font-semibold text-fg/96 md:text-lg">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg/62 md:text-[0.95rem]">{service.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[0.68rem] uppercase tracking-[0.16em] text-accentA/0 transition-[color,opacity] duration-200 group-hover:text-accentA/86">
                    Learn more
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </SectionReveal>

      {/* ── Testimonials ── */}
      <SectionReveal className="container mt-6 md:mt-8 lg:mt-10" effect="right">
        <SectionHeading eyebrow="Testimonials" title="Client Stories" />
        <TestimonialsSection items={testimonials} metrics={testimonialMetrics} showLeadText={false} />
      </SectionReveal>

      {/* ── FAQ (single column) ── */}
      <SectionReveal className="container" effect="left">
        <SectionHeading eyebrow="Support" title="FAQ" />
        <div className="mx-auto max-w-3xl space-y-4">
          {homeFaqs.map((item) => {
            const open = openFaqId === item.id;
            return (
              <article
                key={item.id}
                className={cn(
                  "rounded-[1.9rem] border bg-card/78 px-4 py-4 transition-colors duration-300 sm:px-6 sm:py-5 md:px-7",
                  open ? "border-accentA/70 shadow-[0_0_0_1px_rgba(0,163,255,0.2)]" : "border-border/16"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId((prev) => (prev === item.id ? "" : item.id))}
                  className="group flex w-full items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-lg"
                  aria-expanded={open}
                  aria-controls={`${item.id}-content`}
                >
                  <h3 className="text-base font-medium sm:text-lg md:text-[1.32rem]">{item.q}</h3>
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full border p-[0.45rem] shadow-[0_8px_18px_rgba(13,13,15,0.08)] transition-[border-color,background-color,color] duration-150",
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
      </SectionReveal>

      {/* ── Contact ── */}
      <SectionReveal className="container" effect="zoom">
        <SectionHeading eyebrow="Contact" title="Start Your Project" />
        <div className="section-shell relative overflow-hidden border-border/14 bg-bg/62 p-4 md:p-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-accentA/12 blur-3xl" />
          <div className="relative z-10 space-y-3">
            <h3 className="text-lg font-semibold md:text-xl">Tell us what you&apos;re building.</h3>
            <p className="max-w-[46rem] text-sm leading-relaxed text-fg/64">
              Share a few details about your brand, website, or CMS needs.
              <br />
              We&apos;ll review your inquiry and respond with clear next steps.
            </p>

            <LeadForm />

            <div className="border-t border-border/14 pt-3">
              <div className="flex flex-col gap-2.5 md:flex-row md:items-end md:justify-between">
                <p className="text-[0.72rem] text-fg/56">Response time: 24-48 hours</p>
                <div className="flex flex-wrap items-center gap-4 text-sm md:justify-end">
                  <a href={`mailto:${companyContact.email}`} className="link-sweep inline-flex w-fit items-center gap-2 text-fg/74">
                    <Mail className="h-4 w-4 text-accentA" aria-hidden="true" />
                    <span>{companyContact.email}</span>
                  </a>
                  <a href={`tel:${companyContact.phoneHref}`} className="link-sweep inline-flex w-fit items-center gap-2 text-fg/74">
                    <Phone className="h-4 w-4 text-accentA" aria-hidden="true" />
                    <span>{companyContact.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
