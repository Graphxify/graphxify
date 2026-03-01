"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop(): JSX.Element {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(242,240,235,0.18)] hover:translate-y-[-1px]"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
