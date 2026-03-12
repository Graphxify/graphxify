"use client";

/**
 * CMS page transition — instant passthrough.
 *
 * Previously used framer-motion fade-up (550ms) that made every
 * navigation click feel sluggish. Replaced with a zero-cost wrapper.
 *
 * The marketing site pages can still use their own entrance animations
 * via RevealStagger, but for the CMS dashboard we prioritize speed.
 */
export function PageTransition({ children }: { children: React.ReactNode }): JSX.Element {
  return <>{children}</>;
}
