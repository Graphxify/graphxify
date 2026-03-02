"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function CountUpNumber({
  to,
  start = 0,
  duration = 1,
  delay = 0,
  className
}: {
  to: number;
  start?: number;
  duration?: number;
  delay?: number;
  className?: string;
}): JSX.Element {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -14% 0px" });
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const controls = animate(start, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest))
    });

    return () => {
      controls.stop();
    };
  }, [delay, duration, inView, start, to]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
    </span>
  );
}

