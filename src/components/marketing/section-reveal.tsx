"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Section wrapper with a soft fade-up in-view reveal.
 * Unified to a single consistent "fade up from below" effect
 * matching the Bungee Framer reference motion language.
 *
 * Uses a small initial Y offset and viewport trigger to create
 * gentle, cinematic content reveals on scroll.
 */
export function SectionReveal({
  children,
  className = "",
  effect: _effect = "up",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  effect?: string;
  once?: boolean;
}): JSX.Element {
  const reduced = useReducedMotion();

  if (reduced) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px", amount: 0.08 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.section>
  );
}
