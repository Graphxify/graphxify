import { cn } from "@/lib/utils";

type Dot = "green" | "blue" | "ink" | "none";

/** White pill above section titles and in heroes. A green dot means "live / available". */
export function Badge({ children, dot = "ink", icon, className, tone = "light" }: { children: React.ReactNode; dot?: Dot; icon?: React.ReactNode; className?: string; tone?: "light" | "dark" }): JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5 text-[0.8125rem] font-semibold",
        tone === "light" ? "bg-white text-fg shadow-[0_1px_2px_rgba(10,10,10,0.06)]" : "bg-white/10 text-white",
        className
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-fg text-white [&>svg]:h-3.5 [&>svg]:w-3.5">
          {icon}
        </span>
      ) : dot !== "none" ? (
        <span aria-hidden="true" className="relative ml-1 mr-0.5 flex h-2 w-2">
          {dot === "green" ? <span className="absolute inset-0 animate-ping rounded-full bg-green/70 motion-reduce:hidden" /> : null}
          <span className={cn("relative h-2 w-2 rounded-full", dot === "green" && "bg-green", dot === "blue" && "bg-accentA", dot === "ink" && (tone === "light" ? "bg-fg" : "bg-white"))} />
        </span>
      ) : null}
      {children}
    </span>
  );
}
