"use client";

import type { ReactNode } from "react";
import { AuthHashRedirector } from "@/components/auth/auth-hash-redirector";
import { GraphxifyThemeProvider } from "@/components/theme/theme-context";

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  return (
    <GraphxifyThemeProvider>
      <AuthHashRedirector />
      {children}
    </GraphxifyThemeProvider>
  );
}
