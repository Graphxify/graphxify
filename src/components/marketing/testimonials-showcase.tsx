"use client";

import Image from "next/image";
import { AnimatePresence, motion, PanInfo, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { testimonialMetrics, testimonialSlides } from "@/lib/marketing-content";

function dragDirection(info: PanInfo): "next" | "prev" | null {
  if (info.offset.x <= -90 || info.velocity.x <= -260) return "next";
  if (info.offset.x >= 90 || info.velocity.x >= 260) return "prev";
  return null;
}

function counter(index: number, total: number): string {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

export function TestimonialsShowcase(): JSX.Element {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = testimonialSlides.length;

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused, total]);

  const current = testimonialSlides[index];

  const next = () => setIndex((currentValue) => (currentValue + 1) % total);
  const prev = () => setIndex((currentValue) => (currentValue - 1 + total) % total);

  return (
    <section className="relative overflow-hidden">
      <p className="pointer-events-none absolute -top-8 left-0 hidden text-[clamp(4.4rem,13vw,12rem)] font-semibold leading-none text-fg/8 md:block">
        Testimonials
      </p>

      <div className="relative z-10 grid gap-5 lg:grid-cols-[0.34fr_0.66fr]">
        <aside className="relative min-h-[30rem] overflow-hidden rounded-[1.7rem] border border-border/20 bg-fg text-bg">
          <Image src={current.imageUrl} alt="Client project backdrop" fill className="object-cover opacity-25" sizes="35vw" />
          <div className="absolute inset-0 bg-black/58" />
          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.16em] text-ivory/76">Client feedback</p>
            <div className="space-y-8">
              {testimonialMetrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-6xl font-semibold leading-none text-ivory md:text-7xl">{metric.value}</p>
                  <p className="mt-2 text-xl text-ivory/84">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <article
          className="relative min-h-[30rem] overflow-hidden rounded-[1.7rem] border border-border/20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 1.02 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -16, scale: 0.99 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              drag={reducedMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                const direction = dragDirection(info);
                if (direction === "next") next();
                if (direction === "prev") prev();
              }}
            >
              <Image src={current.imageUrl} alt={`${current.name} testimonial background`} fill className="object-cover" sizes="65vw" />
              <div className="absolute inset-0 bg-black/52" />

              <div className="absolute inset-0 flex flex-col justify-between p-7 text-ivory md:p-10">
                <div className="flex items-center gap-4 text-[1.6rem] font-medium tracking-[0.08em] text-ivory/90">
                  <span>{counter(index, total)}</span>
                  <span className="h-px w-14 bg-ivory/42" />
                </div>

                <div className="max-w-3xl pr-16 md:pr-24">
                  <p className="text-3xl font-semibold leading-tight md:text-5xl">"{current.quote}"</p>
                  <p className="mt-6 text-lg text-ivory/92">{current.name}</p>
                  <p className="text-2xl text-ivory/72">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={prev}
              className="grid h-12 w-12 place-items-center rounded-full border border-ivory/34 bg-black/38 text-ivory transition hover:-translate-y-0.5 hover:bg-black/54"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={next}
              className="grid h-12 w-12 place-items-center rounded-full border border-ivory/34 bg-black/38 text-ivory transition hover:-translate-y-0.5 hover:bg-black/54"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
