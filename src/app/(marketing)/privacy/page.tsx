import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Graphxify collects, handles, and protects your data, written plainly so you actually know what's going on.",
  path: "/privacy",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "Privacy Policy | Graphxify",
  ogDescription: "How Graphxify collects, handles, and protects your data — written plainly so you actually know what's going on.",
  ogImageAlt: "Graphxify privacy policy — data handling and protection",
  twitterCard: "summary"
});

const LAST_UPDATED = "March 9, 2026";

function SectionShell({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="section-shell border-border/18 bg-card/72 p-6 md:p-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-semibold tabular-nums text-accentA/70">{num}</span>
        <span className="h-px flex-1 bg-border/20" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-fg md:text-xl">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-fg/72">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accentA/65" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPage(): JSX.Element {
  return (
    <div className="container py-16 md:py-20 lg:py-24">

      {/* Page header */}
      <div className="mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-fg/48">
          <span className="h-px w-6 bg-fg/22" aria-hidden="true" />
          Legal
        </p>
        <h1 className="mt-4 text-[clamp(2.4rem,6vw,3.6rem)] font-semibold leading-[1.06] tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-fg/62">
          We collect only what we need, handle it carefully, and never sell it. Here&rsquo;s exactly how it works, in plain language.
        </p>
        <p className="mt-5 inline-block rounded-full border border-border/30 bg-card/60 px-4 py-1.5 text-xs text-fg/50">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* Sections */}
      <div className="mx-auto mt-12 max-w-3xl space-y-4 md:mt-16">

        <SectionShell num="01" title="Who We Are">
          <p>
            Graphxify is a premium digital agency working with clients worldwide. We design and build brand systems,
            high-performance websites, and structured CMS architecture for founders and growth-stage companies.
          </p>
          <p className="mt-3">
            When we say &ldquo;Graphxify,&rdquo; &ldquo;we,&rdquo; or &ldquo;us&rdquo; in this policy, we mean the Graphxify studio and team.
            When we say &ldquo;you,&rdquo; we mean anyone who visits our website, submits an inquiry, or works with us as a client.
          </p>
          <p className="mt-3">
            This policy covers our website at{" "}
            <Link href="/" className="link-sweep text-accentA hover:text-accentA/80">graphxify.com</Link>
            {" "}and all related services we provide. We&rsquo;ve written it in plain language because we think you deserve to actually understand it.
          </p>
        </SectionShell>

        <SectionShell num="02" title="What We Collect">
          <p>We only collect information that&rsquo;s genuinely useful for working with you:</p>
          <div className="mt-4 space-y-4">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Contact & inquiry forms</p>
              <p className="mt-1">When you reach out through our contact or project inquiry form, we collect your name, email address, company name, project description, and any other details you choose to share. This is what we need to understand your project and respond meaningfully.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Email correspondence</p>
              <p className="mt-1">If you email us directly, we receive and retain that conversation: your name, email address, and the content of your messages.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Analytics data</p>
              <p className="mt-1">We use analytics tools to understand how visitors use our site: which pages are visited, general geographic regions, and how people navigate through the content. This data is aggregated and anonymised. We do not build individual user profiles.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Technical data</p>
              <p className="mt-1">Our servers automatically receive standard technical information when you visit: your IP address, browser type, device type, and referring URL. This is standard practice for any website and helps us maintain site health and security.</p>
            </div>
          </div>
        </SectionShell>

        <SectionShell num="03" title="How We Use Your Data">
          <p>We use what we collect for a specific, limited set of purposes:</p>
          <ul className="mt-4 space-y-2.5">
            <Bullet>To respond to your inquiry or project request</Bullet>
            <Bullet>To scope, plan, and deliver your project</Bullet>
            <Bullet>To communicate with you throughout the engagement</Bullet>
            <Bullet>To send invoices and manage billing</Bullet>
            <Bullet>To improve our website based on aggregate usage patterns</Bullet>
            <Bullet>To meet any legal or contractual obligations</Bullet>
          </ul>
          <p className="mt-4">
            We do not sell your data. We do not use it for advertising. We do not share it with third parties for their
            own marketing purposes. Your information exists in our systems to serve your project. Nothing else.
          </p>
        </SectionShell>

        <SectionShell num="04" title="Cookies & Analytics">
          <p>Our website uses cookies and similar technologies to function properly and understand how it&rsquo;s being used.</p>
          <div className="mt-4 space-y-4">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Essential cookies</p>
              <p className="mt-1">Required for basic site functionality, including session state and security. These don&rsquo;t collect personal data and can&rsquo;t be opted out of without breaking the site.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Analytics cookies</p>
              <p className="mt-1">Used to understand traffic patterns and page performance. We configure our analytics to anonymise IP addresses and avoid individual user tracking. We see patterns across many users, not individual profiles.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Preference cookies</p>
              <p className="mt-1">Things like your colour scheme preference (light or dark mode) may be stored locally so your experience is consistent on return visits.</p>
            </div>
          </div>
          <p className="mt-4">
            Most browsers let you manage or block cookies through their settings. Disabling non-essential cookies won&rsquo;t break the site, though some features may behave differently.
          </p>
        </SectionShell>

        <SectionShell num="05" title="Third-Party Tools We Use">
          <p>We work with a small number of trusted providers to run our business. Here&rsquo;s what they are and why:</p>
          <div className="mt-4 space-y-4">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Supabase</p>
              <p className="mt-1">Our database and backend infrastructure. Contact form submissions and project inquiry data are stored securely in Supabase. Only authorised Graphxify team members have access.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Vercel</p>
              <p className="mt-1">Our website is hosted on Vercel&rsquo;s infrastructure. As part of serving the site, they process standard server logs and request data.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Email providers</p>
              <p className="mt-1">We use email to communicate with clients and respond to inquiries. Your email address and messages pass through our email provider&rsquo;s infrastructure in transit.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Payment processors</p>
              <p className="mt-1">Client billing is handled through secure payment platforms that process payment data directly. Graphxify does not store credit card numbers or payment credentials on our own systems.</p>
            </div>
          </div>
          <p className="mt-4">Each provider operates under their own privacy policy. We select partners that take privacy and security seriously.</p>
        </SectionShell>

        <SectionShell num="06" title="Client Project Data">
          <p>
            When we work together, you&rsquo;ll share materials with us: brand assets, content, copy, login credentials, and sensitive business information.
            Here&rsquo;s how we treat it:
          </p>
          <ul className="mt-4 space-y-2.5">
            <Bullet>Project files are only accessed by team members directly involved in your engagement</Bullet>
            <Bullet>Confidential business information is never shared with outside parties</Bullet>
            <Bullet>Access credentials (CMS logins, hosting accounts, APIs) are stored securely and kept within your project team</Bullet>
            <Bullet>After project completion, we retain a working archive of deliverables for reference and potential future support</Bullet>
            <Bullet>If you need specific project data deleted, email us and we will confirm and complete that deletion</Bullet>
          </ul>
        </SectionShell>

        <SectionShell num="07" title="How Long We Keep Your Data">
          <p>We retain data for as long as it&rsquo;s reasonably needed for the purpose it was collected:</p>
          <div className="mt-4 space-y-3">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Inquiry data (non-clients)</p>
              <p className="mt-0.5">Retained for up to 12 months in case you follow up, then removed from active systems.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Client records</p>
              <p className="mt-0.5">Project data, invoices, and correspondence are retained for a minimum of 5 years to satisfy accounting and legal obligations.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Analytics data</p>
              <p className="mt-0.5">Aggregated website analytics are retained per our analytics provider&rsquo;s standard data retention schedule.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Email correspondence</p>
              <p className="mt-0.5">Kept in our inbox for the duration of the relationship and for a reasonable period after its conclusion.</p>
            </div>
          </div>
        </SectionShell>

        <SectionShell num="08" title="Your Rights">
          <p>You have rights over your personal data. Depending on your location, these may include:</p>
          <ul className="mt-4 space-y-2.5">
            <Bullet>The right to know what personal data we hold about you</Bullet>
            <Bullet>The right to receive a copy of your data in a portable format</Bullet>
            <Bullet>The right to request correction of inaccurate information</Bullet>
            <Bullet>The right to request deletion of your data (subject to legal retention requirements)</Bullet>
            <Bullet>The right to withdraw consent where you previously provided it</Bullet>
            <Bullet>The right to object to certain uses of your data</Bullet>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:privacy@graphxify.com" className="link-sweep text-accentA hover:text-accentA/80">
              privacy@graphxify.com
            </a>
            . We respond within 30 days.
          </p>
        </SectionShell>

        <SectionShell num="09" title="Security">
          <p>We take reasonable, practical measures to protect the data we hold:</p>
          <ul className="mt-4 space-y-2.5">
            <Bullet>Encrypted connections (HTTPS) for all data in transit</Bullet>
            <Bullet>Access controls limiting which team members can view which data</Bullet>
            <Bullet>Reputable infrastructure providers with their own security certifications and practices</Bullet>
            <Bullet>No storage of sensitive payment credentials on our own systems</Bullet>
          </ul>
          <p className="mt-4">
            No system is perfectly secure. If you believe your data has been compromised in any way, contact us immediately at{" "}
            <a href="mailto:privacy@graphxify.com" className="link-sweep text-accentA hover:text-accentA/80">
              privacy@graphxify.com
            </a>
            .
          </p>
        </SectionShell>

        <SectionShell num="10" title="Updates to This Policy">
          <p>
            We may revise this policy from time to time as our services evolve or legal requirements change. When we do,
            we&rsquo;ll update the &ldquo;Last Updated&rdquo; date at the top of this page.
          </p>
          <p className="mt-3">
            For minor changes, we won&rsquo;t notify you individually. The current version is always available here. If a change meaningfully affects how we handle client data, we&rsquo;ll make an effort to notify active clients directly.
          </p>
        </SectionShell>

        <SectionShell num="11" title="Contact">
          <p>Questions, requests, or concerns about this policy? We&rsquo;re real people. Reach out and we&rsquo;ll respond properly.</p>
          <div className="mt-4 space-y-2">
            <p>
              <span className="text-fg/56">Privacy inquiries: </span>
              <a href="mailto:privacy@graphxify.com" className="link-sweep text-accentA hover:text-accentA/80">
                privacy@graphxify.com
              </a>
            </p>
            <p>
              <span className="text-fg/56">General: </span>
              <a href="mailto:info@graphxify.com" className="link-sweep text-accentA hover:text-accentA/80">
                info@graphxify.com
              </a>
            </p>
            <p>
              <span className="text-fg/56">Location: </span>
              <span>Remote · Worldwide</span>
            </p>
          </div>
        </SectionShell>

      </div>

      {/* Footer cue */}
      <div className="mx-auto mt-10 max-w-3xl text-center">
        <p className="text-xs text-fg/40">
          Something unclear?{" "}
          <Link href="/contact" className="link-sweep text-fg/56 hover:text-fg">
            Ask us directly
          </Link>{" "}
          and we&rsquo;ll answer it.
        </p>
      </div>

    </div>
  );
}
