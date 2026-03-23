"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

type SmoothWindow = Window & {
  __graphxifySmoothScrollTo?: (top: number) => void;
};

export function BackToTop(): JSX.Element {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = Math.max(doc.scrollHeight - window.innerHeight, 0);
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      const percent = Math.round(Math.max(0, Math.min(1, progress)) * 100);

      setScrollPercent(percent);
      setShowArrow(percent >= 99);
      frameId = 0;
    };

    const onScroll = () => {
      if (frameId !== 0) {
        return;
      }
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] md:bottom-7 md:right-7">
      <div className="relative h-14 w-14 md:h-16 md:w-16">
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => {
            const smoothWindow = window as SmoothWindow;
            if (typeof smoothWindow.__graphxifySmoothScrollTo === "function") {
              smoothWindow.__graphxifySmoothScrollTo(0);
              return;
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="pointer-events-auto group absolute inset-0 inline-flex items-center justify-center rounded-full border border-border/24 bg-bg/70 text-fg shadow-[0_10px_24px_rgba(13,13,15,0.14)] transition hover:-translate-y-0.5 hover:border-accentA/45 hover:bg-accent-gradient hover:text-ivory dark:border-ivory/26 dark:bg-ivory/12 dark:text-ivory dark:hover:border-accentA/45 dark:hover:bg-accent-gradient dark:hover:text-ivory"
        >
          <span
            className={`absolute inset-0 inline-flex items-center justify-center transition-all duration-200 ${
              showArrow ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-90 opacity-0"
            }`}
          >
            <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
          </span>
          <span
            className={`tabular-nums text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-accentA transition-all duration-200 group-hover:text-ivory md:text-[0.8rem] ${
              showArrow ? "-translate-y-1 scale-90 opacity-0" : "translate-y-0 scale-100 opacity-100"
            }`}
          >
            {scrollPercent}%
          </span>
        </button>
      </div>
    </div>
  );
}
