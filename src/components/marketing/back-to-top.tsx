"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

type SmoothWindow = Window & {
  __graphxifySmoothScrollTo?: (top: number) => void;
};

export function BackToTop(): JSX.Element {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const sweep = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const ringBackground = useMotionTemplate`conic-gradient(rgb(var(--accent-a)) ${sweep}deg, transparent ${sweep}deg 360deg)`;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] md:bottom-7 md:right-7">
      <div className="relative h-14 w-14 md:h-16 md:w-16">
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full p-[1.5px]"
          style={reducedMotion ? undefined : { background: ringBackground }}
        >
          <div className="h-full w-full rounded-full bg-transparent" />
        </motion.div>

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
          className="pointer-events-auto absolute inset-[3px] inline-flex items-center justify-center rounded-full border border-border/24 bg-transparent text-fg shadow-[0_10px_24px_rgba(13,13,15,0.14)] transition hover:-translate-y-0.5 hover:bg-ivory/90 hover:text-graphite dark:hover:bg-graphite/76 dark:hover:text-ivory"
        >
          <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </div>
  );
}
