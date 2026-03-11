"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { useMemo } from "react";
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
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-[#e8732a] text-[#e8732a]" : "fill-border/20 text-border/30"}`}
          strokeWidth={0}
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
      className="relative flex w-[340px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-border/10 bg-card/80 p-7 backdrop-blur-sm sm:w-[380px]"
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
  /* Duplicate items enough times for seamless loop */
  const duped = [...items, ...items, ...items];

  return (
    <div className="group relative overflow-hidden">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent md:w-28" />

      <div
        className={`flex w-max gap-4 will-change-transform ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } group-hover:[animation-play-state:paused] motion-reduce:animate-none`}
        style={{ animationDuration: `${speed}s` }}
      >
        {duped.map((item, i) => (
          <TestimonialCard key={`${item.id}-${i}`} item={item} />
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
