"use client";

import { useEffect, useRef } from "react";

/**
 * Pauses every CSS animation inside while it is off-screen (data-paused + globals.css rule).
 * Long-running marquees otherwise keep repainting huge layers the visitor can't see.
 */
export function OffscreenPause({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute("data-paused", !entry.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
