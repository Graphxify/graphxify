"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GraphxifyLogo } from "@/components/marketing/graphxify-logo";
import { Button } from "@/components/ui/button";
import { companyContact, marketingNav, services } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MarketingHeader({
  cmsHref = null,
}: {
  cmsHref?: string | null;
}): JSX.Element {
  const rawPathname = usePathname();
  // Vercel prerenders the homepage as "/index"; normalise so server and client agree (avoids hydration error #418).
  const pathname = !rawPathname || rawPathname === "/index" ? "/" : rawPathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resolvedCmsHref, setResolvedCmsHref] = useState<string | null>(
    cmsHref,
  );
  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    // The CMS button is only for signed-in staff. Supabase-js (~200 KB) used to
    // load on every public page just to find that out; now it is fetched only
    // when a Supabase auth cookie ("sb-<ref>-auth-token", possibly chunked) is
    // present, so anonymous visitors and crawlers never download it.
    if (!/(?:^|;\s*)sb-[^=;]*-auth-token(?:\.\d+)?=/.test(document.cookie)) {
      return;
    }

    let mounted = true;
    let unsubscribe: (() => void) | null = null;

    void import("@/lib/supabase/browser").then(({ createClient }) => {
      if (!mounted) return;
      // onAuthStateChange fires INITIAL_SESSION immediately on subscribe.
      const {
        data: { subscription },
      } = createClient().auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setResolvedCmsHref(session?.user ? "/dashboard" : null);
        }
      });
      unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    // IntersectionObserver on a top sentinel instead of a scroll listener.
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;height:8px;width:1px;pointer-events:none";
    document.body.prepend(sentinel);
    const io = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.mobileMenuOpen = "true";
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      delete document.body.dataset.mobileMenuOpen;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      {/* Blur lives on this bar, not the header: backdrop-filter would trap the fixed mobile sheet. */}
      <div
        className={cn(
          "mx-auto max-w-[1100px] rounded-[1.25rem] bg-white/80 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300",
          scrolled || mobileOpen ? "shadow-[0_12px_40px_-16px_rgba(10,10,10,0.22)]" : "shadow-[0_1px_2px_rgba(10,10,10,0.05)]",
        )}
      >
        <div className="flex h-16 items-center gap-6 pl-5 pr-2.5 md:h-[4.25rem] md:pl-6">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center"
            aria-label="Graphxify home"
          >
            <GraphxifyLogo
              alt="Graphxify"
              width={246}
              height={68}
              priority
              className="h-auto w-[7.75rem] md:w-[8.5rem]"
            />
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {marketingNav.map((item) => {
                const active = isActive(item.href);
                const isServices = item.href === "/services";
                return (
                  <li
                    key={item.href}
                    className={cn("relative", isServices && "group/menu")}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex h-10 items-center gap-1 rounded-full px-4 text-[0.9375rem] font-semibold transition-colors duration-200",
                        active ? "bg-bg text-fg" : "text-fg/64 hover:text-fg",
                      )}
                    >
                      {item.label}
                      {isServices ? (
                        <ChevronDown
                          className="h-3.5 w-3.5 transition-transform duration-200 group-hover/menu:rotate-180"
                          aria-hidden="true"
                        />
                      ) : null}
                    </Link>

                    {isServices ? (
                      <div className="invisible absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,visibility,transform] duration-200 ease-out group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100">
                        <ul className="grid grid-cols-2 gap-1 rounded-[1.5rem] bg-white p-2 shadow-[0_30px_60px_-24px_rgba(10,10,10,0.3)]">
                          {services.map((service) => (
                            <li key={service.key}>
                              <Link
                                href={`/services/${service.key}`}
                                className={cn(
                                  "group/item block rounded-2xl p-4 transition-colors duration-200 hover:bg-bg",
                                  isActive(`/services/${service.key}`) &&
                                    "bg-surface",
                                )}
                              >
                                <span className="flex items-center gap-2 text-[0.9375rem] font-bold text-fg">
                                  <span
                                    aria-hidden="true"
                                    className="h-1.5 w-1.5 rounded-full bg-accentB opacity-0 transition-opacity group-hover/item:opacity-100"
                                  />
                                  {service.title}
                                </span>
                                <span className="mt-1 block text-[0.8125rem] leading-snug text-fg/60">
                                  {service.outcome}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            {resolvedCmsHref ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden lg:inline-flex"
              >
                <Link href={resolvedCmsHref} prefetch={false}>
                  CMS
                </Link>
              </Button>
            ) : null}
            <Button asChild className="hidden sm:inline-flex">
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
              >
                Start a project
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-marketing-nav"
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-fg text-white lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: full-screen sheet below the bar */}
      <div
        id="mobile-marketing-nav"
        hidden={!mobileOpen}
        className="fixed inset-0 top-0 z-[-1] overflow-y-auto bg-bg pt-24 lg:hidden"
      >
        <nav
          aria-label="Mobile"
          className="container flex min-h-full flex-col pb-10 pt-6"
        >
          <ul className="border-t border-border/10">
            {marketingNav.map((item) => (
              <li key={item.href} className="border-b border-border/10">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-center justify-between py-5 text-[2rem] font-extrabold tracking-[-0.04em] text-fg"
                >
                  {item.label}
                  <ArrowRight
                    className="h-5 w-5 text-fg/40"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <p className="t-small mt-10 font-bold">Services</p>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {services.map((service) => (
              <li key={service.key}>
                <Link
                  href={`/services/${service.key}`}
                  className="block rounded-2xl bg-white p-4 text-[0.9375rem] font-bold text-fg"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10">
            <Button asChild size="lg" className="w-full">
              <Link href="/contact">Start a project</Link>
            </Button>
            {resolvedCmsHref ? (
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mt-3 w-full"
              >
                <Link href={resolvedCmsHref} prefetch={false}>
                  Open CMS
                </Link>
              </Button>
            ) : null}
            <div className="mt-6 flex flex-col gap-2 text-[0.9375rem] text-fg/70">
              <a
                href={`mailto:${companyContact.email}`}
                className="inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-accentB" aria-hidden="true" />
                {companyContact.email}
              </a>
              <a
                href={`tel:${companyContact.phoneHref}`}
                className="inline-flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-accentB" aria-hidden="true" />
                {companyContact.phoneDisplay}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
