"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Appears once the visitor is well into the page; hidden while the mobile menu is open. */
export function BackToTop(): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Sentinel 1.5 viewports down: once it scrolls past the top, show the button.
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:150vh;left:0;width:1px;height:1px;pointer-events:none";
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.boundingClientRect.top < 0));
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    const update = () => setMobileMenuOpen(document.body.dataset.mobileMenuOpen === "true");
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-mobile-menu-open"] });
    return () => observer.disconnect();
  }, []);

  const shown = visible && !mobileMenuOpen;

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className={`fixed bottom-5 right-5 z-[45] inline-flex h-12 w-12 items-center justify-center rounded-full bg-fg text-white shadow-[0_12px_30px_-12px_rgba(11,11,12,0.5)] transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-accentB md:bottom-8 md:right-8 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
