"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GraphxifyLogo } from "@/components/marketing/graphxify-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { marketingNav } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MarketingHeader({ cmsHref = null }: { cmsHref?: string | null }): JSX.Element {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resolvedCmsHref, setResolvedCmsHref] = useState<string | null>(cmsHref);
  const centerNav = marketingNav.filter((item) => item.href !== "/contact");
  const isRouteActive = (href: string): boolean =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const contactActive = isRouteActive("/contact");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let mounted = true;

    // onAuthStateChange fires INITIAL_SESSION immediately on subscribe —
    // no need for a separate getSession() call.
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setResolvedCmsHref(session?.user ? "/dashboard" : null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
    const originalOverflow = document.body.style.overflow;
    document.body.dataset.mobileMenuOpen = mobileOpen ? "true" : "false";

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      delete document.body.dataset.mobileMenuOpen;
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
            "container relative mt-8 flex min-h-[68px] items-center gap-3 rounded-[1.1rem] border border-border/22 bg-bg px-3 transition-all duration-300 sm:mt-8 sm:min-h-[72px] sm:px-4 lg:mt-12 lg:h-[80px] lg:px-6",
            scrolled
              ? "shadow-[0_18px_38px_rgba(13,13,15,0.16)]"
              : "shadow-[0_8px_24px_rgba(13,13,15,0.1)]"
          )}
        >
          <div className="pointer-events-none absolute inset-0 z-0 rounded-[1.25rem] ring-1 ring-white/20 dark:ring-white/10" />

          <div
            className={cn(
              "relative z-10 w-40 shrink-0 transition-[filter,opacity] duration-200 sm:w-48 lg:w-[13.5rem]",
              mobileOpen && "blur-sm opacity-45 lg:blur-0 lg:opacity-100"
            )}
          >
            <Link href="/" className="inline-flex items-center" aria-label="Graphxify home">
              <GraphxifyLogo
                alt="Graphxify"
                width={246}
                height={68}
                priority
                className="h-auto w-[8rem] sm:w-[8.9rem] lg:w-[9.8rem]"
              />
            </Link>
          </div>

          <nav className="relative z-10 hidden flex-1 items-center justify-center gap-1 lg:flex">
            {centerNav.map((item) => {
              const active = isRouteActive(item.href);
              const isServices = item.href === "/services";
              return (
                <div key={item.href} className={isServices ? "group/services relative" : "relative"}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative rounded-full px-4 py-2.5 text-[0.9rem] font-medium text-fg/72 transition-colors duration-150 hover:-translate-y-[1px] hover:text-fg",
                      active && "text-fg"
                    )}
                  >
                    <span className="absolute inset-[1px] -z-10 scale-95 rounded-full bg-card/84 opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-100" />
                    <span className="absolute inset-x-4 bottom-[0.38rem] h-[1.5px] origin-left scale-x-0 rounded-full bg-accent-gradient transition-transform duration-200 group-hover:scale-x-100" />
                    {active ? <span className="absolute inset-0 -z-10 rounded-full border border-border/24 bg-card/92" /> : null}
                    {item.label}
                  </Link>
                  {isServices ? (
                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-[opacity,visibility,transform] duration-200 ease-out group-hover/services:visible group-hover/services:translate-y-0 group-hover/services:opacity-100">
                      <div className="relative min-w-[14.5rem] overflow-hidden rounded-[1rem] border border-border/22 bg-bg py-2 shadow-[0_20px_48px_rgba(13,13,15,0.28)]">
                        {/* top accent line */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accentA/30 to-transparent" />
                        {[
                          { label: "Brand Systems", href: "/services/brand-systems" },
                          { label: "Web Design", href: "/services/web-design" },
                          { label: "Web Development", href: "/services/web-development" },
                          { label: "CMS Architecture", href: "/services/cms-architecture" }
                        ].map((sub) => {
                          const subActive = isRouteActive(sub.href);
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "group/item relative mx-1.5 flex items-center rounded-[0.6rem] px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
                                subActive
                                  ? "bg-accentA/8 text-accentA"
                                  : "text-fg/60 hover:bg-card/70 hover:text-fg"
                              )}
                            >
                              {/* left accent bar */}
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-r-full bg-accent-gradient transition-[opacity,transform] duration-200",
                                  subActive
                                    ? "opacity-100"
                                    : "scale-y-50 opacity-0 group-hover/item:scale-y-100 group-hover/item:opacity-100"
                                )}
                              />
                              <span className="relative">{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="relative z-10 ml-auto hidden items-center gap-2.5 lg:flex">
            <ThemeToggle className="hidden lg:inline-flex" />
            {resolvedCmsHref ? (
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="hidden rounded-lg border border-border/24 px-5 text-sm lg:inline-flex"
              >
                <Link href={resolvedCmsHref} prefetch={false}>CMS</Link>
              </Button>
            ) : null}
            <Button
              asChild
              size="lg"
              className={cn(
                "hidden rounded-lg border px-6 text-sm text-ivory lg:inline-flex",
                contactActive
                  ? "border-accentA/55 bg-accent-gradient shadow-[0_12px_26px_rgba(0,128,255,0.22)]"
                  : "border-border/24 bg-accent-gradient shadow-[0_10px_22px_rgba(13,13,15,0.18)]"
              )}
            >
              <Link href="/contact">Contact</Link>
            </Button>
          </div>

          <div className="relative z-[70] ml-auto flex items-center gap-2 lg:hidden">
            <div
              className={cn(
                "transition-[filter,opacity] duration-200",
                mobileOpen && "blur-xl opacity-15 scale-95"
              )}
            >
              <ThemeToggle className="h-10 w-[4.2rem] border-border/12 bg-card/24 shadow-[0_4px_14px_rgba(13,13,15,0.05)] backdrop-blur-2xl dark:border-white/8 dark:bg-card/18" />
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-marketing-nav"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition-[border-color,background-color,box-shadow,color] duration-300",
                mobileOpen
                  ? "border-accentA bg-accent-gradient text-white shadow-[0_0_0_3px_rgba(0,163,255,0.18),0_10px_24px_rgba(0,100,220,0.32)]"
                  : "border-border/28 bg-card/82 text-fg/75 hover:border-accentA/40 hover:bg-card hover:text-fg"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    className="inline-flex"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <X className="h-5 w-5" strokeWidth={2.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    className="inline-flex"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Menu className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                aria-hidden="true"
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-graphite/65 backdrop-blur-[2px] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              />

              {/* Menu panel */}
              <motion.div
                id="mobile-marketing-nav"
                className="absolute left-3 right-3 top-full z-[60] mt-2.5 overflow-hidden rounded-[1.35rem] border border-border/24 bg-bg/96 shadow-[0_0_0_1px_rgba(0,163,255,0.07),0_32px_64px_rgba(13,13,15,0.22)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-graphite/[0.97] dark:shadow-[0_0_0_1px_rgba(0,163,255,0.07),0_32px_64px_rgba(13,13,15,0.65)] lg:hidden"
                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Accent gradient top line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accentA/55 to-transparent" />

                {/* Nav items */}
                <nav className="grid gap-[3px] px-2 pb-1 pt-3">
                  {centerNav.map((item, index) => {
                    const active = isRouteActive(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.055 + 0.08, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-[0.875rem] px-4 py-3.5 transition-[background,color] duration-200",
                            active
                              ? "bg-gradient-to-r from-accentA/10 to-accentB/5 text-fg dark:text-ivory"
                              : "text-fg/60 hover:bg-card/80 hover:text-fg dark:text-ivory/50 dark:hover:bg-white/[0.05] dark:hover:text-ivory/85"
                          )}
                        >
                          {/* Left accent bar for active */}
                          {active ? (
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent-gradient"
                            />
                          ) : null}
                          {/* Index number */}
                          <span className="w-5 shrink-0 text-[0.52rem] font-semibold tabular-nums tracking-[0.1em] text-fg/26 dark:text-ivory/20">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {/* Label */}
                          <span className="flex-1 text-[0.9375rem] font-medium">{item.label}</span>
                          {/* Active glow dot / hover arrow */}
                          {active ? (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accentA shadow-[0_0_8px_rgba(0,163,255,0.85)]" />
                          ) : (
                            <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-55" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Divider */}
                <div className="mx-4 my-1 h-px bg-gradient-to-r from-transparent via-border/22 to-transparent dark:via-white/[0.07]" />

                {/* CTA area */}
                <motion.div
                  className="p-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: centerNav.length * 0.055 + 0.1, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {resolvedCmsHref ? (
                    <Link
                      href={resolvedCmsHref}
                      prefetch={false}
                      className="mb-2 flex w-full items-center justify-center rounded-[0.875rem] border border-border/24 bg-card px-4 py-3.5 text-[0.9375rem] font-semibold text-fg transition-colors duration-200 hover:bg-card/86 dark:border-white/[0.1] dark:bg-card/80 dark:text-ivory/88 dark:hover:bg-white/[0.06] dark:hover:text-ivory"
                    >
                      Open CMS
                    </Link>
                  ) : null}
                  <Link
                    href="/contact"
                    className="group relative flex w-full items-center justify-center overflow-hidden rounded-[0.875rem] bg-accent-gradient px-4 py-3.5 text-[0.9375rem] font-semibold text-ivory shadow-[0_6px_20px_rgba(0,100,220,0.28)] transition-shadow duration-200 hover:shadow-[0_10px_30px_rgba(0,100,220,0.42)]"
                  >
                    {/* Shimmer sweep on hover */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/18 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    <span className="relative">Start a Project</span>
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
