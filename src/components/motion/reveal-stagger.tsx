"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Stagger container — fast, snappy entrance for CMS pages.
 * Reduced from 600ms/28px to 180ms/8px for instant-feeling navigation.
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
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.18,
            ease: EASE,
            staggerChildren: 0.03,
            delayChildren: 0,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px", amount: 0.05 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child reveal item — fast fade-in.
 * Reduced from 520ms/28px to 150ms/6px.
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
        hidden: { opacity: 0, y: 6 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.15, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
