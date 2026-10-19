"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky pill navigator for the /process stages; marks the stage in view. Desktop only. */
export function ProcessStageNav({ stages }: { stages: { id: string; title: string }[] }): JSX.Element {
  const [active, setActive] = useState(stages[0]?.id);

  useEffect(() => {
    // Last stage whose top has passed the middle of the viewport; the first one above that.
    const update = () => {
      let current = stages[0]?.id;
      for (const stage of stages) {
        const el = document.getElementById(stage.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight / 2) current = stage.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [stages]);

  return (
    <nav aria-label="Process stages" className="sticky top-[6.25rem] z-30 hidden justify-center md:flex">
      <ol className="flex gap-1 rounded-full bg-white/95 p-1.5 shadow-[0_12px_40px_-16px_rgba(10,10,10,0.22)]">
        {stages.map((stage, index) => {
          const current = active === stage.id;
          return (
            <li key={stage.id}>
              <a
                href={`#${stage.id}`}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-[0.875rem] font-semibold transition-colors duration-200",
                  current ? "bg-fg text-white" : "text-fg/64 hover:bg-bg hover:text-fg"
                )}
              >
                <span aria-hidden="true" className={cn("grid h-7 w-7 place-items-center rounded-full text-[0.75rem] font-extrabold", current ? "bg-white text-fg" : "bg-bg text-fg")}>
                  {index + 1}
                </span>
                {stage.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
