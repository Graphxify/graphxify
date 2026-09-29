"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import type { ProjectImage } from "@/lib/project-details";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type CaptionMode = "overlay" | "below" | "side";

export function ProjectLightboxImage({
  image,
  className,
  sizes,
  parallax = false,
  priority = false,
  imageClassName,
  captionMode = "overlay",
  accentStamp = false,
  accentHairline = false,
  accentFocusRing = false,
  wipeReveal = false,
  hideCaption = false
}: {
  image: ProjectImage;
  className?: string;
  sizes?: string;
  parallax?: boolean;
  priority?: boolean;
  imageClassName?: string;
  captionMode?: CaptionMode;
  accentStamp?: boolean;
  accentHairline?: boolean;
  accentFocusRing?: boolean;
  wipeReveal?: boolean;
  hideCaption?: boolean;
}): JSX.Element {
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], reducedMotion || !parallax ? [0, 0] : [-8, 8]);

  const mediaFrame = (
    <div
      ref={triggerRef}
      className={cn(
        "group relative block w-full overflow-hidden rounded-[1.35rem] border border-border/18 bg-card/78 text-left leading-none shadow-[0_16px_34px_rgba(13,13,15,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        accentFocusRing ? "hover:ring-1 hover:ring-accentA/36" : "",
        className
      )}
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          unoptimized={shouldBypassNextImageOptimization(image.src)}
          className={cn("block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]", imageClassName)}
          sizes={sizes || "(max-width: 1024px) 100vw, 50vw"}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
      </motion.div>

      <span aria-hidden className="pointer-events-none absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/4" />

      {wipeReveal ? (
        <motion.span
          aria-hidden
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.56, ease: EASE }}
          className="pointer-events-none absolute inset-0 origin-left bg-bg/92"
        />
      ) : null}

      {accentStamp ? (
        <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-8 w-8 overflow-hidden rounded-tr-[1.35rem]">
          <span className="absolute inset-0 bg-accent-gradient [clip-path:polygon(100%_0,0_0,100%_100%)]" />
        </span>
      ) : null}

      {accentHairline ? (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent-gradient" />
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent-gradient" />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px bg-accent-gradient" />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px bg-accent-gradient" />
        </>
      ) : null}

      {!hideCaption && captionMode === "overlay" ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-white/14 bg-black/42 px-3 py-2 text-[0.58rem] uppercase tracking-[0.12em] text-ivory/72">
          <span className="block truncate">{image.caption}</span>
        </span>
      ) : null}
    </div>
  );

  const media = (
    <>
      {captionMode === "below" ? (
        <div className="space-y-2">
          {mediaFrame}
          {!hideCaption ? (
            <div className="space-y-1 px-1">
              <div className="h-px w-full bg-border/24" />
              <p className="text-[0.58rem] uppercase tracking-[0.13em] text-fg/58">{image.caption}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {captionMode === "side" ? (
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem]">
          {mediaFrame}
          {!hideCaption ? (
            <div className="self-end border-l border-border/24 pl-3 text-[0.58rem] uppercase tracking-[0.13em] text-fg/58">
              {image.caption}
            </div>
          ) : (
            <div aria-hidden />
          )}
        </div>
      ) : null}

      {captionMode === "overlay" ? mediaFrame : null}
    </>
  );

  return <>{media}</>;
}
