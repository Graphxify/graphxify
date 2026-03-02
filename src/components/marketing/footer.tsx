import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "@/components/marketing/back-to-top";
import { siteConfig } from "@/lib/constants";

const footerLinks = [
  { href: "/works", label: "Works" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" }
];

export function MarketingFooter(): JSX.Element {
  return (
    <footer className="relative mt-24 border-t border-border/20 bg-bg">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center" aria-label="Graphxify home">
            <Image src="/assets/Graphxify-Logo-Black.webp" alt="Graphxify" width={246} height={68} className="h-auto w-[8.9rem] dark:hidden md:w-[9.8rem]" />
            <Image src="/assets/Graphxify-Logo-white.webp" alt="Graphxify" width={246} height={68} className="hidden h-auto w-[8.9rem] dark:block md:w-[9.8rem]" />
          </Link>
          <p className="max-w-md text-sm text-fg/68">
            Premium agency platform blending brand systems, high-comfort UX, and operational CMS governance.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-fg/64">Explore</p>
          <div className="flex flex-col gap-2">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="link-sweep w-fit text-sm text-fg/78">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-fg/64">Legal</p>
          <div className="flex flex-col gap-2">
            <Link href="/privacy" className="link-sweep w-fit text-sm text-fg/78">
              Privacy
            </Link>
            <Link href="/terms" className="link-sweep w-fit text-sm text-fg/78">
              Terms
            </Link>
          </div>
          <div className="pt-2">
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
