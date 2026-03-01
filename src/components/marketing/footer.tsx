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
<<<<<<< HEAD
          <p className="text-sm tracking-[0.24em]">GRAPHXIFYy</p>
          <p className="max-w-md text-sm text-fg/68">
            Premium agency platform blending brand systems, high-comfort UX, and operational CMS governance.
          </p>
          <p className="text-sm text-fg/62">
            <TorontoClock />
          </p>
=======
          <p className="text-sm tracking-[0.24em]">GRAPHXIFY</p>
          <p className="max-w-md text-sm text-fg/70">{siteConfig.tagline}</p>
          <Link href="/contact#inquiry" className="inline-flex w-fit rounded-full bg-fg px-4 py-2 text-sm text-bg">
            Start a project inquiry
          </Link>
>>>>>>> 2531062 ( added new prompt for enhancements)
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
