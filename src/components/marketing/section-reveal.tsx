import type { ReactNode } from "react";
export function SectionReveal({
  children,
  className = "",
  effect: _effect = "up",
  once: _once = true,
}: {
  children: ReactNode;
  className?: string;
  effect?: string;
  once?: boolean;
}): JSX.Element {
  return <section className={className}>{children}</section>;
}
