"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

/**
 * Global Lenis smooth-scroll driver.
 *
 * Renders as `null` — it just creates a Lenis instance attached to
 * the window and drives it via rAF. On route changes the scroll
 * position is instantly reset to 0 (no jerky native jump).
 *
 * Also exposes `window.__graphxifySmoothScrollTo` so other components
 * (e.g. anchor-link navigations) can trigger a smooth scroll.
 */

type SmoothWindow = Window & {
  __graphxifySmoothScrollTo?: (top: number) => void;
  __lenis?: Lenis;
};

export function SmoothScrollDriver(): null {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const pathname = usePathname();

  // Create / destroy Lenis instance
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't use smooth scroll if user prefers reduced motion
    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.18,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaExponent: 1.7,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.0,
      autoRaf: false,
    });

    lenisRef.current = lenis;
    (window as SmoothWindow).__lenis = lenis;

    // Expose smooth scroll helper for other components
    (window as SmoothWindow).__graphxifySmoothScrollTo = (top: number) => {
      lenis.scrollTo(top, { duration: 1 });
    };

    // Drive Lenis with rAF
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Handle anchor clicks
    const onDocumentClick = (event: MouseEvent) => {
      const targetNode = event.target as HTMLElement | null;
      const anchor = targetNode?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      if (
        anchor.origin !== window.location.origin ||
        anchor.pathname !== window.location.pathname ||
        !anchor.hash
      ) {
        return;
      }

      const id = decodeURIComponent(anchor.hash);
      const section = document.querySelector(id);
      if (!section) return;

      event.preventDefault();
      lenis.scrollTo(section as HTMLElement, { offset: 0, duration: 1.05 });
    };

    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("click", onDocumentClick);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
      delete (window as SmoothWindow).__lenis;
      delete (window as SmoothWindow).__graphxifySmoothScrollTo;
    };
  }, [reducedMotion]);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
