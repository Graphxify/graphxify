"use client";

import type { ReactNode } from "react";

export type RevealEffect = "up" | "down" | "left" | "right" | "zoom";

/**
 * Container wrapper — renders content instantly with no animation.
 *
 * Previously used framer-motion whileInView stagger animations that
 * caused delayed content rendering on every page navigation.
 * Props signature preserved so call-sites don't need updating.
 */
export function RevealStagger({
  children,
  className = "",
  once: _once = true,
  effect: _effect = "up"
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
  effect?: RevealEffect;
}): JSX.Element {
  return <div className={className}>{children}</div>;
}

/**
 * Item wrapper — renders content instantly with no animation.
 */
export function RevealItem({
  children,
  className = "",
  effect: _effect = "up"
}: {
  children: ReactNode;
  className?: string;
  effect?: RevealEffect;
}): JSX.Element {
  return <div className={className}>{children}</div>;
}
