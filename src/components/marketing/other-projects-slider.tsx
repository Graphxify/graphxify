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
const AUTOPLAY_MS = 5400;
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
                : "border-border/26 bg-card/74 text-fg/74 hover:border-accentA/42 hover:text-fg"
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
                : "border-border/26 bg-card/74 text-fg/74 hover:border-accentA/42 hover:text-fg"
            )}
            aria-label="Next projects"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="overflow-hidden rounded-[1rem]"
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
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/works/${pathSlug}`}
                  aria-label={`Open project ${displayTitle}`}
                  data-cursor-label="Open"
                  className="group block overflow-hidden rounded-[1.05rem] border border-border/18 shadow-[0_14px_30px_rgba(13,13,15,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <article className="relative h-[16.5rem] overflow-hidden rounded-[1.05rem] md:h-[18.5rem]">
                    <Image
                      src={item.coverImage}
                      alt={displayTitle}
                      fill
                      loader={shouldBypassNextImageOptimization(item.coverImage) ? supabasePublicImageLoader : undefined}
                      className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.02] group-hover:brightness-[0.62]"
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    />
                    <span className="absolute inset-0 bg-black/12 transition-colors duration-500 group-hover:bg-black/38" />

                    <span className="absolute inset-x-4 bottom-4 z-10 transition-[opacity,transform] duration-200 group-hover:translate-y-2 group-hover:opacity-0">
                      <span className="text-sm font-medium text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:text-base">
                        {displayTitle}
                      </span>
                    </span>

                    <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-5 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-[1.45rem] font-semibold leading-tight text-ivory drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] md:text-[1.75rem]">
                        {displayTitle}
                      </span>
                    </span>
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
                      "block h-2 w-2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active
                        ? "scale-110 bg-accentA opacity-100 shadow-[0_0_0_1px_rgba(0,163,255,0.24),0_0_12px_rgba(0,82,204,0.18)]"
                        : "bg-accentA/35 opacity-70 hover:opacity-100"
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
