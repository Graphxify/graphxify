"use client";

import { Children, useEffect, useRef } from "react";

/**
 * Scroll stack (after React Bits "ScrollStack", without Lenis): each item pins near the top
 * and the next one slides over it; covered items scale down. Native scroll, sticky CSS,
 * one rAF-throttled listener. Under reduced motion items still stack, without scaling.
 */
export function ScrollStack({ children, top = 96, offset = 22, scaleStep = 0.05 }: { children: React.ReactNode; top?: number; offset?: number; scaleStep?: number }): JSX.Element {
  const refs = useRef<Array<HTMLDivElement | null>>([]);
  const items = Children.toArray(children);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const els = refs.current.filter((el): el is HTMLDivElement => el !== null);
      // Read every rect first, then write, so the frame never forces a second layout.
      const tops = els.map((el) => el.getBoundingClientRect().top);
      const heights = els.map((el) => el.offsetHeight);
      els.forEach((el, i) => {
        // How far each later card has travelled over this one (0..1), summed.
        let covered = 0;
        for (let j = i + 1; j < els.length; j++) covered += Math.min(1, Math.max(0, 1 - (tops[j] - (top + j * offset)) / heights[i]));
        const inner = el.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `scale(${1 - covered * scaleStep})`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [top, offset, scaleStep, items.length]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {items.map((child, i) => (
        <div key={i} ref={(el) => void (refs.current[i] = el)} data-stack-item="" className="sticky" style={{ top: top + i * offset }}>
          <div className="origin-top">{child}</div>
        </div>
      ))}
    </div>
  );
}
