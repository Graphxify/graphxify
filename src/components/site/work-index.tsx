"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import { cn } from "@/lib/utils";

export type WorkIndexItem = { href: string; title: string; industry: string; image: string; tags?: readonly string[] };

/**
 * Editorial project list. Desktop: the hovered project's cover follows the cursor.
 * Touch and small screens: each row carries its own thumbnail, nothing follows.
 */
export function WorkIndex({ items }: { items: WorkIndexItem[] }): JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || !listRef.current || !previewRef.current) return;
    const box = listRef.current.getBoundingClientRect();
    // Written straight to the DOM: no React render per pointer move.
    previewRef.current.style.transform = `translate3d(${event.clientX - box.left}px, ${event.clientY - box.top}px, 0) translate(-50%, -50%)`;
  };

  return (
    <div className="relative">
      <ul ref={listRef} onPointerMove={onPointerMove} onPointerLeave={() => setActive(null)} className="border-t border-border/10">
        {items.map((item, index) => (
          <li key={item.href} className="border-b border-border/10">
            <Link
              href={item.href}
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
              onFocus={() => setActive(null)}
              className={cn(
                "group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-5 transition-colors duration-300 md:grid-cols-12 md:gap-8 md:py-8",
                active !== null && active !== index && "md:text-fg/30"
              )}
            >
              {/* Mobile thumbnail */}
              <span className="relative aspect-square w-[4.5rem] overflow-hidden rounded-xl bg-surface md:hidden">
                <Image src={item.image} alt="" fill sizes="72px" unoptimized={shouldBypassNextImageOptimization(item.image)} className="object-cover" />
              </span>
              <span className="t-label hidden md:col-span-1 md:block">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 md:col-span-6">
                <span className="block truncate text-[1.375rem] font-semibold leading-tight tracking-[-0.035em] md:text-[clamp(1.75rem,3.4vw,2.75rem)]">
                  {item.title}
                </span>
                <span className="mt-1 block text-[0.875rem] text-fg/60 md:hidden">{item.industry}</span>
              </span>
              <span className="hidden text-[0.9375rem] text-fg/60 md:col-span-3 md:block">{item.industry}</span>
              <span className="flex justify-end md:col-span-2">
                <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface text-fg transition-colors duration-200 group-hover:bg-accentB group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Cursor preview (desktop, mouse only) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-10 hidden aspect-[4/3] w-[22rem] overflow-hidden rounded-[1.25rem] bg-surface shadow-[0_30px_80px_-30px_rgba(11,11,12,0.45)] transition-[opacity,scale] duration-300 ease-out md:block",
          active === null ? "scale-90 opacity-0" : "scale-100 opacity-100"
        )}
      >
        {items.map((item, index) => (
          <Image
            key={item.href}
            src={item.image}
            alt=""
            fill
            sizes="352px"
            unoptimized={shouldBypassNextImageOptimization(item.image)}
            className={cn("object-cover transition-opacity duration-300", active === index ? "opacity-100" : "opacity-0")}
          />
        ))}
      </div>
    </div>
  );
}
