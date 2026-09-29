"use client";

import Script from "next/script";
import { useEffect } from "react";
import { captureFirstTouch, trackClick } from "@/lib/analytics-events";

// GA4 loads only when NEXT_PUBLIC_GA_MEASUREMENT_ID is a valid "G-" ID, so
// local, preview and CI builds without it ship no Google script. The initial
// page_view comes from `config`; client-side navigations are recorded by GA4
// enhanced measurement ("page changes based on browser history events"), so no
// manual page_view is sent here — that would double count.
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const gaEnabled = /^G-[A-Z0-9]{4,}$/.test(measurementId);

function linkLocation(anchor: Element): string {
  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  return "content";
}

function handleClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const anchor = target.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const href = anchor.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) {
    trackClick({ name: "email_click", properties: { link_location: linkLocation(anchor) } });
    return;
  }
  if (href.startsWith("tel:")) {
    trackClick({ name: "phone_click", properties: { link_location: linkLocation(anchor) } });
    return;
  }

  const project = anchor.dataset.analyticsProject;
  if (project) {
    let domain = "";
    try {
      domain = new URL(anchor.href).hostname.replace(/^www\./, "");
    } catch {
      // Keep the empty domain.
    }
    trackClick({ name: "outbound_project_click", properties: { project, link_domain: domain } });
    return;
  }

  try {
    const url = new URL(anchor.href);
    if (url.origin === window.location.origin && url.pathname === "/contact" && window.location.pathname !== "/contact") {
      const text = (anchor.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60);
      trackClick({
        name: "primary_cta_click",
        properties: { cta_location: `${window.location.pathname}#${linkLocation(anchor)}`, cta_text: text }
      });
    }
  } catch {
    // Unparseable href — not a CTA.
  }
}

export function SiteAnalytics(): JSX.Element | null {
  useEffect(() => {
    captureFirstTouch();
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!gaEnabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}');`}
      </Script>
    </>
  );
}
