"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const ENTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Subtle page-content entrance on route changes.
 * Avoids heavy cross-fade tricks while giving each navigation
 * a polished, controlled reveal.
 */
export function PageTransition({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        y: { duration: 0.52, ease: ENTER_EASE },
        opacity: { duration: 0.46, ease: ENTER_EASE, delay: 0.03 }
      }}
    >
      {children}
    </motion.div>
  );
}
