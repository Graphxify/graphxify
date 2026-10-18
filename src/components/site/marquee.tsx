import { cn } from "@/lib/utils";

/** CSS-only seamless marquee (two copies, translate -50%). Static under reduced motion. */
export function Marquee({ children, className, duration = 40, label }: { children: React.ReactNode; className?: string; duration?: number; label?: string }): JSX.Element {
  return (
    <div className={cn("relative overflow-hidden", className)} aria-label={label} role={label ? "region" : undefined}>
      <div className="flex w-max motion-safe:animate-[marquee-x_var(--marquee-duration)_linear_infinite]" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
