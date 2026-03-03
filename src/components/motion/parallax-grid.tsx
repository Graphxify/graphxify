"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ParallaxGrid(): JSX.Element | null {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1200], [0, 80]);
  const backgroundImage =
    "linear-gradient(to right, rgb(var(--fg) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--fg) / 0.06) 1px, transparent 1px)";
  const hideOnProjectDetail = pathname.startsWith("/works/");

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

  if (!enabled || hideOnProjectDetail) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[120vh] opacity-15 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
      style={{ y }}
    >
      <div className="h-full w-full bg-[size:52px_52px]" style={{ backgroundImage }} />
    </motion.div>
  );
}
