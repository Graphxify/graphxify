"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("App error boundary", error);
  }, [error]);

  return (
    <div className="container py-20">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-sm text-[rgba(242,240,235,0.75)]">An unexpected issue occurred. Try again.</p>
      <Button className="mt-5" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
