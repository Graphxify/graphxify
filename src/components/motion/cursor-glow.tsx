"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

function readCursorLabel(target: EventTarget | null): string {
  if (!(target instanceof Element)) {
    return "";
  }

  return target.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ?? "";
}

export function CursorGlow(): JSX.Element | null {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const visibleRef = useRef(false);
  const labelTargetRef = useRef<EventTarget | null>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const shellX = useSpring(x, { stiffness: 300, damping: 32, mass: 0.36 });
  const shellY = useSpring(y, { stiffness: 300, damping: 32, mass: 0.36 });
  const coreX = useSpring(x, { stiffness: 440, damping: 36, mass: 0.19 });
  const coreY = useSpring(y, { stiffness: 440, damping: 36, mass: 0.19 });

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) {
      setEnabled(false);
      return;
    }

    const mediaFine = window.matchMedia("(pointer: fine)");
    const mediaWide = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      const navigatorHints = window.navigator as NavigatorWithHints;
      const lowPowerDevice = (navigatorHints.deviceMemory ?? 8) <= 4 || navigatorHints.hardwareConcurrency <= 4;
      const saveData = Boolean(navigatorHints.connection?.saveData);

      setEnabled(mediaFine.matches && mediaWide.matches && !lowPowerDevice && !saveData);
    };

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
      visibleRef.current = false;
      labelTargetRef.current = null;
      setVisible(false);
      setCursorLabel("");
      return;
    }

    document.documentElement.classList.add("cursor-fx");

    const setVisibleState = (next: boolean) => {
      if (visibleRef.current === next) {
        return;
      }

      visibleRef.current = next;
      setVisible(next);
    };

    const onPointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisibleState(true);

      if (labelTargetRef.current !== event.target) {
        labelTargetRef.current = event.target;
        const label = readCursorLabel(event.target);
        setCursorLabel((prev) => (prev === label ? prev : label));
      }
    };
    const onPointerDown = () => setPressed(true);
    const onPointerUp = () => setPressed(false);
    const onPointerLeave = () => {
      setVisibleState(false);
      labelTargetRef.current = null;
      setCursorLabel("");
    };

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
        className={cn(
          "pointer-events-none fixed z-[64] flex items-center justify-center border text-[0.56rem] font-semibold uppercase tracking-[0.18em] backdrop-blur-md transition-colors duration-200",
          cursorLabel ? "border-accentA/55 bg-accent-gradient text-ivory" : "border-fg/32 bg-card/28 text-fg"
        )}
        style={{ x: shellX, y: shellY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          width: cursorLabel ? 74 : 46,
          height: cursorLabel ? 74 : 46,
          borderRadius: 999,
          scale: pressed ? 0.94 : 1
        }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="select-none">{cursorLabel}</span>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[65] h-[8px] w-[8px] rounded-full bg-fg dark:bg-ivory"
        style={{ x: coreX, y: coreY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && !cursorLabel ? 1 : 0, scale: pressed ? 0.64 : 1 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
