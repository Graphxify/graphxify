"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "loading" | "done";

export function NavigationProgress(): JSX.Element | null {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [showIndicator, setShowIndicator] = useState(false);
  const prevPathname = useRef(pathname);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indicatorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Listen for clicks on dashboard nav links */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/dashboard")) return;

      /* Normalize: strip trailing slash for comparison */
      const normalized = href.replace(/\/$/, "") || "/";
      const current = pathname.replace(/\/$/, "") || "/";
      if (normalized === current) return;

      setPhase("loading");
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  /* Detect route completion */
  useEffect(() => {
    if (indicatorTimer.current !== null) {
      clearTimeout(indicatorTimer.current);
      indicatorTimer.current = null;
    }

    if (phase === "loading") {
      indicatorTimer.current = setTimeout(() => setShowIndicator(true), 180);
      return;
    }

    setShowIndicator(false);
  }, [phase]);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;

      if (phase === "loading") {
        setPhase("done");

        if (doneTimer.current !== null) clearTimeout(doneTimer.current);
        doneTimer.current = setTimeout(() => setPhase("idle"), 400);
      }
    }
  }, [pathname, phase]);

  useEffect(() => {
    return () => {
      if (doneTimer.current !== null) clearTimeout(doneTimer.current);
      if (indicatorTimer.current !== null) clearTimeout(indicatorTimer.current);
    };
  }, []);

  if (phase === "idle") return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px]"
      >
        <div
          className={
            phase === "loading"
              ? "h-full bg-accentA animate-[nav-loading_2.4s_cubic-bezier(0.4,0,0.2,1)_forwards]"
              : "h-full bg-accentA animate-[nav-done_380ms_ease-out_forwards]"
          }
        />
      </div>

      {showIndicator ? (
        <div className="pointer-events-none fixed right-4 top-4 z-[9998]">
          <div className="flex items-center gap-2 rounded-full border border-accentA/20 bg-card/88 px-3 py-1.5 text-xs text-fg/72 shadow-[0_14px_32px_rgba(9,18,37,0.2)] backdrop-blur">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accentA/20 border-t-accentA" />
            Loading section...
          </div>
        </div>
      ) : null}
    </>
  );
}
