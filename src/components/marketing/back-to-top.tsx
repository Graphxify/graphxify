"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop(): JSX.Element {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/20 bg-card/70 text-fg hover:-translate-y-0.5"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
