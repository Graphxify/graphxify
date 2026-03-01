"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadForm } from "@/components/marketing/lead-form";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { faqs, founder, pricingPlans, services, testimonials } from "@/lib/constants";

type WorkCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  year?: number;
};

export function HomeSections({ works }: { works: WorkCard[] }): JSX.Element {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [workIndex, setWorkIndex] = useState(0);

  const displayWorks = useMemo(() => works.slice(0, 3), [works]);

  return (
    <div className="space-y-20 pb-20 pt-10">
      <SectionReveal className="container grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-5">
          <Badge>Premium Agency Platform</Badge>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Enterprise websites and CMS operations engineered for <span className="gradient-text">growth velocity</span>.
          </h1>
          <p className="max-w-2xl text-lg text-[rgba(242,240,235,0.75)]">
            Graphxify blends brand strategy, digital product design, and full-stack delivery into one production-ready operating system.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/contact">Start your project</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/works">See selected work</Link>
            </Button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid-noise rounded-xl border border-[rgba(242,240,235,0.18)] p-6"
        >
          <p className="text-sm uppercase tracking-[0.14em] text-[rgba(242,240,235,0.72)]">Operational Promise</p>
          <ul className="mt-4 space-y-3 text-sm text-[rgba(242,240,235,0.84)]">
            <li>Audit-ready workflows for content teams</li>
            <li>Performance-first architecture and delivery</li>
            <li>Strict brand governance across all interfaces</li>
          </ul>
          <div className="mt-6 overflow-hidden border-y border-[rgba(242,240,235,0.12)] py-3">
            <motion.div
              className="flex gap-8 whitespace-nowrap text-sm text-[rgba(242,240,235,0.75)]"
              animate={{ x: [0, -320] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 14 }}
            >
              <span>Strategy</span>
              <span>Design System</span>
              <span>Engineering</span>
              <span>CMS Governance</span>
              <span>Analytics</span>
              <span>Strategy</span>
              <span>Design System</span>
              <span>Engineering</span>
            </motion.div>
          </div>
        </motion.div>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Client testimonials</h2>
          <span className="text-sm text-[rgba(242,240,235,0.7)]">{String(testimonialIndex + 1).padStart(2, "0")} / 03</span>
        </div>
        <Card>
          <CardContent className="space-y-4 p-8">
            <p className="text-xl leading-relaxed">"{testimonials[testimonialIndex].quote}"</p>
            <p className="text-sm text-[rgba(242,240,235,0.72)]">
              {testimonials[testimonialIndex].name} - {testimonials[testimonialIndex].role}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => setTestimonialIndex((idx) => (idx + 2) % 3)}>
                Prev
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setTestimonialIndex((idx) => (idx + 1) % 3)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </SectionReveal>

      <SectionReveal className="container">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured works</h2>
          <span className="text-sm text-[rgba(242,240,235,0.7)]">{String(workIndex + 1).padStart(2, "0")} / 03</span>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-max gap-4">
            {displayWorks.map((work, idx) => (
              <motion.article
                key={work.id}
                drag="x"
                dragConstraints={{ left: -20, right: 20 }}
                onHoverStart={() => setWorkIndex(idx)}
                className="w-[320px] rounded-xl border border-[rgba(242,240,235,0.18)] bg-[rgba(13,13,15,0.8)] p-4 transition-transform hover:-translate-y-1"
              >
                <div className="relative mb-3 h-44 overflow-hidden rounded-lg">
                  <Image
                    src={work.cover_image_url || "/assets/work-fallback.svg"}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>
                <h3 className="text-lg font-medium">{work.title}</h3>
                <p className="mt-2 text-sm text-[rgba(242,240,235,0.75)]">{work.excerpt}</p>
                <Button variant="ghost" asChild className="mt-3 px-0">
                  <Link href={`/works/${work.slug}`}>Read case study</Link>
                </Button>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <h2 className="mb-4 text-2xl font-semibold">Services</h2>
        <Tabs defaultValue={services[0].key}>
          <TabsList>
            {services.map((item) => (
              <TabsTrigger key={item.key} value={item.key}>
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {services.map((item) => (
            <TabsContent key={item.key} value={item.key}>
              <Card>
                <CardContent className="p-6 text-[rgba(242,240,235,0.8)]">{item.body}</CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </SectionReveal>

      <SectionReveal className="container grid gap-8 rounded-xl border border-[rgba(242,240,235,0.18)] p-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-semibold">Meet Daniel</h2>
          <p className="mt-2 text-sm text-[rgba(242,240,235,0.75)]">{founder.title}</p>
        </div>
        <p className="text-[rgba(242,240,235,0.84)]">{founder.bio}</p>
      </SectionReveal>

      <SectionReveal className="container">
        <h2 className="mb-4 text-2xl font-semibold">Pricing</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className="h-full">
              <CardContent className="space-y-3 p-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-2xl font-semibold">{plan.price}</p>
                <p className="text-sm text-[rgba(242,240,235,0.76)]">{plan.description}</p>
                <ul className="space-y-2 text-sm text-[rgba(242,240,235,0.78)]">
                  {plan.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="container">
        <h2 className="mb-4 text-2xl font-semibold">FAQ</h2>
        <Accordion type="single" collapsible>
          {faqs.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionReveal>

      <SectionReveal className="container grid gap-8 rounded-xl border border-[rgba(242,240,235,0.18)] p-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Build your next digital growth engine.</h2>
          <p className="text-[rgba(242,240,235,0.75)]">
            Share your project goals and Graphxify will follow up with a delivery roadmap.
          </p>
        </div>
        <LeadForm />
      </SectionReveal>
    </div>
  );
}
