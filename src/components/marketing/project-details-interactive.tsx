"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ProjectDetail, ProjectImage } from "@/lib/project-details";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type CaptionMode = "overlay" | "below" | "side";

function brief(text: string, maxWords = 16): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function decimalPlaces(value: number): number {
  if (Number.isInteger(value)) {
    return 0;
  }
  return 1;
}

function formatMetricValue(value: number): string {
  const digits = decimalPlaces(value);
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

export function CountUpMetric({
  value,
  prefix,
  suffix,
  className
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}): JSX.Element {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (reducedMotion) {
      setCurrent(value);
      return;
    }

    const duration = 1000;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(value * eased);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [inView, reducedMotion, value]);

  const output = useMemo(() => formatMetricValue(inView ? current : 0), [current, inView]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {output}
      {suffix}
    </span>
  );
}

export function ScrollScaleHero({
  image,
  className,
  children
}: {
  image: ProjectImage;
  className?: string;
  children?: ReactNode;
}): JSX.Element {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1.04, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -10]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-[26rem] overflow-hidden rounded-[1.55rem] border border-border/18 shadow-[0_24px_52px_rgba(13,13,15,0.16)] md:h-[38rem]",
        className
      )}
    >
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="100vw" priority />
      </motion.div>
      {children}
    </div>
  );
}

export function ProjectLightboxImage({
  image,
  className,
  sizes,
  parallax = false,
  priority = false,
  imageClassName,
  captionMode = "overlay",
  accentStamp = false,
  accentHairline = false,
  accentFocusRing = false,
  wipeReveal = false,
  hideCaption = false
}: {
  image: ProjectImage;
  className?: string;
  sizes?: string;
  parallax?: boolean;
  priority?: boolean;
  imageClassName?: string;
  captionMode?: CaptionMode;
  accentStamp?: boolean;
  accentHairline?: boolean;
  accentFocusRing?: boolean;
  wipeReveal?: boolean;
  hideCaption?: boolean;
}): JSX.Element {
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], reducedMotion || !parallax ? [0, 0] : [-8, 8]);

  const mediaFrame = (
    <div
      ref={triggerRef}
      className={cn(
        "group relative block w-full overflow-hidden rounded-[1.35rem] border border-border/18 bg-card/78 text-left leading-none shadow-[0_16px_34px_rgba(13,13,15,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        accentFocusRing ? "hover:ring-1 hover:ring-accentA/36" : "",
        className
      )}
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className={cn("block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]", imageClassName)}
          sizes={sizes || "(max-width: 1024px) 100vw, 50vw"}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
      </motion.div>

      <span aria-hidden className="pointer-events-none absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/4" />

      {wipeReveal ? (
        <motion.span
          aria-hidden
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.56, ease: EASE }}
          className="pointer-events-none absolute inset-0 origin-left bg-bg/92"
        />
      ) : null}

      {accentStamp ? (
        <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-8 w-8 overflow-hidden rounded-tr-[1.35rem]">
          <span className="absolute inset-0 bg-accent-gradient [clip-path:polygon(100%_0,0_0,100%_100%)]" />
        </span>
      ) : null}

      {accentHairline ? (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent-gradient" />
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent-gradient" />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px bg-accent-gradient" />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px bg-accent-gradient" />
        </>
      ) : null}

      {!hideCaption && captionMode === "overlay" ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-white/14 bg-black/42 px-3 py-2 text-[0.58rem] uppercase tracking-[0.12em] text-ivory/72">
          <span className="block truncate">{image.caption}</span>
        </span>
      ) : null}
    </div>
  );

  const media = (
    <>
      {captionMode === "below" ? (
        <div className="space-y-2">
          {mediaFrame}
          {!hideCaption ? (
            <div className="space-y-1 px-1">
              <div className="h-px w-full bg-border/24" />
              <p className="text-[0.58rem] uppercase tracking-[0.13em] text-fg/58">{image.caption}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {captionMode === "side" ? (
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem]">
          {mediaFrame}
          {!hideCaption ? (
            <div className="self-end border-l border-border/24 pl-3 text-[0.58rem] uppercase tracking-[0.13em] text-fg/58">
              {image.caption}
            </div>
          ) : (
            <div aria-hidden />
          )}
        </div>
      ) : null}

      {captionMode === "overlay" ? mediaFrame : null}
    </>
  );

  return <>{media}</>;
}

function findProjectImage(project: ProjectDetail, index: number): ProjectImage {
  return project.images[index % project.images.length];
}

export function StickySplitShowcase({ project }: { project: ProjectDetail }): JSX.Element {
  const frames = project.timelineSteps.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const idx = Number((entry.target as HTMLElement).dataset.index || "0");
          setActiveIndex(idx);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.2 }
    );

    refs.current.forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, [frames.length]);

  const progress = frames.length > 1 ? activeIndex / (frames.length - 1) : 1;

  return (
    <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10">
      <aside className="space-y-5 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-fg/56">Template C</p>
        <h1 className="text-[clamp(2.1rem,4.8vw,4rem)] font-semibold leading-[0.98]">{project.title}</h1>
        <p className="text-sm text-fg/68 md:text-base">{brief(project.subtitle, 14)}</p>

        <div className="space-y-1 text-[0.64rem] uppercase tracking-[0.16em] text-fg/56">
          <p>{project.industry}</p>
          <p>{project.year}</p>
        </div>

        <div className="flex gap-4 pt-2">
          <div className="relative h-36 w-px overflow-hidden bg-border/30">
            <motion.span
              className="absolute inset-x-0 top-0 bg-accent-gradient"
              animate={{ height: `${Math.max(8, progress * 100)}%` }}
              transition={{ duration: 0.26, ease: EASE }}
            />
          </div>
          <ol className="space-y-2">
            {frames.map((frame, index) => (
              <li
                key={frame.title}
                className={cn(
                  "text-sm transition-colors duration-200",
                  activeIndex === index ? "text-fg" : "text-fg/54"
                )}
              >
                {frame.title}
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <div className="space-y-8">
        <div className="lg:sticky lg:top-24">
          <ProjectLightboxImage
            image={findProjectImage(project, activeIndex + 1)}
            className="aspect-[16/10]"
            sizes="(max-width: 1200px) 100vw, 760px"
            captionMode="overlay"
            priority
          />
        </div>

        <div className="space-y-8">
          {frames.map((step, index) => {
            const metric = project.metrics[index % project.metrics.length];
            return (
              <section
                key={step.title}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                data-index={index}
                className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]"
              >
                <article className="rounded-[1.1rem] border border-border/18 bg-card/78 p-5 shadow-[0_10px_24px_rgba(13,13,15,0.08)]">
                  <p className="text-[0.62rem] uppercase tracking-[0.15em] text-fg/56">{step.phase}</p>
                  <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-fg/68">{brief(step.body, 14)}</p>
                </article>

                <article className="self-start rounded-[1.1rem] border border-border/18 bg-bg/66 p-4">
                  <p className="text-[0.58rem] uppercase tracking-[0.15em] text-fg/56">{metric.label}</p>
                  <CountUpMetric
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    className="mt-2 block text-2xl font-semibold leading-none"
                  />
                  <p className="mt-2 text-xs text-fg/60">{brief(metric.note, 8)}</p>
                </article>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function GridFeatureTransform({ project }: { project: ProjectDetail }): JSX.Element {
  const visuals = project.images.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const idx = Number((entry.target as HTMLElement).dataset.index || "0");
          setActiveIndex(idx);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.28 }
    );

    refs.current.forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, [visuals.length]);

  const scrollToVisual = (index: number) => {
    refs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        {visuals.map((visual, index) => {
          const active = activeIndex === index;
          return (
            <button
              key={`${visual.src}-${index}`}
              type="button"
              className={cn(
                "group relative aspect-square overflow-hidden rounded-[1.1rem] border border-border/18 text-left shadow-[0_8px_20px_rgba(13,13,15,0.08)] ring-1 ring-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/55",
                active ? "ring-accentA/45" : "hover:ring-accentA/34"
              )}
              onClick={() => scrollToVisual(index)}
              aria-label={`Jump to ${visual.alt}`}
            >
              <Image src={visual.src} alt={visual.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 50vw, 260px" />
              <span aria-hidden className={cn("absolute inset-x-3 top-3 h-[2px] rounded-full bg-accent-gradient transition-opacity", active ? "opacity-100" : "opacity-0")} />
              <span className="absolute inset-x-0 bottom-0 bg-black/46 px-2 py-1 text-[0.56rem] uppercase tracking-[0.12em] text-ivory/72">
                {brief(visual.caption, 4)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-10">
        {visuals.map((visual, index) => {
          const active = activeIndex === index;
          return (
            <motion.section
              key={`${visual.src}-${index}-feature`}
              ref={(node) => {
                refs.current[index] = node;
              }}
              data-index={index}
              initial={{ opacity: 0, y: 22, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
              transition={{ duration: 0.44, ease: EASE }}
              className={cn("transition-all duration-300", active ? "opacity-100" : "opacity-82")}
            >
              <ProjectLightboxImage
                image={visual}
                className="aspect-[16/9]"
                captionMode={index % 2 === 0 ? "below" : "overlay"}
                sizes="(max-width: 1200px) 100vw, 980px"
                priority={index === 0}
              />
            </motion.section>
          );
        })}
      </div>
    </section>
  );
}

export function StoryboardLane({ project }: { project: ProjectDetail }): JSX.Element {
  const frames = project.images.slice(0, 7);
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const idx = Number((entry.target as HTMLElement).dataset.index || "0");
          setActiveIndex(idx);
        });
      },
      { rootMargin: "-44% 0px -44% 0px", threshold: 0.24 }
    );

    refs.current.forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, [frames.length]);

  const progress = frames.length > 1 ? activeIndex / (frames.length - 1) : 1;

  return (
    <section className="grid gap-6 lg:grid-cols-[74px_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:flex lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:flex-col lg:items-center">
        <div className="relative h-40 w-px overflow-hidden bg-border/30">
          <motion.span
            className="absolute inset-x-0 top-0 bg-fg/64"
            animate={{ height: `${Math.max(progress * 100, 8)}%` }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </div>
        <p className="mt-3 text-[0.58rem] uppercase tracking-[0.15em] text-fg/52">{Math.round(progress * 100)}%</p>
      </aside>

      <div className="space-y-5 md:space-y-6">
        {frames.map((image, index) => {
          const metric = project.metrics[index % project.metrics.length];
          return (
            <div key={`${image.src}-${index}`} className="space-y-3">
              <motion.article
                ref={(node) => {
                  refs.current[index] = node;
                }}
                data-index={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.44, ease: EASE, delay: index * 0.04 }}
              >
                <ProjectLightboxImage
                  image={image}
                  className={cn(index % 3 === 0 ? "aspect-[16/9]" : index % 3 === 1 ? "aspect-[5/4]" : "aspect-[4/5]")}
                  captionMode={index % 2 === 0 ? "overlay" : "below"}
                  sizes="(max-width: 1200px) 100vw, 900px"
                  priority={index === 0}
                />
              </motion.article>

              {index % 2 === 1 ? (
                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.36, ease: EASE }}
                  className="mx-auto inline-flex items-center gap-3 rounded-full border border-border/20 bg-bg/70 px-4 py-2"
                >
                  <span className="text-[0.58rem] uppercase tracking-[0.14em] text-fg/58">{metric.label}</span>
                  <CountUpMetric
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    className="text-sm font-semibold"
                  />
                  <span aria-hidden className="h-[2px] w-10 rounded-full bg-accent-gradient" />
                </motion.article>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
