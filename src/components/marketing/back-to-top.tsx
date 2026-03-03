"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type SmoothWindow = Window & {
  __graphxifySmoothScrollTo?: (top: number) => void;
};

export function BackToTop(): JSX.Element {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showArrow, setShowArrow] = useState(false);

  const updateProgress = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    const percent = Math.round(clamped * 100);
    setScrollPercent(percent);
    setShowArrow(percent >= 99);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", updateProgress);

  useEffect(() => {
    updateProgress(scrollYProgress.get());
  }, [scrollYProgress, updateProgress]);

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
          <AnimatePresence mode="wait" initial={false}>
            {showArrow ? (
              <motion.span
                key="arrow"
                initial={{ opacity: 0, y: 3, scale: 0.86 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -3, scale: 0.86 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center justify-center"
              >
                <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
              </motion.span>
            ) : (
              <motion.span
                key="percent"
                initial={{ opacity: 0, y: 3, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -3, scale: 0.9 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="tabular-nums text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-accentA group-hover:text-ivory md:text-[0.8rem]"
              >
                {scrollPercent}%
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
