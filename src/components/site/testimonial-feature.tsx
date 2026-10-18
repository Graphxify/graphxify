"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeatureTestimonial = { id: string; name: string; role: string; quote: string; rating?: number };

/** One quote in full at a time; the client names are the controls. */
export function TestimonialFeature({ items }: { items: FeatureTestimonial[] }): JSX.Element | null {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const current = items[Math.min(index, items.length - 1)];

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-9 md:col-start-4">
        <figure key={current.id} className="animate-[fadeIn_500ms_ease-out]" aria-live="polite">
          {current.rating ? (
            <p className="flex items-center gap-1" role="img" aria-label={`${current.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} aria-hidden="true" className={cn("h-4 w-4", i < Math.round(current.rating ?? 0) ? "fill-fg text-fg" : "text-fg/20")} />
              ))}
            </p>
          ) : null}
          <blockquote className="mt-6 max-w-[30ch] text-[clamp(1.625rem,3.2vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.035em] text-fg">
            &ldquo;{current.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-8 text-[0.9375rem]">
            <span className="font-medium text-fg">{current.name}</span>
            <span className="text-fg/60">, {current.role}</span>
          </figcaption>
        </figure>

        {items.length > 1 ? (
          <div role="group" aria-label="Choose a testimonial" className="mt-12 flex flex-wrap gap-2 border-t border-border/10 pt-6">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "rounded-full px-4 py-2 text-[0.875rem] transition-colors duration-200",
                  i === index ? "bg-fg text-white" : "bg-surface text-fg/70 hover:text-fg"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
