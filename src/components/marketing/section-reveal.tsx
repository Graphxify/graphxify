"use client";

import type { ReactNode } from "react";

export type SectionRevealEffect = "up" | "down" | "left" | "right" | "zoom";

/**
 * Section wrapper — renders content instantly with no animation.
 *
 * Previously this component used framer-motion `whileInView` animations
 * that caused a visible cascade of delayed content on every page
 * navigation. Removed all motion to ensure instant, flash-free rendering.
 *
 * The `effect` and `once` props are kept in the signature so existing
 * call-sites don't need to be updated.
 */
export function SectionReveal({
  children,
  className = "",
  effect: _effect = "up",
  once: _once = true
}: {
  children: ReactNode;
  className?: string;
  effect?: SectionRevealEffect;
  once?: boolean;
}) {
  return <section className={className}>{children}</section>;
}
