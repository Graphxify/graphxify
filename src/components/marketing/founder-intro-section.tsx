"use client";

import Image from "next/image";
import { Database, Layers3, LayoutTemplate } from "lucide-react";
import { ScrollFillText } from "@/components/motion/scroll-fill-text";
import { cn } from "@/lib/utils";

const focusItems = [
  {
    title: "Brand Systems",
    description: "Identity frameworks built to scale.",
    Icon: Layers3
  },
  {
    title: "Web Platforms",
    description: "Design and development aligned.",
    Icon: LayoutTemplate
  },
  {
    title: "Structured CMS",
    description: "Content systems with long-term flexibility.",
    Icon: Database
  }
] as const;

export function FounderIntroSection({
  className,
  showIntroLabel = true,
  animateFounderCopy = false
}: {
  className?: string;
  showIntroLabel?: boolean;
  animateFounderCopy?: boolean;
}): JSX.Element {
  const founderCopy =
    "Graphxify is a design and development studio focused on structured brand and web systems. We align identity, interface, and architecture into one cohesive platform - built for clarity, consistency, and long-term growth.";

  return (
    <section className={cn("relative", className)}>
      {showIntroLabel ? <p className="mb-6 text-center text-[0.9rem] text-fg/54">(Intro)</p> : null}

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/20 bg-card/78 p-2.5">
          <div className="relative h-[19rem] overflow-hidden rounded-[1.65rem] sm:h-[22rem] md:h-[32rem]">
            <Image
              src="/assets/work-1.svg"
              alt="Graphxify brand and web systems preview"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 44vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(13,13,15,0)_35%,rgba(13,13,15,0.58)_100%)]" />
          </div>

        </div>

        <div className="section-shell border-border/20 bg-card/72 p-5 sm:p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-semibold md:text-4xl">Built on Structure. Designed to Scale.</h2>
          {animateFounderCopy ? (
            <ScrollFillText text={founderCopy} className="mt-4 max-w-2xl text-base leading-relaxed text-fg/90 md:text-[1.18rem] md:leading-[1.5]" />
          ) : (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg/68 md:text-[1.18rem] md:leading-[1.5]">{founderCopy}</p>
          )}

          <div className="mt-7 border-t border-border/16 pt-5">
            <p className="text-[0.66rem] uppercase tracking-[0.16em] text-fg/58">Our Focus</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {focusItems.map((item) => {
                const Icon = item.Icon;
                return (
                  <article
                    key={item.title}
                    className="group rounded-xl border border-border/16 bg-bg/44 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/28"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-accentA/30 bg-accentA/8 text-accentA transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-[0_0_0_3px_rgba(0,163,255,0.12)]">
                      <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <p className="mt-2.5 text-[0.98rem] font-medium text-fg/92">{item.title}</p>
                    <p className="mt-1 text-sm text-fg/62">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
