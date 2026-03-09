"use client";

/**
 * Page wrapper — no unmount / remount animation.
 *
 * In Next.js App Router the router already handles content swaps
 * internally. Adding `key={pathname}` + AnimatePresence forces a
 * full React tree tear-down and rebuild, which causes a visible
 * flash no matter how fast the animation is.
 *
 * Individual sections already animate via `<SectionReveal>`, so a
 * page-level transition is unnecessary. This component is kept as a
 * simple pass-through to avoid touching every layout that imports it.
 */
export function PageTransition({ children }: { children: React.ReactNode }): JSX.Element {
  return <>{children}</>;
}
