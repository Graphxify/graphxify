import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Text link whose arrow nudges on hover. */
export function ArrowLink({ href, children, className, external = false, tone = "light" }: { href: string; children: React.ReactNode; className?: string; external?: boolean; tone?: "light" | "dark" }): JSX.Element {
  const cls = cn(
    "group/al inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline-offset-4 hover:underline",
    tone === "light" ? "text-fg" : "text-white",
    className
  );
  const inner = (
    <>
      {children}
      <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 ease-out group-hover/al:-translate-y-0.5 group-hover/al:translate-x-0.5" />
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
