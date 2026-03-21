"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean };
};

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

const MARKETING_ROUTES = ["/", "/about", "/services", "/works", "/blog", "/contact"] as const;

const preloaders = [
  () => import("@/components/marketing/home-sections"),
  () => import("@/components/marketing/about-page-content"),
  () => import("@/components/marketing/services-page-content"),
  () => import("@/components/marketing/blog-page-content"),
  () => import("@/components/marketing/contact-page-content"),
  () => import("@/components/marketing/site-cta-section"),
  () => import("@/components/marketing/home-projects-slider"),
  () => import("@/components/marketing/testimonials-section")
];

export function MarketingRouteWarmup(): null {
  const router = useRouter();

  useEffect(() => {
    const navigatorHints = window.navigator as NavigatorWithHints;
    if (navigatorHints.connection?.saveData) {
      return;
    }

    let cancelled = false;
    const warmRoutes = () => {
      if (cancelled) {
        return;
      }

      MARKETING_ROUTES.forEach((href) => {
        router.prefetch(href);
      });

      void Promise.allSettled(preloaders.map((load) => load()));
    };

    const idleWindow = window as IdleWindow;
    const idleId = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(warmRoutes, { timeout: 1400 })
      : window.setTimeout(warmRoutes, 420);

    return () => {
      cancelled = true;
      if (typeof idleId === "number" && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
        return;
      }
      window.clearTimeout(idleId);
    };
  }, [router]);

  return null;
}
