"use client";

import Image from "next/image";
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
  const centerNav = marketingNav.filter((item) => item.href !== "/contact");

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
          "relative bg-bg/22 transition-all duration-300 supports-[backdrop-filter]:backdrop-blur-lg",
          scrolled ? "pb-2 pt-1.5" : "pb-3 pt-2"
        )}
      >
        <div className="pointer-events-none absolute left-1/2 -top-[1px] hidden -translate-x-1/2 md:block">
          <div className="pointer-events-auto rounded-b-[2rem] border border-border/25 border-t-0 bg-graphite px-8 py-2.5 text-sm tracking-[0.02em] text-ivory shadow-[0_12px_24px_rgba(13,13,15,0.24)] dark:bg-ivory dark:text-graphite">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accentA" />
            Available for New Projects
          </div>
        </div>

        <div
          className={cn(
            "container relative mt-10 flex h-[74px] items-center gap-4 overflow-hidden rounded-[1.25rem] border border-border/22 bg-bg/55 px-4 backdrop-blur-[24px] transition-all duration-300 supports-[backdrop-filter]:bg-bg/42 md:mt-12 md:h-[80px] md:px-6",
            scrolled
              ? "shadow-[0_18px_38px_rgba(13,13,15,0.16)]"
              : "shadow-[0_8px_24px_rgba(13,13,15,0.1)]"
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(242,240,235,0.2)_0%,rgba(242,240,235,0.04)_38%,rgba(242,240,235,0.12)_100%)] dark:bg-[linear-gradient(115deg,rgba(242,240,235,0.12)_0%,rgba(242,240,235,0.02)_44%,rgba(242,240,235,0.08)_100%)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-1 ring-white/20 dark:ring-white/10" />

          <div className="w-48 shrink-0 md:w-[13.5rem]">
            <Link href="/" className="inline-flex items-center" aria-label="Graphxify home">
              <Image
                src="/assets/Graphxify-Logo-Black.webp"
                alt="Graphxify"
                width={246}
                height={68}
                priority
                className="h-auto w-[10.8rem] dark:hidden md:w-[11.8rem]"
              />
              <Image
                src="/assets/Graphxify-Logo-white.webp"
                alt="Graphxify"
                width={246}
                height={68}
                priority
                className="hidden h-auto w-[10.8rem] dark:block md:w-[11.8rem]"
              />
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {centerNav.map((item) => {
              const active = item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative rounded-full px-4 py-2.5 text-[0.9rem] font-medium text-fg/72 transition-all duration-300 hover:-translate-y-[1px] hover:text-fg",
                    active && "text-fg"
                  )}
                >
                  <span className="absolute inset-[1px] -z-10 scale-95 rounded-full bg-card/84 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                  <span className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_20%_0%,rgba(0,163,255,0.18),transparent_58%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute inset-x-4 bottom-[0.38rem] h-[1.5px] origin-left scale-x-0 rounded-full bg-accent-gradient transition-transform duration-300 group-hover:scale-x-100" />
                  {active ? (
                    <motion.span
                      layoutId="marketing-nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-border/24 bg-card/92"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <ThemeToggle className="hidden md:inline-flex" />
            {showCms ? (
              <Button asChild variant="secondary" size="sm" className="hidden rounded-full border-border/24 bg-card/86 px-5 md:inline-flex">
                <Link href="/dashboard">CMS</Link>
              </Button>
            ) : null}
            <Magnetic className="hidden md:block">
              <Button asChild size="sm" className="rounded-full border border-border/24 bg-accent-gradient px-7 text-sm text-ivory shadow-[0_10px_22px_rgba(13,13,15,0.18)]">
                <Link href="/contact">Contact</Link>
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className="scrollbar-none mt-3 flex gap-3 overflow-x-auto border-t border-border/14 px-4 py-3 md:hidden">
          {centerNav.map((item) => {
            const active = item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition",
                  active ? "bg-card/88 text-fg" : "text-fg/72"
                )}
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
          <ThemeToggle />
          <Link href="/contact" className="whitespace-nowrap rounded-full bg-accent-gradient px-3 py-1.5 text-sm text-ivory">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
