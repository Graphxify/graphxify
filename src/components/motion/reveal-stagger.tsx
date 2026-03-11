"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Stagger container with gentle in-view entrance.
 * Unified to a single fade-up pose matching the Bungee Framer reference.
 */
export function RevealStagger({
  children,
  className = "",
  once = true,
  effect: _effect = "up",
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
  effect?: string;
}): JSX.Element {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: EASE,
            staggerChildren: 0.08,
            delayChildren: 0.02,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-6% 0px -6% 0px", amount: 0.18 }}
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
  effect: _effect = "up",
}: {
  children: ReactNode;
  className?: string;
  effect?: string;
}): JSX.Element {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
