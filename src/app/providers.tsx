"use client";

import type { ReactNode } from "react";
import { AuthHashRedirector } from "@/components/auth/auth-hash-redirector";

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  return (
    <>
      <AuthHashRedirector />
      {children}
    </>
  );
}
