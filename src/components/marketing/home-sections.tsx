"use client";

import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { InquiryForm } from "@/components/marketing/inquiry-form";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { TestimonialsShowcase } from "@/components/marketing/testimonials-showcase";
import {
  featuredWorks,
  founderSection,
  homepageFaqs,
  processPhases,
  qualityBar,
  servicePillars
} from "@/lib/marketing-content";

type WorkCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
};

function coverForSlug(works: WorkCard[], slug: string, fallback: string): string {
  const match = works.find((item) => item.slug === slug);
  return match?.cover_image_url || fallback;
}

export function HomeSections({ works }: { works: WorkCard[] }): JSX.Element {
  return (
    <div className="space-y-24 pb-24 pt-10 md:pt-14">
      <SectionReveal className="container">
        <section className="section-shell p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/60">
            Brand systems • UX/UI design • Web development • CMS architecture
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight md:text-6xl">
            Premium brand systems and high-performance websites - built to scale.
          </h1>
          <p className="mt-6 max-w-3xl text-base text-fg/72 md:text-lg">
            Graphxify is a branding + web design + development studio. We design cohesive brand systems, craft clean
            UX/UI, and ship fast, accessible websites with structured CMS implementations - so your team can publish
            confidently as you grow.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button asChild size="lg">
              <Link href="#inquiry">Start a project inquiry</Link>
            </Button>
            <Link href="/works" className="link-sweep text-sm text-fg/80">
              View selected work
            </Link>
          </div>
          <p className="mt-4 text-sm text-fg/64">
            Typical timeline: 4-8 weeks • Founder-led delivery • Next.js builds + structured CMS
          </p>
        </section>
      </SectionReveal>

      <SectionReveal className="container">
        <TestimonialsShowcase />
      </SectionReveal>

      <SectionReveal className="container">
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">Selected Work</h2>
            <p className="mt-3 max-w-3xl text-fg/72">
              Three representative engagements showing how we build premium brands, websites, and content systems.
              Outcomes are described qualitatively unless public metrics are available.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredWorks.map((work, index) => (
              <article key={work.slug} className="section-shell lift-hover flex h-full flex-col p-4">
                <div className="relative h-48 overflow-hidden rounded-lg border border-border/18">
                  <Image
                    src={coverForSlug(works, work.slug, `/assets/work-${index + 1}.svg`)}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{work.title}</h3>
                <p className="mt-2 text-sm text-fg/72">{work.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border/20 px-2.5 py-1 text-xs text-fg/72">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/works/${work.slug}`} className="link-sweep mt-4 inline-flex text-sm">
                  Open case study
                </Link>
              </article>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal className="container">
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">Services</h2>
            <p className="mt-3 max-w-3xl text-fg/72">
              Four pillars that create scalable digital foundations - brand clarity, UI precision, fast builds, and
              CMS structure.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {servicePillars.map((service) => (
              <article key={service.slug} className="section-shell p-6">
                <h3 className="text-2xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm text-fg/72">{service.oneLiner}</p>
                <ul className="mt-4 space-y-2 text-sm text-fg/78">
                  {service.deliverables.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <Link href="/services" className="link-sweep text-sm text-fg/80">
            See full service details
          </Link>
        </section>
      </SectionReveal>

      <SectionReveal className="container">
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">Process</h2>
            <p className="mt-3 max-w-3xl text-fg/72">
              Simple, system-first delivery. You'll always know what's happening and what's next.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {processPhases.map((phase) => (
              <article key={phase.id} className="section-shell p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-fg/56">Phase {phase.id}</p>
                <h3 className="mt-2 text-xl font-semibold">{phase.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-fg/78">
                  {phase.items.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal className="container">
        <section className="section-shell p-8 md:p-10">
          <h2 className="text-3xl font-semibold md:text-4xl">What 'premium' means here</h2>
          <ul className="mt-5 grid gap-3 text-sm text-fg/78 md:grid-cols-2">
            {qualityBar.map((item) => (
              <li key={item} className="rounded-lg border border-border/18 bg-card px-3 py-3">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </SectionReveal>

      <SectionReveal className="container">
        <section className="section-shell grid gap-7 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Meet Daniel</p>
            <div className="relative h-52 w-52 overflow-hidden rounded-2xl border border-border/20 bg-card">
              <div className="absolute inset-0 grid place-items-center text-xs tracking-[0.2em] text-fg/62">FOUNDER</div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">{founderSection.title}</h2>
            <p className="mt-4 max-w-3xl text-fg/72">{founderSection.body}</p>
            <ul className="mt-5 space-y-2 text-sm text-fg/78">
              {founderSection.bullets.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal className="container">
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold md:text-4xl">FAQ</h2>
          <div className="section-shell px-6 md:px-8">
            <Accordion type="single" collapsible>
              {homepageFaqs.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal className="container">
        <section id="inquiry" className="section-shell p-8 md:p-10">
          <h2 className="text-3xl font-semibold md:text-4xl">Start a project inquiry</h2>
          <p className="mt-3 max-w-3xl text-fg/72">
            Share your goals, timeline, and current site (if you have one). We reply within one business day with a
            clear next step.
          </p>

          <div className="mt-6 max-w-4xl">
            <InquiryForm source="homepage" />
          </div>

          <p className="mt-6 text-sm text-fg/72">
            Prefer direct email?{" "}
            <a href="mailto:hello@graphxify.com" className="link-sweep">
              hello@graphxify.com
            </a>
          </p>
        </section>
      </SectionReveal>
    </div>
  );
}
