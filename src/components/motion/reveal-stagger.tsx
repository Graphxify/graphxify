"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type RevealEffect = "up" | "down" | "left" | "right" | "zoom";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function hiddenPose(effect: RevealEffect): { opacity: number; x?: number; y?: number; scale?: number } {
  if (effect === "down") {
    return { opacity: 0, y: -10 };
  }
  if (effect === "left") {
    return { opacity: 0, y: 14 };
  }
  if (effect === "right") {
    return { opacity: 0, y: 14 };
  }
  if (effect === "zoom") {
    return { opacity: 0, y: 12, scale: 0.995 };
  }
  return { opacity: 0, y: 16 };
}

/**
 * Stagger container with gentle in-view entrance.
 */
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
      variants={{
        hidden: hiddenPose(effect),
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.56,
            ease: EASE,
            staggerChildren: 0.06,
            delayChildren: 0.02
          }
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px", amount: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child reveal item for use inside `RevealStagger`.
 */
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
    <motion.div
      className={className}
      variants={{
        hidden: hiddenPose(effect),
        visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.48, ease: EASE } }
      }}
    >
      {children}
    </motion.div>
  );
}
