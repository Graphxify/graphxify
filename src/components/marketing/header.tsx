"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { marketingNav } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MarketingHeaderProps = {
  showCms: boolean;
};

export function MarketingHeader(_: MarketingHeaderProps): JSX.Element {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const centerNav = marketingNav.filter((item) => item.href !== "/contact");
  const isRouteActive = (href: string): boolean =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const contactActive = isRouteActive("/contact");
  const mobileNavItemClass = (active: boolean): string =>
    cn(
      "rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
      active ? "bg-accent-gradient text-ivory shadow-[0_10px_20px_rgba(0,128,255,0.2)]" : "text-fg/78 hover:bg-card/82 hover:text-fg"
    );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "relative bg-transparent transition-all duration-300",
          scrolled ? "pb-2 pt-1.5" : "pb-3 pt-2"
        )}
      >
        <div className="pointer-events-none absolute left-1/2 -top-[1px] z-20 max-w-[calc(100%-1.5rem)] -translate-x-1/2">
          <div className="pointer-events-auto whitespace-nowrap rounded-b-[1.45rem] border border-border/25 border-t-0 bg-graphite px-4 py-1.5 text-[0.7rem] tracking-[0.02em] text-ivory shadow-[0_12px_24px_rgba(13,13,15,0.24)] sm:rounded-b-[1.75rem] sm:px-6 sm:py-2 sm:text-xs lg:rounded-b-[2rem] lg:px-8 lg:py-2.5 lg:text-sm dark:bg-ivory dark:text-graphite">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accentA" />
            Available for New Projects
          </div>
        </div>

        <div
          className={cn(
            "container relative mt-8 flex min-h-[68px] items-center gap-3 overflow-hidden rounded-[1.1rem] border border-border/22 bg-bg px-3 transition-all duration-300 sm:mt-8 sm:min-h-[72px] sm:px-4 lg:mt-12 lg:h-[80px] lg:px-6",
            scrolled
              ? "shadow-[0_18px_38px_rgba(13,13,15,0.16)]"
              : "shadow-[0_8px_24px_rgba(13,13,15,0.1)]"
          )}
        >
          <div className="pointer-events-none absolute inset-0 z-0 rounded-[1.25rem] ring-1 ring-white/20 dark:ring-white/10" />

          <div className="relative z-10 w-40 shrink-0 sm:w-48 lg:w-[13.5rem]">
            <Link href="/" className="inline-flex items-center" aria-label="Graphxify home">
              <Image
                src="/assets/Graphxify-Logo-Black.webp"
                alt="Graphxify"
                width={246}
                height={68}
                priority
                className="h-auto w-[8rem] dark:hidden sm:w-[8.9rem] lg:w-[9.8rem]"
              />
              <Image
                src="/assets/Graphxify-Logo-white.webp"
                alt="Graphxify"
                width={246}
                height={68}
                priority
                className="hidden h-auto w-[8rem] dark:block sm:w-[8.9rem] lg:w-[9.8rem]"
              />
            </Link>
          </div>

          <nav className="relative z-10 hidden flex-1 items-center justify-center gap-1 lg:flex">
            {centerNav.map((item) => {
              const active = isRouteActive(item.href);
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

          <div className="relative z-10 ml-auto hidden items-center gap-2.5 lg:flex">
            <ThemeToggle className="hidden lg:inline-flex" />
            <Magnetic className="hidden lg:block">
              <Button
                asChild
                size="lg"
                className={cn(
                  "rounded-lg border px-6 text-sm text-ivory",
                  contactActive
                    ? "border-accentA/55 bg-accent-gradient shadow-[0_12px_26px_rgba(0,128,255,0.22)]"
                    : "border-border/24 bg-accent-gradient shadow-[0_10px_22px_rgba(13,13,15,0.18)]"
                )}
              >
                <Link href="/contact">Contact</Link>
              </Button>
            </Magnetic>
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-marketing-nav"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
                mobileOpen
                  ? "border-accentA/45 bg-accent-gradient text-ivory shadow-[0_12px_22px_rgba(0,128,255,0.24)]"
                  : "border-border/24 bg-card/82 text-fg/82 hover:bg-card"
              )}
            >
              <motion.span
                key={mobileOpen ? "close" : "menu"}
                initial={{ rotate: mobileOpen ? -35 : 35, opacity: 0, scale: 0.9 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: mobileOpen ? 35 : -35, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex"
              >
                {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-40 bg-transparent lg:hidden"
              />
              <motion.div
                id="mobile-marketing-nav"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-4 right-4 top-full z-[60] mt-3 overflow-hidden rounded-2xl border border-border/20 bg-bg p-3 shadow-[0_18px_36px_rgba(13,13,15,0.2)] lg:hidden"
              >
                <nav className="grid gap-1.5">
                  {centerNav.map((item) => {
                    const active = isRouteActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={mobileNavItemClass(active)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  <Link href="/contact" className={mobileNavItemClass(contactActive)}>
                    Contact
                  </Link>
                </nav>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
