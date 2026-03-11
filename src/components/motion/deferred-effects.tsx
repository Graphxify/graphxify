"use client";

import dynamic from "next/dynamic";

// Loaded after hydration. Keep enhancements lightweight to preserve
// smooth scroll and consistent frame pacing.
const ParallaxGrid = dynamic(
  () => import("@/components/motion/parallax-grid").then((m) => ({ default: m.ParallaxGrid })),
  { ssr: false }
);

export function DeferredEffects(): JSX.Element {
  return <ParallaxGrid />;
}
