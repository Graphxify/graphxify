"use client";

import Image from "next/image";
import { Dribbble, Instagram, Sparkles } from "lucide-react";
import { CountUpNumber } from "@/components/motion/count-up-number";
import { ScrollFillText } from "@/components/motion/scroll-fill-text";
import { cn } from "@/lib/utils";

const founderRoles = [
  { title: "Founder at Graphxify", period: "2024-Now" },
  { title: "Design Systems Consultant", period: "2022-2024" },
  { title: "Senior Product Designer", period: "2019-2022" },
  { title: "Visual Designer", period: "2016-2019" }
];

function AnimatedPeriod({ period, rowIndex }: { period: string; rowIndex: number }): JSX.Element {
  const pieces = period.split(/(\d{4})/g).filter(Boolean);
  let localNumberIndex = 0;

  return (
    <span className="tabular-nums">
      {pieces.map((piece) => {
        if (/^\d{4}$/.test(piece)) {
          const delay = rowIndex * 0.08 + localNumberIndex * 0.1;
          localNumberIndex += 1;
          return <CountUpNumber key={`${period}-${piece}-${localNumberIndex}`} to={Number(piece)} duration={1.05} delay={delay} className="tabular-nums" />;
        }
        return <span key={`${period}-${piece}`}>{piece}</span>;
      })}
    </span>
  );
}

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
    "Daniel leads Graphxify with a systems-first approach to branding, UX/UI, and web development. He partners directly with teams to create premium digital experiences that stay clear, scalable, and consistent.";

  return (
    <section className={cn("relative", className)}>
      {showIntroLabel ? <p className="mb-6 text-center text-[0.9rem] text-fg/54">(Intro)</p> : null}

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/20 bg-card/78 p-2.5">
          <div className="relative h-[19rem] overflow-hidden rounded-[1.65rem] sm:h-[22rem] md:h-[32rem]">
            <Image src="/assets/work-1.svg" alt="Daniel, founder of Graphxify" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 44vw" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(13,13,15,0)_35%,rgba(13,13,15,0.58)_100%)]" />
          </div>

          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 sm:bottom-5 sm:left-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/28 bg-bg/58 text-fg/74 backdrop-blur sm:h-10 sm:w-10">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/28 bg-bg/58 text-fg/74 backdrop-blur sm:h-10 sm:w-10">
              <Dribbble className="h-4 w-4" />
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/28 bg-bg/58 text-fg/74 backdrop-blur sm:h-10 sm:w-10">
              <Instagram className="h-4 w-4" />
            </span>
          </div>

        </div>

        <div className="section-shell border-border/20 bg-card/72 p-5 sm:p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-semibold md:text-4xl">The Founder</h2>
          {animateFounderCopy ? (
            <ScrollFillText text={founderCopy} className="mt-4 max-w-2xl text-base leading-relaxed text-fg/90 md:text-[1.18rem] md:leading-[1.5]" />
          ) : (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg/68 md:text-[1.18rem] md:leading-[1.5]">{founderCopy}</p>
          )}

          <div className="mt-8 border-t border-border/16 pt-7">
            <div className="space-y-3">
              {founderRoles.map((role, index) => (
                <div key={role.title} className="grid grid-cols-1 gap-1.5 border-b border-border/10 pb-3 text-[0.98rem] text-fg/78 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 md:text-[1.1rem]">
                  <p>{role.title}</p>
                  <p className="text-fg/56 sm:text-right">
                    <AnimatedPeriod period={role.period} rowIndex={index} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
