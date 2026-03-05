"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ctaSentence = "a brand and website built to scale.";
const MAGNETIC_PROXIMITY_PX = 72;
const MAGNETIC_MAX_OFFSET_PX = 6;
const BASE_BUTTON_SHADOW = "0 10px 20px rgba(13,13,15,0.11)";
const HOVER_BUTTON_SHADOW = "0 18px 34px rgba(0,82,204,0.24)";
const IDLE_BOUNCE_TIMES = [0, 0.05, 0.1, 0.15, 0.2, 1];
const PREMIUM_EASE: [number, number, number, number] = [0.3, 0.7, 0, 1];

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function SiteCtaSection({ className }: { className?: string }): JSX.Element {
  const reducedMotion = useReducedMotion();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const buttonFrameRef = useRef<HTMLDivElement>(null);
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springMagneticX = useSpring(magneticX, { stiffness: 240, damping: 24, mass: 0.42 });
  const springMagneticY = useSpring(magneticY, { stiffness: 240, damping: 24, mass: 0.42 });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (direction === "forward") {
      if (charIndex < ctaSentence.length) {
        timeout = setTimeout(() => setCharIndex((prev) => prev + 1), 40);
      } else {
        timeout = setTimeout(() => setDirection("backward"), 1200);
      }
    } else if (charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((prev) => prev - 1), 22);
    } else {
      timeout = setTimeout(() => setDirection("forward"), 350);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, direction]);

  useEffect(() => {
    if (reducedMotion) {
      magneticX.set(0);
      magneticY.set(0);
      return;
    }

    const handlePointerMove = (event: PointerEvent): void => {
      const element = buttonFrameRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isWithinProximity =
        event.clientX >= rect.left - MAGNETIC_PROXIMITY_PX &&
        event.clientX <= rect.right + MAGNETIC_PROXIMITY_PX &&
        event.clientY >= rect.top - MAGNETIC_PROXIMITY_PX &&
        event.clientY <= rect.bottom + MAGNETIC_PROXIMITY_PX;

      if (!isWithinProximity) {
        magneticX.set(0);
        magneticY.set(0);
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;

      const maxDistance = Math.hypot(rect.width / 2 + MAGNETIC_PROXIMITY_PX, rect.height / 2 + MAGNETIC_PROXIMITY_PX);
      const distance = Math.hypot(deltaX, deltaY);
      const strength = clamp(1 - distance / maxDistance, 0, 1);
      const maxOffset = (isButtonHovered ? MAGNETIC_MAX_OFFSET_PX : MAGNETIC_MAX_OFFSET_PX - 2) * strength;
      const normalizedX = clamp(deltaX / Math.max(1, rect.width / 2), -1, 1);
      const normalizedY = clamp(deltaY / Math.max(1, rect.height / 2), -1, 1);

      magneticX.set(normalizedX * maxOffset);
      magneticY.set(normalizedY * maxOffset);
    };

    const resetMagnetism = (): void => {
      magneticX.set(0);
      magneticY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetMagnetism);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetMagnetism);
    };
  }, [isButtonHovered, magneticX, magneticY, reducedMotion]);

  const typedSentence = useMemo(() => ctaSentence.slice(0, charIndex), [charIndex]);

  return (
    <section className={cn("section-shell border-border/18 bg-card/76 p-6 text-center md:p-8", className)}>
      <h2 className="text-2xl font-semibold md:text-3xl">
        Ready to <span className="text-accentA">Build</span>
      </h2>
      <p className="mx-auto mt-3 min-h-[1.6rem] max-w-2xl text-fg/66 md:min-h-[1.8rem]">
        {typedSentence}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
          className="ml-1 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] rounded-sm bg-accentA align-baseline"
          aria-hidden
        />
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div ref={buttonFrameRef} className="relative inline-flex">
          <motion.div
            className="pointer-events-none absolute -inset-[2px] rounded-[14px] bg-[linear-gradient(90deg,#00A3FF,#0052CC)] blur-[12px]"
            animate={
              reducedMotion
                ? { opacity: 0, scale: 1 }
                : isButtonHovered
                  ? { opacity: 0.28, scale: 1.04 }
                  : {
                      opacity: [0, 0.28, 0.12, 0.2, 0, 0],
                      scale: [1, 1.08, 1.02, 1.06, 1, 1]
                    }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : isButtonHovered
                  ? { duration: 0.25, ease: PREMIUM_EASE }
                  : {
                      duration: 4,
                      times: IDLE_BOUNCE_TIMES,
                      ease: PREMIUM_EASE,
                      repeat: Infinity
                    }
            }
            aria-hidden
          />
          <motion.div
            className="inline-flex"
            animate={
              reducedMotion
                ? { y: 0, scale: 1, boxShadow: BASE_BUTTON_SHADOW }
                : isButtonHovered
                  ? { y: -5, scale: 1.05, boxShadow: HOVER_BUTTON_SHADOW }
                  : {
                      y: [0, -10, 0, -6, 0, 0],
                      boxShadow: [
                        BASE_BUTTON_SHADOW,
                        HOVER_BUTTON_SHADOW,
                        BASE_BUTTON_SHADOW,
                        "0 14px 27px rgba(0,82,204,0.2)",
                        BASE_BUTTON_SHADOW,
                        BASE_BUTTON_SHADOW
                      ]
                    }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : isButtonHovered
                  ? { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
                  : {
                      duration: 4,
                      times: IDLE_BOUNCE_TIMES,
                      ease: PREMIUM_EASE,
                      repeat: Infinity
                    }
            }
            onHoverStart={() => setIsButtonHovered(true)}
            onHoverEnd={() => setIsButtonHovered(false)}
            whileTap={reducedMotion ? undefined : { y: -1, scale: 1.01 }}
          >
            <motion.div className="inline-flex" style={reducedMotion ? undefined : { x: springMagneticX, y: springMagneticY }}>
              <Button asChild size="lg" className="px-6">
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <span>Start a Project</span>
                  <motion.span
                    className="inline-flex"
                    animate={reducedMotion ? { x: 0 } : isButtonHovered ? { x: [0, 8, 6] } : { x: 0 }}
                    transition={{ duration: 0.32, ease: PREMIUM_EASE }}
                    aria-hidden
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
