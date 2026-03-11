"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Page-level transition wrapper.
 *
 * Uses a simple fade-up entrance on route changes without AnimatePresence
 * mode="wait" to avoid the blank-screen flash between exit and enter.
 *
 * The approach: on route change the wrapper instantly resets to
 * opacity 0 / y 24 and smoothly animates in. No exit animation
 * prevents the "flash to blank" issue that mode="wait" caused.
 */
export function PageTransition({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const isFirstRender = useRef(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // On route change, trigger the entrance animation
    setShouldAnimate(true);
    const timeout = setTimeout(() => setShouldAnimate(false), 600);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={isFirstRender.current ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
