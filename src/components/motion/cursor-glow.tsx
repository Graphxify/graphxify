"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow(): JSX.Element | null {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-160);
  const y = useMotionValue(-160);
  const sx = useSpring(x, { stiffness: 120, damping: 34, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 120, damping: 34, mass: 0.5 });

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) {
      setEnabled(false);
      return;
    }

    const mediaFine = window.matchMedia("(pointer: fine)");
    const mediaWide = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(mediaFine.matches && mediaWide.matches);

    update();
    mediaFine.addEventListener("change", update);
    mediaWide.addEventListener("change", update);
    return () => {
      mediaFine.removeEventListener("change", update);
      mediaWide.removeEventListener("change", update);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const onPointerMove = (event: PointerEvent) => {
      x.set(event.clientX - 130);
      y.set(event.clientY - 130);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [enabled, x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[1] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(0,163,255,0.14)_0%,rgba(0,82,204,0.08)_35%,transparent_72%)] blur-xl"
      style={{ x: sx, y: sy }}
    />
  );
}
