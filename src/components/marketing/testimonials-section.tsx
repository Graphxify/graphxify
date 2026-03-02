"use client";

import Image from "next/image";
import { AnimatePresence, motion, type PanInfo, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { testimonialMetricsDefault, testimonials } from "@/lib/constants";

type Direction = 1 | -1;

type TestimonialSlide = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image: string | null;
};

type TestimonialInput = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image_url?: string | null;
};

type TestimonialMetricInput = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
};

const fallbackImages = ["/assets/work-1.svg", "/assets/work-2.svg", "/assets/work-3.svg"] as const;

function sliderCounter(index: number, total: number): string {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function dragToDirection(info: PanInfo): Direction | null {
  if (info.offset.x <= -90 || info.velocity.x <= -260) {
    return 1;
  }

  if (info.offset.x >= 90 || info.velocity.x >= 260) {
    return -1;
  }

  return null;
}

export function TestimonialsSection({
  items,
  metrics,
  showLeadText = true
}: {
  items?: TestimonialInput[];
  metrics?: TestimonialMetricInput[];
  showLeadText?: boolean;
}): JSX.Element {
  const reducedMotion = useReducedMotion();

  const slideVariants: Variants = {
    enter: (dir: Direction) => {
      if (reducedMotion) {
        return { x: "0%" };
      }
      return { x: dir === 1 ? "100%" : "-100%" };
    },
    center: { x: "0%" },
    exit: (dir: Direction) => {
      if (reducedMotion) {
        return { x: "0%" };
      }
      return { x: dir === 1 ? "-100%" : "100%" };
    }
  };

  const slides = useMemo<TestimonialSlide[]>(() => {
    const source = Array.isArray(items) && items.length > 0 ? items : testimonials;
    return source.map((item, index) => ({
      id: item.id,
      quote: item.quote,
      name: item.name,
      role: item.role,
      image: item.image_url || fallbackImages[index % fallbackImages.length]
    }));
  }, [items]);

  const metricItems = useMemo<TestimonialMetricInput[]>(() => {
    const source = Array.isArray(metrics) && metrics.length > 0 ? metrics : testimonialMetricsDefault;
    return source
      .map((item, index) => ({
        id: item.id || `metric-${index + 1}`,
        value: item.value,
        label: item.label,
        sort_order: typeof item.sort_order === "number" ? item.sort_order : index
      }))
      .sort((a, b) => a.sort_order - b.sort_order)
      .slice(0, 6);
  }, [metrics]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const lockRef = useRef(false);
  const lockTimerRef = useRef<number | null>(null);

  const total = Math.max(slides.length, 1);
  const transitionMs = reducedMotion ? 40 : 620;

  const lockForTransition = () => {
    lockRef.current = true;
    setAnimating(true);
    if (lockTimerRef.current) {
      window.clearTimeout(lockTimerRef.current);
    }
    lockTimerRef.current = window.setTimeout(() => {
      lockRef.current = false;
      setAnimating(false);
      lockTimerRef.current = null;
    }, transitionMs);
  };

  useEffect(() => {
    if (activeIndex < slides.length) {
      return;
    }
    setActiveIndex(0);
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (paused || animating || slides.length <= 1) {
      return;
    }

    const id = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % slides.length);
      lockForTransition();
    }, 5600);

    return () => {
      window.clearInterval(id);
      if (lockTimerRef.current) {
        window.clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    };
  }, [animating, paused, slides.length, transitionMs]);

  if (slides.length === 0) {
    return (
      <section className="section-shell p-8 md:p-10">
        <h2 className="text-3xl font-semibold md:text-4xl">Testimonials</h2>
        <p className="mt-3 text-fg/68">Testimonials will appear here once added.</p>
      </section>
    );
  }

  const activeSlide = slides[activeIndex];

  const paginate = (nextDirection: Direction) => {
    if (lockRef.current || slides.length <= 1) {
      return;
    }
    lockForTransition();
    setDirection(nextDirection);
    setActiveIndex((current) => {
      if (nextDirection === 1) {
        return (current + 1) % slides.length;
      }
      return (current - 1 + slides.length) % slides.length;
    });
  };

  return (
    <section className={showLeadText ? "relative pt-5 md:pt-6 lg:pt-7" : "relative pt-2 md:pt-3"}>
      {showLeadText ? <p className="relative z-20 mb-4 text-center text-sm text-fg/62">(Why clients love Graphxify)</p> : null}

      <div className="relative z-10 mx-auto grid w-full max-w-[1070px] gap-4 px-1 md:px-2 lg:grid-cols-[0.32fr_0.68fr]">
        <article className="relative min-h-[24rem] overflow-hidden rounded-[2rem] border border-border/20 bg-[#050507] md:min-h-[26rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(242,240,235,0.06),transparent_42%),radial-gradient(circle_at_86%_72%,rgba(242,240,235,0.05),transparent_44%)]" />
          <motion.div
            aria-hidden
            className="absolute inset-0"
            animate={reducedMotion ? { opacity: 1 } : { opacity: [0.92, 1, 0.92] }}
            transition={reducedMotion ? { duration: 0 } : { duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 text-ivory md:p-7">
            <div className="space-y-7">
              {metricItems.map((metric) => (
                <div key={metric.id}>
                  <p className="text-5xl font-semibold leading-none md:text-6xl">{metric.value}</p>
                  <p className="mt-2 text-xl tracking-tight text-ivory/88 md:text-[1.45rem]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article
          className="relative min-h-[24rem] overflow-hidden rounded-[2rem] border border-border/20 md:min-h-[26rem]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeSlide.id}
              custom={direction}
              variants={slideVariants}
              className="absolute inset-0 will-change-transform"
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reducedMotion ? 0.01 : 0.62, ease: [0.22, 0.75, 0.2, 1] }}
              drag={reducedMotion ? false : "x"}
              dragElastic={0.08}
              dragMomentum={!reducedMotion}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setPaused(true)}
              onDragEnd={(_, info) => {
                const nextDirection = dragToDirection(info);
                if (nextDirection) {
                  paginate(nextDirection);
                }
                setPaused(false);
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={reducedMotion ? { scale: 1 } : { scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={activeSlide.image || "/assets/work-fallback.svg"}
                  alt={`${activeSlide.name} testimonial background`}
                  fill
                  className="object-cover"
                  sizes="65vw"
                  priority
                />
              </motion.div>

              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(186,127,33,0.38)_0%,rgba(116,73,18,0.16)_44%,rgba(0,0,0,0.42)_100%)] mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/24 to-black/20" />

              <div className="relative z-10 flex h-full flex-col justify-between p-6 text-ivory md:p-7">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-2xl tracking-tight text-ivory/92 md:text-[1.8rem]">
                    <span>{sliderCounter(activeIndex, total)}</span>
                    <span className="h-px w-16 bg-ivory/45" />
                  </div>
                  <div className="h-1.5 w-36 overflow-hidden rounded-full bg-ivory/22">
                    <motion.div
                      key={`progress-${activeSlide.id}`}
                      className="h-full bg-ivory/86"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: paused ? 0 : 5.4, ease: "linear" }}
                    />
                  </div>
                </div>

                <motion.blockquote
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.46, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-4xl"
                >
                  <p className="text-3xl font-semibold leading-tight md:text-[2.35rem]">"{activeSlide.quote}"</p>
                  <footer className="mt-6">
                    <p className="text-2xl text-ivory/96 md:text-[1.45rem]">{activeSlide.name}</p>
                    <p className="text-xl text-ivory/72 md:text-[1.12rem]">{activeSlide.role}</p>
                  </footer>
                </motion.blockquote>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => paginate(-1)}
              disabled={animating}
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/34 bg-black/30 text-ivory transition hover:scale-[1.02] hover:bg-black/48"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => paginate(1)}
              disabled={animating}
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/34 bg-black/30 text-ivory transition hover:scale-[1.02] hover:bg-black/48"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
