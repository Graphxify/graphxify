"use client";

import { track } from "@vercel/analytics";
import { classifyAiReferral } from "@/lib/ai-referrals";

// Custom events are sent to Vercel Analytics (when enabled) and to GA4 (when
// the gtag snapshot is loaded). Page views are NOT sent from here: Vercel
// Analytics and GA4 enhanced measurement each record their own, so nothing is
// double counted. Event properties never contain form contents or contact
// details. See docs/GA4-SETUP.md for the event catalogue.

type LeadForm = "contact_page" | "quick_form";

export type ConversionEvent =
  // Fired once per successful /api/leads response (never on validation errors).
  | { name: "contact_form_submit"; properties: { form: LeadForm } }
  | { name: "newsletter_subscribed"; properties: { placement: string } }
  | { name: "review_submitted"; properties?: undefined };

export type ClickEvent =
  | { name: "primary_cta_click"; properties: { cta_location: string; cta_text: string } }
  | { name: "email_click"; properties: { link_location: string } }
  | { name: "phone_click"; properties: { link_location: string } }
  | { name: "outbound_project_click"; properties: { project: string; link_domain: string } };

type EventProperties = Record<string, string | number | boolean>;

type Gtag = (command: "event", name: string, params?: EventProperties) => void;

const vercelEnabled = process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true";
const ATTRIBUTION_KEY = "gx_first_touch";

type Attribution = {
  landing_page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ai_referral?: string;
};

function sendGa(name: string, params: EventProperties): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}

function sendVercel(name: string, params: EventProperties | undefined): void {
  if (!vercelEnabled) return;
  track(name, params);
}

/**
 * Records the first landing page, UTM tags and AI referral of the browser
 * session so later lead events keep that context after in-site navigation.
 */
export function captureFirstTouch(): void {
  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") ?? undefined;
    const attribution: Attribution = {
      landing_page: window.location.pathname,
      utm_source: utmSource,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
      ai_referral: classifyAiReferral({ referrer: document.referrer, utmSource }) ?? undefined
    };
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Storage blocked (private mode, disabled cookies) — attribution is optional.
  }
}

function firstTouch(): EventProperties {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Attribution;
    const out: EventProperties = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value) out[key] = value.slice(0, 100);
    }
    return out;
  } catch {
    return {};
  }
}

export function trackConversion(event: ConversionEvent): void {
  try {
    const properties: EventProperties = { ...(event.properties ?? {}) };
    sendVercel(event.name, event.properties);

    const params = { ...properties, ...firstTouch() };
    sendGa(event.name, params);
    // project_inquiry is the single GA4 key event: one per successful inquiry.
    if (event.name === "contact_form_submit") sendGa("project_inquiry", params);
  } catch {
    // Analytics must never break a form submission.
  }
}

export function trackClick(event: ClickEvent): void {
  try {
    sendVercel(event.name, event.properties);
    sendGa(event.name, event.properties);
  } catch {
    // Ignore analytics failures.
  }
}
