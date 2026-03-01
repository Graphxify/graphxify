"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { GraphxifyThemeProvider } from "@/components/theme/theme-context";

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  return (
    <GraphxifyThemeProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </GraphxifyThemeProvider>
  );
}
