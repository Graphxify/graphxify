"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TransitionEvent,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent
} from "react";
import { cn } from "@/lib/utils";

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

function buildLoopSegment(items: SliderProject[], count: number, fromEnd = false): SliderProject[] {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  const segment = Array.from({ length: count }, (_, index) => {
    if (fromEnd) {
      const sourceIndex = (items.length - (count - index)) % items.length;
      return items[(sourceIndex + items.length) % items.length];
    }
    return items[index % items.length];
  });

  return segment;
}

function wrapIndex(value: number, total: number): number {
  return ((value % total) + total) % total;
}

export function OtherProjectsSlider({ projects }: { projects: SliderProject[] }): JSX.Element {
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
    const prefix = buildLoopSegment(projects, cloneCount, true);
    const suffix = buildLoopSegment(projects, cloneCount, false);
    return [...prefix, ...projects, ...suffix];
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
  const dotCount = carouselActive ? totalCards : 1;
  const activeDotIndex = carouselActive ? activeIndex : 0;

  const cardWidthPx = perView > 0 ? Math.max((viewportWidth - GAP_PX * (perView - 1)) / perView, 0) : 0;
  const stepPx = cardWidthPx + GAP_PX;
  const cardBasis = `calc((100% - ${(perView - 1) * GAP_PX}px) / ${perView})`;

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

  const goNext = useCallback(() => {
    moveTrack(1);
  }, [moveTrack]);

  const goPrev = useCallback(() => {
    moveTrack(-1);
  }, [moveTrack]);

  const queueAutoplayResume = useCallback(() => {
    if (!carouselActive) {
      return;
    }
    setAutoplayBlockedUntil(Date.now() + AUTOPLAY_RESUME_DELAY_MS);
  }, [carouselActive]);

  const goToLogicalSlide = useCallback(
    (target: number) => {
      if (!carouselActive) {
        return;
      }

      const normalizedTarget = wrapIndex(target, totalCards);
      setAnimateTrack(true);
      setTrackIndex((prev) => {
        const safe = sanitizeTrackIndex(prev);
        const targetTrackIndex = minRealTrackIndex + normalizedTarget;

        if (safe === targetTrackIndex) {
          return safe;
        }

        return targetTrackIndex;
      });
    },
    [carouselActive, minRealTrackIndex, sanitizeTrackIndex, totalCards]
  );

  useEffect(() => {
    if (!carouselActive || isHovering || isDragging) {
      return;
    }

    const now = Date.now();
    const waitBeforeResume = Math.max(0, autoplayBlockedUntil - now);
    const delay = waitBeforeResume > 0 ? waitBeforeResume : AUTOPLAY_MS;

    const id = window.setTimeout(() => {
      moveTrack(1);
    }, delay);

    return () => window.clearTimeout(id);
  }, [autoplayBlockedUntil, carouselActive, isDragging, isHovering, moveTrack, trackIndex]);

  const onTrackTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!carouselActive || event.target !== event.currentTarget || event.propertyName !== "transform") {
      return;
    }

    const outOfLoopRange = trackIndex < minRealTrackIndex || trackIndex > maxRealTrackIndex;

    if (!outOfLoopRange) {
      return;
    }

    const nextTrackIndex = normalizeTrackIndex(trackIndex);
    if (nextTrackIndex === trackIndex) {
      return;
    }

    setAnimateTrack(false);
    setTrackIndex(nextTrackIndex);
    window.requestAnimationFrame(() => setAnimateTrack(true));
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
    let minOffset = -160;
    let maxOffset = 160;

    if (trackIndex <= minTrackIndex) {
      maxOffset = 0;
    }

    if (trackIndex >= maxTrackIndex) {
      minOffset = 0;
    }

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
      goNext();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  const onDotKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!carouselActive) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  const trackTranslate = -(trackIndex * stepPx) + dragOffset;

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
            disabled={!carouselActive}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !carouselActive
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
            disabled={!carouselActive}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              !carouselActive
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
        aria-roledescription="carousel"
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
            animateTrack && "transition-transform duration-[560ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          )}
          style={{ transform: `translate3d(${trackTranslate}px,0,0)` }}
          onTransitionEnd={onTrackTransitionEnd}
        >
          {renderCards.map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/works/${item.slug}`}
              aria-label={`Open project ${item.title}`}
              data-cursor-label="Open"
              className="group overflow-hidden rounded-[1.05rem] border border-border/18 shadow-[0_14px_30px_rgba(13,13,15,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              style={{ flex: `0 0 ${cardBasis}` }}
            >
              <article className="relative h-[16.5rem] overflow-hidden rounded-[1.05rem] md:h-[18.5rem]">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:blur-[2px] group-hover:brightness-[0.55]"
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                />
                <span className="absolute inset-0 bg-black/12 transition-colors duration-500 group-hover:bg-black/38" />

                <span className="absolute inset-x-4 bottom-4 z-10 transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0">
                  <span className="text-sm font-medium text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:text-base">
                    {item.title}
                  </span>
                </span>

                <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-5 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-[1.45rem] font-semibold leading-tight text-ivory drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] md:text-[1.75rem]">
                    {item.title}
                  </span>
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <div className="w-fit">
          <div className="flex items-center justify-center gap-2.5">
            {Array.from({ length: dotCount }).map((_, index) => {
              const active = index === activeDotIndex;
              return (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => goToLogicalSlide(index)}
                  onKeyDown={onDotKeyDown}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative h-2 w-2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    active
                      ? "scale-110 bg-accentA opacity-100 shadow-[0_0_0_1px_rgba(0,163,255,0.24),0_0_12px_rgba(0,82,204,0.18)]"
                      : "bg-accentA/35 opacity-70 hover:opacity-100"
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}
