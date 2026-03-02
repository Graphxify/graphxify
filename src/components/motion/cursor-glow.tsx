"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow(): JSX.Element | null {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const shellX = useSpring(x, { stiffness: 300, damping: 32, mass: 0.36 });
  const shellY = useSpring(y, { stiffness: 300, damping: 32, mass: 0.36 });
  const coreX = useSpring(x, { stiffness: 440, damping: 36, mass: 0.19 });
  const coreY = useSpring(y, { stiffness: 440, damping: 36, mass: 0.19 });
  const glowX = useSpring(x, { stiffness: 180, damping: 28, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 180, damping: 28, mass: 0.6 });

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
    if (!enabled) {
      document.documentElement.classList.remove("cursor-fx");
      return;
    }

    document.documentElement.classList.add("cursor-fx");

    const onPointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const onPointerDown = () => setPressed(true);
    const onPointerUp = () => setPressed(false);
    const onPointerLeave = () => setVisible(false);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.documentElement.classList.remove("cursor-fx");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[64] flex items-center justify-center border border-fg/32 bg-card/28 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-fg backdrop-blur-md"
        style={{ x: shellX, y: shellY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          width: 46,
          height: 46,
          borderRadius: 999,
          scale: pressed ? 0.94 : 1
        }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[65] h-[8px] w-[8px] rounded-full bg-fg dark:bg-ivory"
        style={{ x: coreX, y: coreY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 0.64 : 1 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[63] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(0,163,255,0.18)_0%,rgba(0,82,204,0.1)_38%,transparent_72%)] blur-[22px]"
        style={{ x: glowX, y: glowY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 0.45 : 0,
          scale: 1
        }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
