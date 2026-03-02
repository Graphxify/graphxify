"use client";

import Image from "next/image";
import { motion, type PanInfo, useAnimationControls, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const controls = useAnimationControls();

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
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const lockRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const total = Math.max(slides.length, 1);

  useEffect(() => {
    if (activeIndex < slides.length) {
      return;
    }
    setActiveIndex(0);
  }, [activeIndex, slides.length]);

  useEffect(() => {
    const updateWidth = () => {
      const nextWidth = viewportRef.current?.offsetWidth ?? 0;
      setSlideWidth(nextWidth);
      controls.set({ x: nextWidth > 0 ? -nextWidth : 0 });
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [controls]);

  useEffect(() => {
    if (slideWidth <= 0) {
      return;
    }
    controls.set({ x: -slideWidth });
  }, [activeIndex, controls, slideWidth]);

  const paginate = useCallback(
    async (nextDirection: Direction) => {
      if (lockRef.current || slides.length <= 1 || slideWidth <= 0) {
        return;
      }

      lockRef.current = true;
      setAnimating(true);
      const targetX = nextDirection === 1 ? -slideWidth * 2 : 0;

      try {
        if (reducedMotion) {
          controls.set({ x: targetX });
        } else {
          await controls.start({
            x: targetX,
            transition: { duration: 0.46, ease: [0.22, 0.75, 0.2, 1] }
          });
        }

        setActiveIndex((current) => {
          if (nextDirection === 1) {
            return (current + 1) % slides.length;
          }
          return (current - 1 + slides.length) % slides.length;
        });

        controls.set({ x: -slideWidth });
      } finally {
        lockRef.current = false;
        setAnimating(false);
      }
    },
    [controls, reducedMotion, slideWidth, slides.length]
  );

  const resetToCenter = useCallback(async () => {
    if (slideWidth <= 0) {
      return;
    }
    if (reducedMotion) {
      controls.set({ x: -slideWidth });
      return;
    }
    await controls.start({
      x: -slideWidth,
      transition: { duration: 0.34, ease: [0.22, 0.75, 0.2, 1] }
    });
  }, [controls, reducedMotion, slideWidth]);

  useEffect(() => {
    if (paused || animating || slides.length <= 1 || slideWidth <= 0) {
      return;
    }

    const id = window.setInterval(() => {
      void paginate(1);
    }, 5600);

    return () => {
      window.clearInterval(id);
    };
  }, [animating, paginate, paused, slideWidth, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="section-shell p-8 md:p-10">
        <h2 className="text-3xl font-semibold md:text-4xl">Testimonials</h2>
        <p className="mt-3 text-fg/68">Testimonials will appear here once added.</p>
      </section>
    );
  }

  const activeSlide = slides[activeIndex];
  const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
  const nextIndex = (activeIndex + 1) % slides.length;

  const visibleSlides = [
    { slot: "prev", slide: slides[prevIndex], index: prevIndex },
    { slot: "active", slide: activeSlide, index: activeIndex },
    { slot: "next", slide: slides[nextIndex], index: nextIndex }
  ] as const;

  return (
    <section className={showLeadText ? "relative pt-5 md:pt-6 lg:pt-7" : "relative pt-2 md:pt-3"}>
      {showLeadText ? <p className="relative z-20 mb-4 text-center text-sm text-fg/62">(Why clients love Graphxify)</p> : null}

      <div className="relative z-10 mx-auto grid w-full max-w-[1070px] gap-4 px-0 sm:px-1 md:px-2 lg:grid-cols-[0.32fr_0.68fr]">
        <article className="relative min-h-[22rem] overflow-hidden rounded-[1.6rem] border border-border/20 bg-[#050507] sm:min-h-[24rem] sm:rounded-[2rem] md:min-h-[26rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(242,240,235,0.06),transparent_42%),radial-gradient(circle_at_86%_72%,rgba(242,240,235,0.05),transparent_44%)]" />
          <motion.div
            aria-hidden
            className="absolute inset-0"
            animate={reducedMotion ? { opacity: 1 } : { opacity: [0.92, 1, 0.92] }}
            transition={reducedMotion ? { duration: 0 } : { duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-5 text-ivory sm:p-6 md:p-7">
            <div className="space-y-6 sm:space-y-7">
              {metricItems.map((metric) => (
                <div key={metric.id}>
                  <p className="text-4xl font-semibold leading-none sm:text-5xl md:text-6xl">{metric.value}</p>
                  <p className="mt-2 text-lg tracking-tight text-ivory/88 sm:text-xl md:text-[1.45rem]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article
          className="relative min-h-[22rem] overflow-hidden rounded-[1.6rem] border border-border/20 sm:min-h-[24rem] sm:rounded-[2rem] md:min-h-[26rem]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 flex h-full w-[300%] will-change-transform touch-pan-y"
              initial={false}
              animate={controls}
              drag={reducedMotion || slides.length <= 1 ? false : "x"}
              dragElastic={0}
              dragMomentum={false}
              dragConstraints={
                slideWidth > 0
                  ? { left: -slideWidth * 2, right: 0 }
                  : { left: 0, right: 0 }
              }
              onDragStart={() => {
                setPaused(true);
                controls.stop();
              }}
              onDragEnd={(_, info) => {
                const nextDirection = dragToDirection(info);
                if (nextDirection) {
                  void paginate(nextDirection).finally(() => setPaused(false));
                  return;
                }
                void resetToCenter().finally(() => setPaused(false));
              }}
            >
              {visibleSlides.map(({ slot, slide, index }) => {
                const isActiveSlide = slot === "active";
                return (
                  <div key={`${slot}-${slide.id}`} className="relative h-full w-1/3 shrink-0">
                    <div className="absolute inset-0">
                      <Image
                        src={slide.image || "/assets/work-fallback.svg"}
                        alt={`${slide.name} testimonial background`}
                        fill
                        className="object-cover"
                        sizes="65vw"
                        priority={isActiveSlide}
                      />
                    </div>

                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(186,127,33,0.38)_0%,rgba(116,73,18,0.16)_44%,rgba(0,0,0,0.42)_100%)] mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/24 to-black/20" />

                    <div className="relative z-10 flex h-full flex-col justify-between p-5 text-ivory sm:p-6 md:p-7">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xl tracking-tight text-ivory/92 sm:gap-4 sm:text-2xl md:text-[1.8rem]">
                          <span>{sliderCounter(index, total)}</span>
                          <span className="h-px w-10 bg-ivory/45 sm:w-16" />
                        </div>
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ivory/22 sm:w-36">
                          {isActiveSlide ? (
                            <motion.div
                              key={`progress-${slide.id}`}
                              className="h-full bg-ivory/86"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: paused ? 0 : 5.4, ease: "linear" }}
                            />
                          ) : (
                            <div className="h-full w-0 bg-ivory/86" />
                          )}
                        </div>
                      </div>

                      <blockquote className="max-w-4xl">
                        <p className="text-[1.55rem] font-semibold leading-tight sm:text-3xl md:text-[2.35rem]">"{slide.quote}"</p>
                        <footer className="mt-5 sm:mt-6">
                          <p className="text-xl text-ivory/96 sm:text-2xl md:text-[1.45rem]">{slide.name}</p>
                          <p className="text-base text-ivory/72 sm:text-xl md:text-[1.12rem]">{slide.role}</p>
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 sm:bottom-5 sm:right-5">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => void paginate(-1)}
              disabled={animating}
              className="grid h-10 w-10 place-items-center rounded-full border border-ivory/34 bg-black/30 text-ivory transition hover:scale-[1.02] hover:bg-black/48 sm:h-11 sm:w-11"
            >
              <ChevronLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => void paginate(1)}
              disabled={animating}
              className="grid h-10 w-10 place-items-center rounded-full border border-ivory/34 bg-black/30 text-ivory transition hover:scale-[1.02] hover:bg-black/48 sm:h-11 sm:w-11"
            >
              <ChevronRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
