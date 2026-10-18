import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { BackToTop } from "@/components/marketing/back-to-top";
import { GraphxifyLogo } from "@/components/marketing/graphxify-logo";
import { Marquee } from "@/components/site/marquee";
import { companyContact } from "@/lib/constants";

const footerGroups = [
  {
    title: "Studio",
    links: [
      { label: "Work", href: "/works" },
      { label: "Process", href: "/process" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Services",
    links: [
      { label: "All services", href: "/services" },
      { label: "Brand Systems", href: "/services/brand-systems" },
      { label: "Web Design", href: "/services/web-design" },
      { label: "Web Development", href: "/services/web-development" },
      { label: "CMS Architecture", href: "/services/cms-architecture" }
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
    <footer className="relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-fg text-white md:mt-32 md:rounded-t-[3.5rem]">
      <BackToTop />
      <div className="container pt-16 md:pt-24">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:pb-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center rounded-xl bg-white px-3 py-2" aria-label="Graphxify home">
              <GraphxifyLogo alt="Graphxify" width={246} height={68} className="h-auto w-[7.5rem]" />
            </Link>
            <p className="mt-8 max-w-[20ch] text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-[1.15] tracking-[-0.035em]">
              Brands and websites, designed and built as <span className="text-accentA">one system</span>.
            </p>
            <Link
              href="/resources/website-growth-checklist"
              className="group mt-8 flex max-w-sm items-center justify-between gap-4 rounded-[1.5rem] bg-charcoal-2 p-5 transition-colors duration-200 hover:bg-white/10"
            >
              <span>
                <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-white/60">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green" />
                  Free resource
                </span>
                <span className="mt-1.5 block text-[0.9375rem] font-bold">Website Growth Checklist</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-white/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7">
            {footerGroups.map((group) => (
              <nav key={group.title} aria-label={`Footer ${group.title.toLowerCase()}`}>
                <h2 className="mb-5 text-[0.875rem] font-bold text-white/50">{group.title}</h2>
                <ul className="space-y-3">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-[0.9375rem] font-semibold text-white/80 transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 sm:col-span-1">
              <h2 className="mb-5 text-[0.875rem] font-bold text-white/50">Contact</h2>
              <ul className="space-y-3 text-[0.9375rem] font-semibold text-white/80">
                <li>
                  <a href={`mailto:${companyContact.email}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-white">
                    <Mail className="h-4 w-4 text-accentA" aria-hidden="true" />
                    <span>{companyContact.email}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${companyContact.phoneHref}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 text-accentA" aria-hidden="true" />
                    <span>{companyContact.phoneDisplay}</span>
                  </a>
                </li>
                <li className="inline-flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accentA" aria-hidden="true" />
                  <span>{companyContact.locationLine}</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Graphxify on ${item.label}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-2 text-white/80 transition-colors duration-200 hover:bg-white hover:text-fg"
                  >
                    <item.Icon className="h-[1.125rem] w-[1.125rem]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-7 text-[0.8125rem] font-semibold text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Graphxify. All rights reserved.</p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Signature close: the wordmark drifting past, blue square as the separator. */}
      <Marquee duration={30} className="pb-6 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} aria-hidden="true" className="flex items-center gap-[4vw] pr-[4vw] text-[clamp(4rem,14vw,12rem)] font-extrabold leading-none tracking-[-0.05em] text-white/90">
            graphxify
            <span className="inline-block h-[0.32em] w-[0.32em] rounded-[0.06em] bg-accentA" />
          </span>
        ))}
      </Marquee>
    </footer>
  );
}
