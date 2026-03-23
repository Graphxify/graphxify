"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent
} from "react";
import {
  createSupabasePublicImageLoader,
  shouldBypassNextImageOptimization
} from "@/lib/content-helpers";
import { cn } from "@/lib/utils";
import { getProjectDisplayTitle, getProjectPathSlug } from "@/lib/project-card-content";

type HomeSliderProject = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  coverImage: string;
};

const GAP_PX = 18;
const DRAG_THRESHOLD_PX = 52;
const AUTOPLAY_MS = 4600;
const AUTOPLAY_RESUME_DELAY_MS = 1400;

function getPerView(width: number): number {
  if (width >= 1280) {
    return 2;
  }
  return 1;
}

export function HomeProjectsSlider({ projects }: { projects: HomeSliderProject[] }): JSX.Element {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const wheelLockRef = useRef(false);

  const [perView, setPerView] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [autoplayBlockedUntil, setAutoplayBlockedUntil] = useState(0);
  const [autoplayDirection, setAutoplayDirection] = useState<1 | -1>(1);

  const totalCards = projects.length;
  const maxStartIndex = Math.max(totalCards - perView, 0);
  const carouselActive = maxStartIndex > 0;

  const clampIndex = useCallback(
    (value: number) => {
      return Math.max(0, Math.min(maxStartIndex, value));
    },
    [maxStartIndex]
  );

  useEffect(() => {
    const updatePerView = () => {
      setPerView(getPerView(window.innerWidth));
    };

    updatePerView();
    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePerView);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setViewportWidth(nextWidth);
    });

    observer.observe(node);
    setViewportWidth(node.clientWidth);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setTrackIndex((current) => clampIndex(current));
    setDragOffset(0);
  }, [clampIndex, perView]);

  useEffect(() => {
    if (trackIndex >= maxStartIndex) {
      setAutoplayDirection(-1);
      return;
    }

    if (trackIndex <= 0) {
      setAutoplayDirection(1);
    }
  }, [maxStartIndex, trackIndex]);

  const cardWidthPx = perView > 0 ? Math.max((viewportWidth - GAP_PX * (perView - 1)) / perView, 0) : 0;
  const stepPx = cardWidthPx + GAP_PX;
  const cardBasis = `calc((100% - ${(perView - 1) * GAP_PX}px) / ${perView})`;
  const trackTranslate = -(trackIndex * stepPx) + dragOffset;
  const indicatorCount = carouselActive ? maxStartIndex + 1 : 1;
  const canGoPrev = trackIndex > 0;
  const canGoNext = trackIndex < maxStartIndex;
  const resolvedImageSizes =
    cardWidthPx > 0
      ? `${Math.max(1, Math.ceil(cardWidthPx))}px`
      : "(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1279px) calc(100vw - 4rem), calc((100vw - 5.5rem) / 2)";
  const homeProjectImageLoader = useMemo(
    () =>
      createSupabasePublicImageLoader({
        maxWidth: perView === 1 ? 640 : 1440,
        quality: perView === 1 ? 68 : 72,
        resize: "cover"
      }),
    [perView]
  );

  const queueAutoplayResume = useCallback(() => {
    if (!carouselActive) {
      return;
    }
    setAutoplayBlockedUntil(Date.now() + AUTOPLAY_RESUME_DELAY_MS);
  }, [carouselActive]);

  const moveTrack = useCallback(
    (direction: 1 | -1) => {
      if (!carouselActive) {
        return;
      }
      setTrackIndex((prev) => clampIndex(prev + direction));
    },
    [carouselActive, clampIndex]
  );

  const goNext = useCallback(() => moveTrack(1), [moveTrack]);
  const goPrev = useCallback(() => moveTrack(-1), [moveTrack]);

  const goToSlide = useCallback(
    (target: number) => {
      if (!carouselActive) {
        return;
      }
      setTrackIndex(clampIndex(target));
      queueAutoplayResume();
    },
    [carouselActive, clampIndex, queueAutoplayResume]
  );

  useEffect(() => {
    if (!carouselActive || isHovering || isDragging) {
      return;
    }

    const now = Date.now();
    const waitBeforeResume = Math.max(0, autoplayBlockedUntil - now);
    const delay = waitBeforeResume > 0 ? waitBeforeResume : AUTOPLAY_MS;
    const id = window.setTimeout(() => {
      const nextDirection = trackIndex >= maxStartIndex ? -1 : trackIndex <= 0 ? 1 : autoplayDirection;
      setAutoplayDirection(nextDirection);
      moveTrack(nextDirection);
    }, delay);
    return () => window.clearTimeout(id);
  }, [autoplayBlockedUntil, autoplayDirection, carouselActive, isDragging, isHovering, maxStartIndex, moveTrack, trackIndex]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!carouselActive) {
      return;
    }
    dragStartXRef.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
    queueAutoplayResume();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartXRef.current === null) {
      return;
    }

    const offset = event.clientX - dragStartXRef.current;
    const minOffset = canGoNext ? -170 : 0;
    const maxOffset = canGoPrev ? 170 : 0;
    setDragOffset(Math.max(Math.min(offset, maxOffset), minOffset));
  };

  const finishDrag = () => {
    if (!isDragging) {
      return;
    }

    const offset = dragOffset;
    setIsDragging(false);
    setDragOffset(0);
    queueAutoplayResume();

    if (offset <= -DRAG_THRESHOLD_PX && canGoNext) {
      goNext();
      return;
    }

    if (offset >= DRAG_THRESHOLD_PX && canGoPrev) {
      goPrev();
    }
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!carouselActive) {
      return;
    }

    const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(dominantDelta) < 26 || wheelLockRef.current) {
      return;
    }

    wheelLockRef.current = true;
    setTimeout(() => {
      wheelLockRef.current = false;
    }, 360);

    queueAutoplayResume();
    if (dominantDelta > 0 && canGoNext) {
      goNext();
    } else if (dominantDelta < 0 && canGoPrev) {
      goPrev();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!carouselActive) {
      return;
    }

    if (event.key === "ArrowRight" && canGoNext) {
      event.preventDefault();
      queueAutoplayResume();
      goNext();
      return;
    }

    if (event.key === "ArrowLeft" && canGoPrev) {
      event.preventDefault();
      queueAutoplayResume();
      goPrev();
    }
  };

  return (
    <section
      className="space-y-4"
      aria-label="Projects slider"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-fg/56">Featured Projects Slider</p>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-bg/62 p-1.5">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[0.58rem] uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !canGoPrev
                ? "cursor-not-allowed border-border/18 bg-card/54 text-fg/34"
                : "border-border/24 bg-card/74 text-fg/74 hover:border-accentA/42 hover:bg-accent-gradient hover:text-ivory"
            )}
            aria-label="Previous project"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Prev
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[0.58rem] uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !canGoNext
                ? "cursor-not-allowed border-border/18 bg-card/54 text-fg/34"
                : "border-border/24 bg-card/74 text-fg/74 hover:border-accentA/42 hover:bg-accent-gradient hover:text-ivory"
            )}
            aria-label="Next project"
          >
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="overflow-hidden rounded-[1.2rem]"
        role="region"
        aria-label="Home projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerLeave={finishDrag}
        onWheel={onWheel}
      >
        <div
          className={cn(
            "flex gap-[18px] will-change-transform",
            !isDragging && "transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          )}
          style={{ transform: `translate3d(${trackTranslate}px,0,0)` }}
        >
          {projects.map((project, index) => {
            const displayTitle = getProjectDisplayTitle(project.slug, project.title);
            const pathSlug = getProjectPathSlug(project.slug);

            return (
              <motion.div
                key={`${project.slug}-${index}`}
                className="relative origin-center will-change-transform"
                style={{ flex: `0 0 ${cardBasis}` }}
                whileHover={{ y: -5, scale: 1.012 }}
                whileTap={{ scale: 0.988 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/works/${pathSlug}`}
                  aria-label={`Open project ${displayTitle}`}
                  data-cursor-label="Open"
                  className="group block overflow-hidden rounded-[1.15rem] border border-border/22 shadow-[0_4px_24px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg group-hover:border-accentA/28 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,163,255,0.1)]"
                >
                  <article className="relative h-[18.5rem] overflow-hidden rounded-[1.15rem] text-white md:h-[21rem]">
                    {/* Image */}
                    <Image
                      src={project.coverImage}
                      alt={displayTitle}
                      fill
                      loader={shouldBypassNextImageOptimization(project.coverImage) ? homeProjectImageLoader : undefined}
                      className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-[0.5]"
                      sizes={resolvedImageSizes}
                    />

                    {/* Gradient scrim — strong at bottom, clears at top */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/6" />

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 md:p-6">

                      {/* Industry label */}
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent-gradient px-2.5 py-[0.24rem] shadow-[0_2px_10px_rgba(0,163,255,0.28)] backdrop-blur-sm transition-[box-shadow,opacity] duration-400 group-hover:shadow-[0_0_18px_rgba(0,163,255,0.48)]">
                        <span className="h-[3px] w-[3px] rounded-full bg-white/70" aria-hidden="true" />
                        <span className="text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-white/95">{project.industry}</span>
                      </div>

                      {/* Title */}
                      <h3 className="line-clamp-2 text-[1.38rem] font-semibold leading-[1.06] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-[1.62rem]">
                        {displayTitle}
                      </h3>

                      {/* Accent rule — expands on hover */}
                      <div className="mt-3 h-px w-7 origin-left rounded-full bg-white/20 transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-10 group-hover:bg-accentA/55" />

                      {/* CTA */}
                      <div className="mt-2.5 inline-flex items-center gap-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-white/48 transition-[color,gap] duration-300 group-hover:gap-2.5 group-hover:text-accentA/88">
                        <span>Open Project</span>
                        <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
                      </div>
                    </div>

                    {/* Bottom accent bar — sweeps in on hover */}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-accentA to-accentB transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-1">
        {Array.from({ length: indicatorCount }).map((_, index) => {
          const active = index === trackIndex;
          return (
            <button
              key={`home-slider-indicator-${index}`}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={active}
              className="flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span
                className={cn(
                  "block h-1.5 w-4 rounded-full transition-[transform,background-color,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  active
                    ? "scale-x-[2.5] bg-accent-gradient"
                    : "bg-border/30 opacity-80 hover:bg-border/50 hover:opacity-100"
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
