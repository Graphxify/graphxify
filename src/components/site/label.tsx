import { Badge } from "@/components/site/badge";

/** v3 name kept for existing markup; renders the v4 Badge. */
export function Label({ children, className }: { children: React.ReactNode; className?: string; as?: "p" | "span" | "h2" }): JSX.Element {
  return <Badge className={className}>{children}</Badge>;
}
