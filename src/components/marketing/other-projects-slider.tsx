"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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
import { shouldBypassNextImageOptimization, supabasePublicImageLoader } from "@/lib/content-helpers";
import { cn } from "@/lib/utils";
import { getProjectDisplayTitle, getProjectPathSlug } from "@/lib/project-card-content";

type SliderProject = {
  slug: string;
  title: string;
  coverImage: string;
};

const GAP_PX = 16;
const DRAG_THRESHOLD_PX = 52;
const AUTOPLAY_MS = 4400;
const AUTOPLAY_RESUME_DELAY_MS = 1400;

function getPerView(width: number): number {
  if (width >= 1024) {
    return 3;
  }
  if (width >= 768) {
    return 2;
  }
  return 1;
}

export function OtherProjectsSlider({ projects }: { projects: SliderProject[] }): JSX.Element {
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

  const uniqueProjects = useMemo(() => {
    const bySlug = new Map<string, SliderProject>();
    for (const project of projects) {
      if (!bySlug.has(project.slug)) {
        bySlug.set(project.slug, project);
      }
    }
    return Array.from(bySlug.values());
  }, [projects]);

  const totalCards = uniqueProjects.length;
  if (totalCards === 0) {
    return <section className="space-y-4" aria-label="Other projects carousel" />;
  }

  const displayPerView = Math.max(Math.min(perView, totalCards), 1);
  const maxStartIndex = Math.max(totalCards - displayPerView, 0);
  const carouselActive = maxStartIndex > 0;
  const canGoPrev = trackIndex > 0;
  const canGoNext = trackIndex < maxStartIndex;

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
  }, [clampIndex, displayPerView]);

  useEffect(() => {
    if (trackIndex >= maxStartIndex) {
      setAutoplayDirection(-1);
      return;
    }

    if (trackIndex <= 0) {
      setAutoplayDirection(1);
    }
  }, [maxStartIndex, trackIndex]);

  const cardWidthPx =
    displayPerView > 0 ? Math.max((viewportWidth - GAP_PX * (displayPerView - 1)) / displayPerView, 0) : 0;
  const stepPx = cardWidthPx + GAP_PX;
  const cardBasis = `calc((100% - ${(displayPerView - 1) * GAP_PX}px) / ${displayPerView})`;
  const trackTranslate = -(trackIndex * stepPx) + dragOffset;
  const dotCount = carouselActive ? maxStartIndex + 1 : 1;

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

  const goNext = useCallback(() => {
    moveTrack(1);
  }, [moveTrack]);

  const goPrev = useCallback(() => {
    moveTrack(-1);
  }, [moveTrack]);

  const goToLogicalSlide = useCallback(
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
    const minOffset = canGoNext ? -160 : 0;
    const maxOffset = canGoPrev ? 160 : 0;
    const clamped = Math.max(Math.min(offset, maxOffset), minOffset);
    setDragOffset(clamped);
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
    window.setTimeout(() => {
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
      goNext();
      return;
    }

    if (event.key === "ArrowLeft" && canGoPrev) {
      event.preventDefault();
      goPrev();
    }
  };

  const onDotKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!carouselActive) {
      return;
    }

    if (event.key === "ArrowRight" && canGoNext) {
      event.preventDefault();
      goNext();
      return;
    }

    if (event.key === "ArrowLeft" && canGoPrev) {
      event.preventDefault();
      goPrev();
    }
  };

  return (
    <section
      className="space-y-4"
      aria-label="Other projects carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-fg/56">Other Projects</p>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !canGoPrev
                ? "cursor-not-allowed border-border/18 bg-card/54 text-fg/34"
                : "border-border/26 bg-card/74 text-fg/74 hover:border-accentA/42 hover:bg-accent-gradient hover:text-ivory"
            )}
            aria-label="Previous projects"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !canGoNext
                ? "cursor-not-allowed border-border/18 bg-card/54 text-fg/34"
                : "border-border/26 bg-card/74 text-fg/74 hover:border-accentA/42 hover:bg-accent-gradient hover:text-ivory"
            )}
            aria-label="Next projects"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="overflow-hidden rounded-2xl"
        role="region"
        aria-label="Other projects"
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
            "flex gap-4 will-change-transform",
            !isDragging && "transition-transform duration-[560ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          )}
          style={{ transform: `translate3d(${trackTranslate}px,0,0)` }}
        >
          {uniqueProjects.map((item, index) => {
            const displayTitle = getProjectDisplayTitle(item.slug, item.title);
            const pathSlug = getProjectPathSlug(item.slug);

            return (
              <motion.div
                key={`${item.slug}-${index}`}
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
                  className="group relative block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/55 focus-visible:ring-offset-3 focus-visible:ring-offset-bg"
                >
                  <article className="relative h-[16.5rem] overflow-hidden rounded-2xl border border-border/20 text-white shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-accentA/28 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.26),0_0_0_1px_rgba(0,163,255,0.1)] md:h-[18.5rem]">
                    {/* Image */}
                    <Image
                      src={item.coverImage}
                      alt={displayTitle}
                      fill
                      loader={shouldBypassNextImageOptimization(item.coverImage) ? supabasePublicImageLoader : undefined}
                      className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-[0.48]"
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    />

                    {/* Gradient scrim — concentrated at bottom for title legibility */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.68) 42%, rgba(0,0,0,0.18) 68%, transparent 100%)" }} />

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
                      {/* Title — always visible */}
                      <h3 className="line-clamp-2 text-[1.02rem] font-semibold leading-[1.12] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 md:text-[1.12rem]">
                        {displayTitle}
                      </h3>

                      {/* Accent rule — expands on hover */}
                      <div className="mt-2.5 h-px w-6 origin-left rounded-full bg-white/20 opacity-0 transition-[width,background-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:40ms] group-hover:w-9 group-hover:bg-accentA/55 group-hover:opacity-100" />

                      {/* CTA — revealed on hover */}
                      <div className="mt-2 inline-flex items-center gap-1.5 opacity-0 transition-[opacity,gap] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:80ms] group-hover:gap-2 group-hover:opacity-100">
                        <span className="text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-accentA/88">Open Project</span>
                        <svg className="h-2.5 w-2.5 text-accentA/88 transition-transform duration-300 group-hover:translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
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

      <div className="flex justify-center pt-2">
        <div className="w-fit">
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: dotCount }).map((_, index) => {
              const active = index === trackIndex;
              return (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => goToLogicalSlide(index)}
                  onKeyDown={onDotKeyDown}
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
        </div>
      </div>
    </section>
  );
}
