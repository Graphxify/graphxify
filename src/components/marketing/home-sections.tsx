"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, PanInfo, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/marketing/lead-form";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { faqs, founder, pricingPlans, services, testimonials } from "@/lib/constants";

type WorkCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  year?: number;
  role?: string;
  services?: string[];
};

const capabilities = ["Branding", "Logo", "Website", "Motion", "CMS", "Analytics", "SEO", "Content Ops"];
const stripBrands = ["NOVA SYSTEMS", "ALTO", "NORTHLINE", "ORBIT", "HELIX", "KINETIC"];
const fallbackService = {
  key: "strategy",
  title: "Strategic Delivery",
  body: "Service details will appear once configured."
};

function toCounter(value: number, total: number): string {
  return `${String(value).padStart(2, "0")} / ${String(Math.max(total, 1)).padStart(2, "0")}`;
}

function getDragDirection(info: PanInfo): "next" | "prev" | null {
  if (info.offset.x <= -80 || info.velocity.x <= -240) return "next";
  if (info.offset.x >= 80 || info.velocity.x >= 240) return "prev";
  return null;
}

export function HomeSections({ works }: { works: WorkCard[] }): JSX.Element {
  const reducedMotion = useReducedMotion();

  const testimonialItems = useMemo(() => testimonials.slice(0, 3), []);
  const workItems = useMemo(() => works.slice(0, 3), [works]);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [workIndex, setWorkIndex] = useState(0);
  const [activeService, setActiveService] = useState<string>(services[0]?.key ?? fallbackService.key);

  const activeServiceData = services.find((item) => item.key === activeService) ?? services[0] ?? fallbackService;

  const canSlideTestimonials = testimonialItems.length > 1;
  const canSlideWorks = workItems.length > 1;

  const nextTestimonial = () => {
    if (!canSlideTestimonials) return;
    setTestimonialIndex((current) => (current + 1) % testimonialItems.length);
  };

  const prevTestimonial = () => {
    if (!canSlideTestimonials) return;
    setTestimonialIndex((current) => (current - 1 + testimonialItems.length) % testimonialItems.length);
  };

  const nextWork = () => {
    if (!canSlideWorks) return;
    setWorkIndex((current) => (current + 1) % workItems.length);
  };

  const prevWork = () => {
    if (!canSlideWorks) return;
    setWorkIndex((current) => (current - 1 + workItems.length) % workItems.length);
  };

  return (
    <div className="space-y-28 pb-24 pt-8 md:pt-12">
      <SectionReveal className="container">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/18 bg-card/78 px-6 py-10 shadow-card md:px-12 md:py-14">
          <div className="pointer-events-none absolute -left-10 -top-20 h-52 w-52 rounded-full bg-accentA/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-16 h-52 w-52 rounded-full bg-accentB/20 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <Badge className="border-border/24 bg-bg/55">Available for new projects</Badge>

              <h1 className="mt-6 space-y-2 text-[clamp(2.1rem,6vw,5.8rem)] font-semibold leading-[0.96]">
                <motion.span
                  className="hero-spaced block text-[0.72rem] text-fg/56 md:text-[0.86rem]"
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-20px" }}
                >
                  Designed to ship
                </motion.span>
                <motion.span
                  className="hero-spaced block"
                  initial={reducedMotion ? false : { opacity: 0, y: 12, filter: "blur(5px)" }}
                  whileInView={reducedMotion ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.42, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-20px" }}
                >
                  ELEVATED
                </motion.span>
                <motion.span
                  className="hero-spaced block"
                  initial={reducedMotion ? false : { opacity: 0, y: 12, filter: "blur(5px)" }}
                  whileInView={reducedMotion ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.42, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-20px" }}
                >
                  COMFORT
                </motion.span>
                <span className="block text-[0.88em]">for teams and users.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base text-fg/72 md:text-lg">
                Graphxify designs premium marketing experiences and connected CMS operations with tight visual rhythm,
                clean motion, and enterprise-grade governance.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <Button asChild size="lg">
                    <Link href="/contact">Start your project</Link>
                  </Button>
                </Magnetic>
                <Magnetic>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/works">View case studies</Link>
                  </Button>
                </Magnetic>
              </div>
            </div>

            <div className="space-y-4">
              <div className="section-shell border-border/18 bg-bg/62 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-fg/60">Delivery pulse</p>
                <div className="mt-4 space-y-3 text-sm text-fg/74">
                  <p className="flex items-center justify-between border-b border-border/12 pb-2">
                    <span>Current availability</span>
                    <span className="font-medium">2 slots</span>
                  </p>
                  <p className="flex items-center justify-between border-b border-border/12 pb-2">
                    <span>Average launch cycle</span>
                    <span className="font-medium">4-8 weeks</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Primary stack</span>
                    <span className="font-medium">Next.js + Supabase</span>
                  </p>
                </div>
              </div>
              <div className="section-shell border-border/18 bg-bg/62 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-fg/60">Capabilities</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {capabilities.map((capability) => (
                    <span key={capability} className="rounded-full border border-border/18 bg-card/72 px-3 py-1 text-xs text-fg/72">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-full border border-border/16 bg-card/70 py-3">
          <div className="animate-marquee flex min-w-max items-center gap-10 px-8">
            {[...stripBrands, ...stripBrands].map((brand, index) => (
              <div key={`${brand}-${index}`} className="flex items-center gap-2 text-[0.78rem] tracking-[0.18em] text-fg/60">
                <Sparkles className="h-3.5 w-3.5 text-accentA" />
                <span>{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Client feedback</p>
            <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Testimonials</h2>
          </div>
          <span className="text-sm text-fg/64">{toCounter(testimonialIndex + 1, testimonialItems.length)}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.42fr_1fr]">
          <div className="section-shell border-border/18 bg-card/72 p-5">
            <p className="text-sm text-fg/68">Drag horizontally or use controls to navigate stories.</p>
            <div className="mt-5 flex gap-2">
              <Magnetic>
                <Button variant="secondary" size="icon" aria-label="Previous testimonial" onClick={prevTestimonial}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Magnetic>
              <Magnetic>
                <Button variant="secondary" size="icon" aria-label="Next testimonial" onClick={nextTestimonial}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Magnetic>
            </div>
          </div>

          <motion.div
            className="section-shell border-border/18 bg-card/74 p-6 md:p-8"
            drag={reducedMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              const direction = getDragDirection(info);
              if (direction === "next") nextTestimonial();
              if (direction === "prev") prevTestimonial();
            }}
          >
            {testimonialItems.length === 0 ? (
              <p className="text-sm text-fg/68">Testimonials will appear here once added.</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.article
                  key={testimonialItems[testimonialIndex].id}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <p className="text-xl leading-relaxed md:text-3xl">“{testimonialItems[testimonialIndex].quote}”</p>
                  <p className="text-sm text-fg/62">
                    {testimonialItems[testimonialIndex].name} / {testimonialItems[testimonialIndex].role}
                  </p>
                </motion.article>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Portfolio</p>
            <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Works Carousel</h2>
          </div>
          <span className="text-sm text-fg/64">{toCounter(workIndex + 1, workItems.length)}</span>
        </div>

        <div className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
          {workItems.length === 0 ? (
            <p className="text-sm text-fg/68">No featured works published yet.</p>
          ) : (
            <motion.div
              drag={reducedMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                const direction = getDragDirection(info);
                if (direction === "next") nextWork();
                if (direction === "prev") prevWork();
              }}
            >
              <AnimatePresence mode="wait">
                <motion.article
                  key={workItems[workIndex].id}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="grid gap-5 lg:grid-cols-[1fr_0.95fr]"
                >
                  <div className="relative h-[18rem] overflow-hidden rounded-xl border border-border/18 md:h-[24rem]">
                    <Image
                      src={workItems[workIndex].cover_image_url || "/assets/work-fallback.svg"}
                      alt={workItems[workIndex].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 100vw, 60vw"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Case study</p>
                    <h3 className="text-3xl font-semibold">{workItems[workIndex].title}</h3>
                    <p className="text-fg/68">{workItems[workIndex].excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {(workItems[workIndex].services || []).slice(0, 4).map((service) => (
                        <span key={service} className="rounded-full border border-border/18 px-3 py-1 text-xs text-fg/68">
                          {service}
                        </span>
                      ))}
                    </div>
                    <Magnetic>
                      <Button asChild variant="secondary">
                        <Link href={`/works/${workItems[workIndex].slug}`}>Open project</Link>
                      </Button>
                    </Magnetic>
                  </div>
                </motion.article>
              </AnimatePresence>
            </motion.div>
          )}

          <div className="mt-6 flex items-center gap-2">
            <Magnetic>
              <Button variant="secondary" size="icon" aria-label="Previous work" onClick={prevWork}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="secondary" size="icon" aria-label="Next work" onClick={nextWork}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Magnetic>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Service matrix</p>
            <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Services</h2>
          </div>
          <p className="text-sm text-fg/62">Strategy, design, engineering</p>
        </div>

        <div className="section-shell border-border/18 bg-card/72 p-4 md:p-6">
          <div className="relative flex flex-wrap gap-2 border-b border-border/14 pb-4">
            {services.map((service) => {
              const active = service.key === activeService;
              return (
                <button
                  key={service.key}
                  type="button"
                  onClick={() => setActiveService(service.key)}
                  className="relative rounded-full px-4 py-2 text-sm text-fg/72"
                  aria-label={`Select ${service.title}`}
                >
                  {active ? (
                    <motion.span
                      layoutId="service-tab"
                      className="absolute inset-0 rounded-full border border-accentA/40 bg-accent-gradient opacity-20"
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : null}
                  <span className="relative z-10">{service.title}</span>
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
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6"
            >
              <h3 className="text-2xl font-semibold">{activeServiceData.title}</h3>
              <p className="mt-3 max-w-3xl text-fg/68">{activeServiceData.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="grid gap-7 rounded-[1.5rem] border border-border/18 bg-card/74 p-6 md:grid-cols-[0.6fr_1.4fr] md:p-9">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Meet Daniel</p>
            <div className="relative h-52 w-52 overflow-hidden rounded-2xl border border-border/18 bg-bg/58">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(0,163,255,0.3),transparent_58%)]" />
              <div className="absolute inset-0 grid place-items-center text-xs tracking-[0.18em] text-fg/60">FOUNDER</div>
            </div>
            <p className="text-sm text-fg/66">{founder.title}</p>
          </div>

          <div className="space-y-5">
            <h2 className="text-3xl font-semibold">{founder.name} leads every project with system-level clarity.</h2>
            <p className="max-w-2xl text-fg/68">{founder.bio}</p>
            <div className="grid gap-3 text-sm text-fg/72 md:grid-cols-3">
              <p className="rounded-xl border border-border/16 bg-bg/52 p-4">2018 - Graphxify founded as a strategic design partner.</p>
              <p className="rounded-xl border border-border/16 bg-bg/52 p-4">2022 - Expanded into full-stack CMS and analytics tooling.</p>
              <p className="rounded-xl border border-border/16 bg-bg/52 p-4">2026 - Premium motion-first platform delivery model.</p>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Plans</p>
          <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Pricing</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan, idx) => (
            <Card key={plan.name} className={`h-full ${idx === 1 ? "border-accentA/46" : "border-border/18"}`}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <span className="text-xs text-fg/60">0{idx + 1}</span>
                </div>
                <p className="text-3xl font-semibold">{plan.price}</p>
                <p className="text-sm text-fg/68">{plan.description}</p>
                <ul className="space-y-2 text-sm text-fg/72">
                  {plan.features.map((feature) => (
                    <li key={feature} className="rounded-lg border border-border/16 bg-bg/50 px-3 py-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Support</p>
          <h2 className="mt-1 text-2xl font-semibold md:text-3xl">FAQ</h2>
        </div>
        <div className="section-shell border-border/18 bg-card/74 px-6 py-2 md:px-8">
          <Accordion type="single" collapsible>
            {faqs.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-border/18 bg-card/78 p-7 md:p-10">
          <div className="pointer-events-none absolute -bottom-10 right-8 h-44 w-44 rounded-full bg-accentB/20 blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Contact</p>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight md:text-4xl">
                Let’s build a cleaner, sharper, more memorable digital experience.
              </h2>
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
