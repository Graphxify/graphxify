"use client";

import { useEffect, useRef } from "react";
import { HONEYPOT_FIELD, STARTED_ATTR } from "@/lib/forms/bot-trap";

/**
 * Invisible anti-bot trap. Place inside a <form>: stamps when the form appeared and renders a
 * honeypot input that people never see (off-screen, unfocusable) but form-filling bots do.
 */
export function BotTrap(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.closest("form")?.setAttribute(STARTED_ATTR, String(Date.now()));
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
