"use client";

import { useEffect, useMemo, useState } from "react";

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

  const [time, setTime] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(formatter.format(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, [formatter]);

  return <span aria-label="Toronto live time">Toronto {time}</span>;
}
