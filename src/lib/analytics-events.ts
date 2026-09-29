"use client";

import { track } from "@vercel/analytics";

/**
 * Conversion events, sent through the site's existing analytics (Vercel Web
 * Analytics — see <Analytics /> in app/layout.tsx). No second analytics system,
 * no fingerprinting, and no personal data in event properties: only which form
 * and which placement. A no-op unless NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true,
 * matching the flag that mounts <Analytics />. Custom events need a Vercel plan
 * that includes them. Event catalogue: docs/SEO-AI-SEARCH-IMPLEMENTATION-REPORT.md.
 */
export type ConversionEvent =
  | { name: "lead_submitted"; properties: { form: "contact_page" | "quick_form" } }
  | { name: "newsletter_subscribed"; properties: { placement: string } }
  | { name: "review_submitted"; properties?: undefined };

const enabled = process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true";

export function trackConversion(event: ConversionEvent): void {
  if (!enabled) return;
  try {
    track(event.name, event.properties);
  } catch {
    // Analytics must never break a form submission.
  }
}
