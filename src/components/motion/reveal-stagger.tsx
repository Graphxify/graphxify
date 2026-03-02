"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const revealEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type RevealEffect = "up" | "down" | "left" | "right" | "zoom";

function getRevealFrom(effect: RevealEffect, distance = 18): { x?: number; y?: number; scale?: number; filter?: string } {
  if (effect === "left") return { x: -distance, filter: "blur(4px)" };
  if (effect === "right") return { x: distance, filter: "blur(4px)" };
  if (effect === "down") return { y: -distance, filter: "blur(4px)" };
  if (effect === "zoom") return { scale: 0.96, y: 10, filter: "blur(4px)" };
  return { y: distance, filter: "blur(4px)" };
}

function createContainerVariants(effect: RevealEffect): Variants {
  return {
    hidden: { opacity: 0, ...getRevealFrom(effect, 20) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.74,
        ease: revealEase,
        staggerChildren: 0.13,
        delayChildren: 0.14
      }
    }
  };
}

function createItemVariants(effect: RevealEffect): Variants {
  return {
    hidden: { opacity: 0, ...getRevealFrom(effect, 14) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.68,
        ease: revealEase
      }
    }
  };
}

export function RevealStagger({
  children,
  className = "",
  once = true,
  effect = "up"
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
  effect?: RevealEffect;
}): JSX.Element {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={createContainerVariants(effect)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
  effect = "up"
}: {
  children: ReactNode;
  className?: string;
  effect?: RevealEffect;
}): JSX.Element {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={createItemVariants(effect)}>
      {children}
    </motion.div>
  );
}
