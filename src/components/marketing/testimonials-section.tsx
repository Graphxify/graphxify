"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { testimonials as fallbackTestimonials } from "@/lib/constants";

type TestimonialInput = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

type TestimonialMetricInput = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
};

/* ── Star rating display ── */
function Stars({ count = 5 }: { count?: number }): JSX.Element {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-[#e8732a] text-[#e8732a]" : "fill-border/20 text-border/30"}`}
          strokeWidth={0}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/* ── Single testimonial card ── */
function TestimonialCard({ item }: { item: TestimonialInput }): JSX.Element {
  const initials = item.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className="relative flex w-[340px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-border/10 bg-card/80 p-7 sm:w-[380px]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(128,128,128,0.06) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {/* Stars */}
      <div>
        <Stars count={item.rating ?? 5} />
        <blockquote className="mt-4 text-[0.92rem] leading-relaxed text-fg/78">
          &ldquo;{item.quote}&rdquo;
        </blockquote>
      </div>

      {/* Attribution */}
      <footer className="mt-6 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accentA/80 to-accentA/50 text-xs font-semibold text-white/90">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg/90">{item.name}</p>
          <p className="truncate text-xs text-fg/48">{item.role}</p>
        </div>
      </footer>
    </article>
  );
}

/* ── Infinite marquee row ── */
function MarqueeRow({
  items,
  reverse = false,
  speed = 40,
}: {
  items: TestimonialInput[];
  reverse?: boolean;
  speed?: number;
}): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstGroupRef = useRef<HTMLDivElement | null>(null);
  const hoveredRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const loopDistanceRef = useRef(0);
  const offsetRef = useRef(0);
  const velocityRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (trackRef.current) {
        trackRef.current.style.transform = "translate3d(0, 0, 0)";
      }
      return;
    }

    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;

    if (!track || !firstGroup) {
      return;
    }

    const hoverDuration = speed * 1.8;

    const normalizeOffset = (offset: number, distance: number): number => {
      if (distance <= 0) {
        return 0;
      }

      if (reverse) {
        while (offset >= 0) {
          offset -= distance;
        }
        while (offset < -distance) {
          offset += distance;
        }
        return offset;
      }

      while (offset <= -distance) {
        offset += distance;
      }
      while (offset > 0) {
        offset -= distance;
      }
      return offset;
    };

    const updateMetrics = () => {
      const computedTrack = window.getComputedStyle(track);
      const gap = Number.parseFloat(computedTrack.columnGap || computedTrack.gap || "0") || 0;
      const nextDistance = firstGroup.offsetWidth + gap;

      if (!nextDistance) {
        return;
      }

      const previousDistance = loopDistanceRef.current;
      loopDistanceRef.current = nextDistance;

      if (!initializedRef.current) {
        offsetRef.current = reverse ? -nextDistance : 0;
        velocityRef.current = nextDistance / speed;
        initializedRef.current = true;
      } else if (previousDistance > 0) {
        if (reverse) {
          const progress = (offsetRef.current + previousDistance) / previousDistance;
          offsetRef.current = -nextDistance + progress * nextDistance;
        } else {
          const progress = -offsetRef.current / previousDistance;
          offsetRef.current = -progress * nextDistance;
        }
        offsetRef.current = normalizeOffset(offsetRef.current, nextDistance);
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    updateMetrics();

    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
    });

    resizeObserver.observe(firstGroup);

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (loopDistanceRef.current > 0) {
        const targetVelocity = loopDistanceRef.current / (hoveredRef.current ? hoverDuration : speed);
        const currentVelocity = velocityRef.current ?? targetVelocity;
        velocityRef.current = currentVelocity + (targetVelocity - currentVelocity) * Math.min(1, dt * 6);
        offsetRef.current += (reverse ? 1 : -1) * velocityRef.current * dt;
        offsetRef.current = normalizeOffset(offsetRef.current, loopDistanceRef.current);
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      resizeObserver.disconnect();
      frameRef.current = null;
      lastTimeRef.current = null;
      loopDistanceRef.current = 0;
      velocityRef.current = null;
      initializedRef.current = false;
    };
  }, [items, prefersReducedMotion, reverse, speed]);

  return (
    <div
      className="relative overflow-hidden"
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent md:w-28" />

      <div ref={trackRef} className="flex w-max gap-4 will-change-transform">
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div
            key={`group-${groupIndex}`}
            ref={groupIndex === 0 ? firstGroupRef : null}
            className="flex shrink-0 gap-4"
            aria-hidden={groupIndex > 0 ? true : undefined}
          >
            {items.map((item) => (
              <TestimonialCard key={`${groupIndex}-${item.id}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection({
  items,
  metrics: _metrics,
  showLeadText: _showLeadText = true,
  singleRow = false,
}: {
  items?: TestimonialInput[];
  metrics?: TestimonialMetricInput[];
  showLeadText?: boolean;
  singleRow?: boolean;
}): JSX.Element {
  const reducedMotion = useReducedMotion();

  const slides = useMemo<TestimonialInput[]>(() => {
    const source = Array.isArray(items) && items.length > 0 ? items : fallbackTestimonials;
    return source.map((item) => ({
      id: item.id,
      quote: item.quote,
      name: item.name,
      role: item.role,
      rating: "rating" in item ? (item as TestimonialInput).rating : 5,
    }));
  }, [items]);

  if (slides.length === 0) {
    return (
      <section className="py-12 text-center">
        <p className="text-fg/48">Testimonials will appear here once added.</p>
      </section>
    );
  }

  /* Split items into two rows */
  const mid = Math.ceil(slides.length / 2);
  const row1 = slides.length > 1 ? slides.slice(0, mid) : slides;
  const row2 = slides.length > 1 ? slides.slice(mid) : slides;

  return (
    <section className="relative py-2 md:py-4">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 30 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4"
      >
        {/* Row 1 — scrolls left */}
        <MarqueeRow items={singleRow ? slides : row1} speed={50} />

        {/* Row 2 — scrolls right (hidden in singleRow mode) */}
        {!singleRow && (
          <MarqueeRow items={row2.length > 0 ? row2 : row1} reverse speed={55} />
        )}
      </motion.div>
    </section>
  );
}
