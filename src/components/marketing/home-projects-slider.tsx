"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type TransitionEvent,
  type WheelEvent
} from "react";
import { cn } from "@/lib/utils";
import { getProjectDisplayTitle } from "@/lib/project-card-content";

type HomeSliderProject = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  coverImage: string;
};

const GAP_PX = 18;
const DRAG_THRESHOLD_PX = 52;
const AUTOPLAY_MS = 5600;
const AUTOPLAY_RESUME_DELAY_MS = 1400;

function getPerView(width: number): number {
  if (width >= 1280) {
    return 2;
  }
  return 1;
}

function buildLoopSegment(items: HomeSliderProject[], count: number, fromEnd = false): HomeSliderProject[] {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    if (fromEnd) {
      const sourceIndex = (items.length - (count - index)) % items.length;
      return items[(sourceIndex + items.length) % items.length];
    }
    return items[index % items.length];
  });
}

function wrapIndex(value: number, total: number): number {
  return ((value % total) + total) % total;
}

export function HomeProjectsSlider({ projects }: { projects: HomeSliderProject[] }): JSX.Element {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const wheelLockRef = useRef(false);

  const [perView, setPerView] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [animateTrack, setAnimateTrack] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [autoplayBlockedUntil, setAutoplayBlockedUntil] = useState(0);

  const totalCards = projects.length;
  const carouselActive = totalCards > 1;
  const cloneCount = carouselActive ? perView : 0;

  const renderCards = useMemo(() => {
    if (!carouselActive) {
      return projects;
    }
    return [...buildLoopSegment(projects, cloneCount, true), ...projects, ...buildLoopSegment(projects, cloneCount, false)];
  }, [carouselActive, cloneCount, projects]);

  const baseIndex = carouselActive ? cloneCount : 0;
  const minRealTrackIndex = cloneCount;
  const maxRealTrackIndex = cloneCount + totalCards - 1;
  const minTrackIndex = minRealTrackIndex - 1;
  const maxTrackIndex = maxRealTrackIndex + 1;

  const normalizeTrackIndex = useCallback(
    (index: number): number => {
      if (!carouselActive) {
        return 0;
      }
      const logicalIndex = wrapIndex(index - cloneCount, totalCards);
      return logicalIndex + cloneCount;
    },
    [carouselActive, cloneCount, totalCards]
  );

  const sanitizeTrackIndex = useCallback(
    (index: number): number => {
      if (!carouselActive) {
        return 0;
      }

      const normalized = index < minTrackIndex || index > maxTrackIndex ? normalizeTrackIndex(index) : index;
      return Math.max(minTrackIndex, Math.min(maxTrackIndex, normalized));
    },
    [carouselActive, maxTrackIndex, minTrackIndex, normalizeTrackIndex]
  );

  useEffect(() => {
    const updatePerView = () => {
      setPerView(getPerView(window.innerWidth));
    };

    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
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
    setAnimateTrack(false);
    setTrackIndex(baseIndex);
    setDragOffset(0);

    const raf = window.requestAnimationFrame(() => {
      setAnimateTrack(true);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [baseIndex, totalCards, perView]);

  const activeIndex = carouselActive ? wrapIndex(trackIndex - cloneCount, totalCards) : 0;
  const indicatorCount = carouselActive ? totalCards : 1;

  const cardWidthPx = perView > 0 ? Math.max((viewportWidth - GAP_PX * (perView - 1)) / perView, 0) : 0;
  const stepPx = cardWidthPx + GAP_PX;
  const cardBasis = `calc((100% - ${(perView - 1) * GAP_PX}px) / ${perView})`;
  const trackTranslate = -(trackIndex * stepPx) + dragOffset;

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
      setAnimateTrack(true);
      setTrackIndex((prev) => {
        const safe = sanitizeTrackIndex(prev);
        const next = safe + direction;
        return Math.max(minTrackIndex, Math.min(maxTrackIndex, next));
      });
    },
    [carouselActive, maxTrackIndex, minTrackIndex, sanitizeTrackIndex]
  );

  const goNext = useCallback(() => moveTrack(1), [moveTrack]);
  const goPrev = useCallback(() => moveTrack(-1), [moveTrack]);

  const goToSlide = useCallback(
    (target: number) => {
      if (!carouselActive) {
        return;
      }
      const normalizedTarget = wrapIndex(target, totalCards);
      setAnimateTrack(true);
      setTrackIndex(() => minRealTrackIndex + normalizedTarget);
      queueAutoplayResume();
    },
    [carouselActive, minRealTrackIndex, queueAutoplayResume, totalCards]
  );

  useEffect(() => {
    if (!carouselActive || isHovering || isDragging) {
      return;
    }

    const now = Date.now();
    const waitBeforeResume = Math.max(0, autoplayBlockedUntil - now);
    const delay = waitBeforeResume > 0 ? waitBeforeResume : AUTOPLAY_MS;
    const id = window.setTimeout(() => moveTrack(1), delay);
    return () => window.clearTimeout(id);
  }, [autoplayBlockedUntil, carouselActive, isDragging, isHovering, moveTrack, trackIndex]);

  const onTrackTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!carouselActive || event.target !== event.currentTarget || event.propertyName !== "transform") {
      return;
    }

    if (trackIndex < minRealTrackIndex || trackIndex > maxRealTrackIndex) {
      const nextTrackIndex = normalizeTrackIndex(trackIndex);
      if (nextTrackIndex !== trackIndex) {
        setAnimateTrack(false);
        setTrackIndex(nextTrackIndex);
        window.requestAnimationFrame(() => setAnimateTrack(true));
      }
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!carouselActive) {
      return;
    }
    setTrackIndex((prev) => sanitizeTrackIndex(prev));
    dragStartXRef.current = event.clientX;
    setIsDragging(true);
    setAnimateTrack(false);
    setDragOffset(0);
    queueAutoplayResume();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartXRef.current === null) {
      return;
    }
    const offset = event.clientX - dragStartXRef.current;
    setDragOffset(Math.max(Math.min(offset, 170), -170));
  };

  const finishDrag = () => {
    if (!isDragging) {
      return;
    }
    const offset = dragOffset;
    setIsDragging(false);
    setDragOffset(0);
    setAnimateTrack(true);
    queueAutoplayResume();

    if (offset <= -DRAG_THRESHOLD_PX) {
      goNext();
      return;
    }
    if (offset >= DRAG_THRESHOLD_PX) {
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
    if (dominantDelta > 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!carouselActive) {
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      queueAutoplayResume();
      goNext();
      return;
    }
    if (event.key === "ArrowLeft") {
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
            disabled={!carouselActive}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[0.58rem] uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !carouselActive
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
            disabled={!carouselActive}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[0.58rem] uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !carouselActive
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
        aria-roledescription="carousel"
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
            animateTrack && "transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          )}
          style={{ transform: `translate3d(${trackTranslate}px,0,0)` }}
          onTransitionEnd={onTrackTransitionEnd}
        >
          {renderCards.map((project, index) => {
            const displayTitle = getProjectDisplayTitle(project.slug, project.title);
            return (
              <Link
                key={`${project.slug}-${index}`}
                href={`/works/${project.slug}`}
                aria-label={`Open project ${displayTitle}`}
                data-cursor-label="Open"
                className="group overflow-hidden rounded-[1.15rem] border border-border/18 shadow-[0_18px_36px_rgba(13,13,15,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                style={{ flex: `0 0 ${cardBasis}` }}
              >
                <article className="relative h-[18.5rem] overflow-hidden rounded-[1.15rem] md:h-[21rem]">
                  <Image
                    src={project.coverImage}
                    alt={displayTitle}
                    fill
                    className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.04] group-hover:blur-[1.8px] group-hover:brightness-[0.58]"
                    sizes="(max-width: 1279px) 100vw, 50vw"
                  />
                  <span className="absolute inset-0 bg-gradient-to-b from-black/78 via-black/30 to-black/66" />

                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/64 px-3 py-1 text-[0.56rem] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-gradient" />
                    {String(wrapIndex(index - cloneCount, Math.max(totalCards, 1)) + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute inset-x-4 bottom-4">
                    <div className="rounded-[0.92rem] border border-white/40 bg-black/64 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                      <p className="text-[0.58rem] uppercase tracking-[0.16em] text-white/80">{project.industry}</p>
                      <h3 className="mt-2 line-clamp-2 text-[1.32rem] font-semibold leading-[1.05] text-white md:text-[1.6rem]">
                        {displayTitle}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.14em] text-white/90">
                        Open Project
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1">
        {Array.from({ length: indicatorCount }).map((_, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={`home-slider-indicator-${index}`}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to project ${index + 1}`}
              aria-current={active ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                active ? "w-10 bg-accent-gradient" : "w-4 bg-border/30 hover:bg-border/50"
              )}
            />
          );
        })}
      </div>
    </section>
  );
}
