"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type SectionRevealEffect = "up" | "down" | "left" | "right" | "zoom";

/**
 * Section wrapper — fades and lifts each section into view as it scrolls
 * into the viewport. Matches the Agero/Framer smooth-reveal aesthetic:
 * opacity 0→1, y 30→0, 0.75s ease-out, once per mount.
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
  const reduced = useReducedMotion();

  if (reduced) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.section>
  );
}
