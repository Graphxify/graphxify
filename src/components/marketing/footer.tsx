import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FooterBackgroundGradient } from "@/components/ui/hover-footer";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Works", href: "/works" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" }
    ]
  }
] as const;

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
  { href: "https://www.facebook.com/Graphxify", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.instagram.com/graphxify", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.tiktok.com/@graphxify", label: "TikTok", Icon: TikTokIcon },
  { href: "https://www.behance.net/graphxify", label: "Behance", Icon: BehanceIcon }
] as const;

export function MarketingFooter(): JSX.Element {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border/20 bg-card/76">
      <FooterBackgroundGradient />

      <div className="container relative z-10 py-12 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.85fr_0.85fr_1fr] lg:gap-14">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center" aria-label="Graphxify home">
              <Image src="/assets/Graphxify-Logo-Black.webp" alt="Graphxify" width={246} height={68} className="h-auto w-[8.9rem] dark:hidden md:w-[9.8rem]" />
              <Image src="/assets/Graphxify-Logo-white.webp" alt="Graphxify" width={246} height={68} className="hidden h-auto w-[8.9rem] dark:block md:w-[9.8rem]" />
            </Link>
            <h3 className="text-2xl font-semibold text-fg md:text-[1.8rem]">Built on structure. Designed to scale.</h3>
            <p className="max-w-md text-sm leading-relaxed text-fg/72">
              Brand systems, web platforms, and structured CMS architecture designed and built as one cohesive system.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-fg/64">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-sweep text-sm text-fg/78 hover:text-fg">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-fg/64">Direct Contact</h4>
            <ul className="space-y-3 text-sm text-fg/78">
              <li>
                <a href="mailto:info@graphxify.com" className="link-sweep inline-flex items-center gap-2.5 hover:text-fg">
                  <Mail className="h-4 w-4 text-accentA" aria-hidden="true" />
                  <span>info@graphxify.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+16475700334" className="link-sweep inline-flex items-center gap-2.5 hover:text-fg">
                  <Phone className="h-4 w-4 text-accentA" aria-hidden="true" />
                  <span>+1 (647) 570-0334</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-accentA" aria-hidden="true" />
                <span>Toronto, Canada</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-border/20 pt-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-accentA/40 bg-transparent text-fg/76 transition hover:-translate-y-0.5 hover:border-accentA/50 hover:bg-accent-gradient hover:text-ivory"
              >
                <item.Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <p className="text-center text-xs text-fg/62 md:text-right">&copy; {new Date().getFullYear()} Graphxify. All rights reserved.</p>
        </div>
      </div>

      <div className="hidden h-[8.5rem] items-end justify-center lg:flex">
        <p
          className="select-none text-[clamp(4.5rem,15vw,10.5rem)] font-semibold uppercase leading-none tracking-[0.04em] text-transparent [background:linear-gradient(180deg,rgba(13,13,15,0.92)_0%,rgba(13,13,15,0.76)_42%,rgba(13,13,15,0.24)_74%,rgba(13,13,15,0)_100%)] [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent] [mask-image:linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.84)_60%,rgba(255,255,255,0.36)_84%,rgba(255,255,255,0)_100%)] [-webkit-mask-image:linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.84)_60%,rgba(255,255,255,0.36)_84%,rgba(255,255,255,0)_100%)] [-webkit-text-stroke:1px_rgba(13,13,15,0.16)] dark:[background:linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.78)_40%,rgba(255,255,255,0.24)_72%,rgba(255,255,255,0)_100%)] dark:[-webkit-text-stroke:1px_rgba(255,255,255,0.2)]"
          style={{
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitMaskImage: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 44%, rgba(255,255,255,0.45) 66%, rgba(255,255,255,0.14) 80%, rgba(255,255,255,0) 100%)",
            maskImage: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 44%, rgba(255,255,255,0.45) 66%, rgba(255,255,255,0.14) 80%, rgba(255,255,255,0) 100%)"
          }}
          aria-hidden="true"
        >
          Graphxify
        </p>
      </div>
    </footer>
  );
}
