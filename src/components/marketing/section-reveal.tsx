"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type SectionRevealEffect = "up" | "down" | "left" | "right" | "zoom";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function hiddenPose(effect: SectionRevealEffect): { opacity: number; x?: number; y?: number; scale?: number } {
  if (effect === "down") {
    return { opacity: 0, y: -10 };
  }
  if (effect === "left") {
    return { opacity: 0, y: 16 };
  }
  if (effect === "right") {
    return { opacity: 0, y: 16 };
  }
  if (effect === "zoom") {
    return { opacity: 0, y: 14, scale: 0.995 };
  }
  return { opacity: 0, y: 18 };
}

/**
 * Section wrapper with a restrained in-view reveal.
 * Keeps motion language consistent across marketing pages while
 * preserving existing call-site props.
 */
export function SectionReveal({
  children,
  className = "",
  effect = "up",
  once = true
}: {
  children: ReactNode;
  className?: string;
  effect?: SectionRevealEffect;
  once?: boolean;
}): JSX.Element {
  const reduced = useReducedMotion();

  if (reduced) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={hiddenPose(effect)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: "-8% 0px -8% 0px", amount: 0.22 }}
      transition={{ duration: 0.62, ease: EASE }}
    >
      {children}
    </motion.section>
  );
}
