"use client";

import { useEffect, useMemo, useRef } from "react";

export function TorontoClock(): JSX.Element {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/Toronto"
      }),
    []
  );

  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      if (spanRef.current) {
        spanRef.current.textContent = `Toronto ${formatter.format(new Date())}`;
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [formatter]);

  return (
    <span ref={spanRef} aria-label="Toronto live time" suppressHydrationWarning>
      Toronto --:--:--
    </span>
  );
}
