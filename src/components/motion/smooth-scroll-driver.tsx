"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type SmoothWindow = Window & {
  __graphxifySmoothScrollTo?: (top: number) => void;
};

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function easeOutQuart(value: number): number {
  return 1 - (1 - value) ** 4;
}

export function SmoothScrollDriver(): null {
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const smoothWindow = window as SmoothWindow;

    const stopAnimation = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const smoothScrollTo = (top: number) => {
      const target = Math.max(0, top);
      if (reducedMotion) {
        window.scrollTo({ top: target, behavior: "auto" });
        return;
      }

      stopAnimation();
      const startY = window.scrollY;
      const distance = target - startY;
      const duration = 460;
      const startTime = performance.now();

      const step = (now: number) => {
        const t = clamp01((now - startTime) / duration);
        const eased = easeOutQuart(t);
        window.scrollTo(0, startY + distance * eased);
        if (t < 1) {
          rafRef.current = window.requestAnimationFrame(step);
        } else {
          rafRef.current = null;
        }
      };

      rafRef.current = window.requestAnimationFrame(step);
    };

    smoothWindow.__graphxifySmoothScrollTo = smoothScrollTo;

    const onDocumentClick = (event: MouseEvent) => {
      const targetNode = event.target as HTMLElement | null;
      const anchor = targetNode?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      if (anchor.origin !== window.location.origin || anchor.pathname !== window.location.pathname || !anchor.hash) {
        return;
      }

      const id = decodeURIComponent(anchor.hash);
      const section = document.querySelector(id);
      if (!section) return;

      event.preventDefault();
      const y = section.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(y);
    };

    document.addEventListener("click", onDocumentClick);

    return () => {
      stopAnimation();
      document.removeEventListener("click", onDocumentClick);
      delete smoothWindow.__graphxifySmoothScrollTo;
    };
  }, [reducedMotion]);

  return null;
}
