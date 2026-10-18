"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Reveal } from "@/components/site/reveal";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";

export type GalleryItem = { src: string; alt: string; ratio: number | null };

const FALLBACK_RATIO = 1.5;
const pad = (value: number) => String(value).padStart(2, "0");
const control =
  "inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA focus-visible:ring-offset-2 focus-visible:ring-offset-fg";

/**
 * Bento of every render on the project's stage colour. Rows are justified (widths follow each
 * render's real aspect ratio), so mockups show uncropped. Any tile opens the lightbox:
 * Radix Dialog gives Escape, focus trap and focus return; arrow keys step through.
 */
export function CaseGallery({
  items,
  rows,
  stage,
}: {
  items: GalleryItem[];
  rows: number[][];
  stage: string;
}): JSX.Element | null {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const count = items.length;
  if (!count) return null;

  const step = (delta: number) =>
    setOpen((index) =>
      index === null ? index : (index + delta + count) % count,
    );
  const current = open === null ? null : items[open];
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  return (
    <>
      <div
        className="flex flex-col gap-3 rounded-[2rem] p-3 md:gap-4 md:rounded-[2.5rem] md:p-5"
        style={{ backgroundColor: stage }}
      >
        {rows.map((row) => {
          const rowSum = row.reduce(
            (sum, index) => sum + (items[index].ratio ?? FALLBACK_RATIO),
            0,
          );
          // Capping width by the row's summed ratio caps its height (~30rem), so a short row centres instead of ballooning.
          return (
            <div
              key={row.join("-")}
              style={{ "--s": rowSum } as CSSProperties}
              className="mx-auto w-full md:max-w-[calc(var(--s)*30rem)]"
            >
              <Reveal className="flex flex-col gap-3 md:flex-row md:gap-4">
                {row.map((index) => {
                  const item = items[index];
                  const ratio = item.ratio ?? FALLBACK_RATIO;
                  return (
                    <button
                      key={item.src}
                      type="button"
                      onClick={(event) => {
                        opener.current = event.currentTarget;
                        setOpen(index);
                      }}
                      aria-label={`${item.alt}. Open larger view`}
                      style={{ "--r": ratio } as CSSProperties}
                      className="group relative block aspect-[var(--r)] w-full cursor-zoom-in overflow-hidden rounded-[1.25rem] bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:w-auto md:rounded-[1.5rem] md:[flex:var(--r)_1_0%]"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        unoptimized={shouldBypassNextImageOptimization(
                          item.src,
                        )}
                        sizes={`(max-width: 767px) 100vw, ${Math.min(100, Math.round((ratio / rowSum) * 100))}vw`}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </button>
                  );
                })}
              </Reveal>
            </div>
          );
        })}
      </div>

      <Dialog.Root
        open={current !== null}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-fg/95 motion-safe:animate-[fadeIn_200ms_ease-out]" />
          <Dialog.Content
            aria-describedby={undefined}
            onKeyDown={onKeyDown}
            // No Dialog.Trigger here, so return focus to the tile that opened the lightbox ourselves.
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              opener.current?.focus();
            }}
            className="fixed inset-0 z-[100] flex flex-col text-white focus:outline-none motion-safe:animate-[fadeIn_200ms_ease-out]"
          >
            <div className="container flex h-20 shrink-0 items-center justify-between">
              <Dialog.Title className="text-[0.9375rem] font-semibold tabular-nums text-white/72">
                {current ? (
                  <span className="sr-only">{current.alt}, image </span>
                ) : null}
                {pad((open ?? 0) + 1)} / {pad(count)}
              </Dialog.Title>
              <Dialog.Close aria-label="Close gallery" className={control}>
                <X className="h-5 w-5" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className="relative mx-4 min-h-0 flex-1 md:mx-8">
              {current ? (
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  unoptimized={shouldBypassNextImageOptimization(current.src)}
                  sizes="100vw"
                  className="object-contain motion-safe:animate-[fadeIn_300ms_ease-out]"
                />
              ) : null}
            </div>
            <div className="flex h-24 shrink-0 items-center justify-center gap-3">
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className={control}
                  >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className={control}
                  >
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
