import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "@/components/marketing/back-to-top";

const footerLinks = [
  { href: "/works", label: "Works" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" }
];

function FacebookIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.2 6.2H16V3.8h-2.1c-2.3 0-3.7 1.5-3.7 3.8V10H8v2.5h2.2v5.7h2.6v-5.7h2.4l.4-2.5h-2.8V8.1c0-1 .35-1.9 1.8-1.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="0.95" fill="currentColor" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3.4 7.2h4.7a2.25 2.25 0 1 1 0 4.5H3.4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.4 11.7h5.2a2.7 2.7 0 1 1 0 5.4H3.4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.6 9.2h5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.1 14.8a2.85 2.85 0 0 1 2.8-2.45c1.8 0 2.95 1.15 2.95 2.95v.3h-5.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.3 16.7c.34 1.05 1.31 1.72 2.68 1.72.98 0 1.82-.32 2.42-.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M14.2 4.1v8.8a3.45 3.45 0 1 1-2.25-3.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2 4.1c.68 2.03 2.06 3.53 4.2 4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2 8.25c1.5 0 2.85-.32 4.2-.93" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const socialLinks = [
  { href: "https://www.facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.behance.net", label: "Behance", Icon: BehanceIcon },
  { href: "https://www.tiktok.com", label: "TikTok", Icon: TikTokIcon }
] as const;

export function MarketingFooter(): JSX.Element {
  return (
    <footer className="relative mt-24 border-t border-border/20 bg-bg">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center" aria-label="Graphxify home">
            <Image src="/assets/Graphxify-Logo-Black.webp" alt="Graphxify" width={246} height={68} className="h-auto w-[8.9rem] dark:hidden md:w-[9.8rem]" />
            <Image src="/assets/Graphxify-Logo-white.webp" alt="Graphxify" width={246} height={68} className="hidden h-auto w-[8.9rem] dark:block md:w-[9.8rem]" />
          </Link>
          <p className="max-w-md text-sm text-fg/68">
            Premium agency platform blending brand systems, high-comfort UX, and operational CMS governance.
          </p>
          <div className="pt-1">
            <p className="text-xs uppercase tracking-[0.18em] text-fg/64">Follow</p>
            <div className="mt-3 flex items-center gap-2.5">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/24 bg-card/72 text-fg/74 transition hover:-translate-y-0.5 hover:border-accentA/40 hover:bg-accent-gradient hover:text-ivory"
                >
                  <item.Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
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
