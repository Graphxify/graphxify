"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";
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
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "relative border-b border-border/18 bg-bg/96 backdrop-blur-xl transition-all duration-300",
          scrolled ? "shadow-[0_14px_34px_rgba(13,13,15,0.14)]" : "shadow-none"
        )}
      >
        <div className="pointer-events-none absolute left-1/2 -top-2 hidden -translate-x-1/2 md:block">
          <div className="pointer-events-auto rounded-b-[1.6rem] bg-graphite px-6 py-2 text-xs tracking-[0.08em] text-ivory dark:bg-ivory dark:text-graphite">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accentA" />
            Available for New Projects
          </div>
        </div>

        <div className="container flex h-20 items-center gap-4 md:h-24 md:items-end md:pb-3">
          <div className="w-44 shrink-0">
            <Link href="/" className="text-[0.9rem] font-semibold tracking-[0.24em] md:text-[0.95rem]">
              GRAPHXIFY
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
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
                      className="absolute inset-0 -z-10 rounded-full border border-border/24 bg-card/90"
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
            <Magnetic className="hidden md:block">
              <Button asChild size="sm">
                <Link href="/contact">Contact</Link>
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className="scrollbar-none flex gap-3 overflow-x-auto border-t border-border/14 px-4 py-3 md:hidden">
          {marketingNav.map((item) => {
            const active = item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("whitespace-nowrap rounded-full px-3 py-1.5 text-sm", active ? "bg-card/88 text-fg" : "text-fg/72")}
              >
                {item.label}
              </Link>
            );
          })}
          {showCms ? (
            <Link href="/dashboard" className="whitespace-nowrap rounded-full bg-card/88 px-3 py-1.5 text-sm text-fg">
              CMS
            </Link>
          ) : null}
          <Link href="/contact" className="whitespace-nowrap rounded-full bg-accent-gradient px-3 py-1.5 text-sm text-ivory">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
