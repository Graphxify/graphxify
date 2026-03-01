"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { marketingNav } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MarketingHeaderProps = {
  showCms: boolean;
};

export function MarketingHeader({ showCms }: MarketingHeaderProps): JSX.Element {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 pt-4 md:pt-6">
      <div className="pointer-events-none absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 md:block">
        <div className="pointer-events-auto rounded-b-[1.6rem] border border-border/28 bg-fg px-7 py-2 text-xs tracking-[0.12em] text-bg">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden />
          Available for New Projects
        </div>
      </div>

      <div
        className={cn(
          "border-y border-border/22 bg-bg/92 backdrop-blur transition-all duration-200",
          scrolled ? "shadow-[0_10px_26px_rgba(0,0,0,0.14)]" : "shadow-none"
        )}
      >
        <div className="container flex h-[4.5rem] items-center gap-4 md:h-20 md:pt-2">
          <div className="w-40 shrink-0">
            <Link href="/" className="text-[0.92rem] font-semibold tracking-[0.2em]">
              GRAPHXIFY
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {marketingNav.map((item) => {
              const active = item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[0.95rem] text-fg/72 transition-colors hover:text-fg",
                    active && "text-fg"
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="marketing-nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-border/30 bg-card"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {showCms ? (
              <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
                <Link href="/dashboard">CMS</Link>
              </Button>
            ) : null}
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/contact#inquiry">Start a project inquiry</Link>
            </Button>
          </div>
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto border-t border-border/16 px-4 py-3 md:hidden">
          {marketingNav.map((item) => {
            const active = item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm",
                  active ? "border-border/35 bg-card text-fg" : "border-transparent text-fg/72"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {showCms ? (
            <Link href="/dashboard" className="whitespace-nowrap rounded-full border border-border/30 bg-card px-3 py-1.5 text-sm text-fg">
              CMS
            </Link>
          ) : null}
          <Link href="/contact#inquiry" className="whitespace-nowrap rounded-full bg-fg px-3 py-1.5 text-sm text-bg">
            Start inquiry
          </Link>
        </div>
      </div>
    </header>
  );
}
