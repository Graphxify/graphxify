"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export type SectionRevealEffect = "up" | "down" | "left" | "right" | "zoom";

function getRevealFrom(effect: SectionRevealEffect, distance = 18): { x?: number; y?: number; scale?: number; filter?: string } {
  if (effect === "left") return { x: -distance, filter: "blur(4px)" };
  if (effect === "right") return { x: distance, filter: "blur(4px)" };
  if (effect === "down") return { y: -distance, filter: "blur(4px)" };
  if (effect === "zoom") return { y: 12, scale: 0.96, filter: "blur(4px)" };
  return { y: distance, filter: "blur(4px)" };
}

function createSectionVariants(effect: SectionRevealEffect): Variants {
  return {
    hidden: { opacity: 0, ...getRevealFrom(effect, 20) },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.76,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.12,
        delayChildren: 0.14
      }
    }
  };
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.66,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

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
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      variants={createSectionVariants(effect)}
      initial={false}
      whileInView="show"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
    >
      <motion.div variants={childVariants}>{children}</motion.div>
    </motion.section>
  );
}
