"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function ScrollWord({
  progress,
  range,
  children
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}): JSX.Element {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [8, 0]);
  const filter = useTransform(progress, range, ["blur(2.5px)", "blur(0px)"]);

  return (
    <motion.span style={{ opacity, y, filter }} className="mr-[0.38em] inline-block text-fg">
      {children}
    </motion.span>
  );
}

export function ScrollFillText({ text, className }: { text: string; className?: string }): JSX.Element {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const words = text.trim().split(/\s+/);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.35"]
  });

  return (
    <p ref={ref} className={cn("leading-[1.35] tracking-tight", className)}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;
        return (
          <ScrollWord key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </ScrollWord>
        );
      })}
    </p>
  );
}
