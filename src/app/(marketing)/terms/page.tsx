import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "The terms that govern how Graphxify works with clients — project agreements, IP ownership, payment, and everything in between.",
  path: "/terms"
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

export default function TermsPage(): JSX.Element {
  return (
    <div className="container py-16 md:py-20 lg:py-24">

      {/* Page header */}
      <div className="mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-fg/48">
          <span className="h-px w-6 bg-fg/22" aria-hidden="true" />
          Legal
        </p>
        <h1 className="mt-4 text-[clamp(2.4rem,6vw,3.6rem)] font-semibold leading-[1.06] tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-fg/62">
          Clear terms for how we work together — no surprises, no fine print designed to confuse you. Read this before we start a project.
        </p>
        <p className="mt-5 inline-block rounded-full border border-border/30 bg-card/60 px-4 py-1.5 text-xs text-fg/50">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* Sections */}
      <div className="mx-auto mt-12 max-w-3xl space-y-4 md:mt-16">

        <SectionShell num="01" title="Acceptance of Terms">
          <p>
            By engaging Graphxify for any service — whether through our contact form, a signed proposal, a verbal agreement, or a project invoice — you agree to these Terms &amp; Conditions. These terms apply to all clients, regardless of project size or scope.
          </p>
          <p className="mt-3">
            If you&rsquo;re engaging on behalf of a company or organisation, you confirm that you have the authority to accept these terms on their behalf.
          </p>
          <p className="mt-3">
            These terms work alongside any specific project agreement, proposal, or statement of work we provide. In the event of a conflict, the signed project agreement takes precedence.
          </p>
        </SectionShell>

        <SectionShell num="02" title="Our Services">
          <p>Graphxify provides the following services to clients:</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { title: "Brand Systems", desc: "Positioning, visual identity, messaging frameworks, and brand standards documentation." },
              { title: "Web Design", desc: "Interface design, UX architecture, responsive layouts, and design systems built for scale." },
              { title: "Web Development", desc: "Frontend and full-stack development using modern frameworks, built for performance and maintainability." },
              { title: "CMS Architecture", desc: "Content model design, editor workflow configuration, and structured CMS setup so your team can publish confidently." }
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-border/20 bg-card/40 p-4">
                <p className="font-semibold text-fg/90">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-fg/60">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">
            The exact scope of work for any engagement is defined in the project proposal or statement of work. We only commit to what&rsquo;s specified there. Additional work outside that scope requires a separate written agreement.
          </p>
        </SectionShell>

        <SectionShell num="03" title="Project Agreements & Scope">
          <p>Every project starts with a defined scope. Here&rsquo;s how it works:</p>
          <div className="mt-4 space-y-4">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Scope definition</p>
              <p className="mt-1">Before work begins, we provide a written proposal or statement of work that outlines deliverables, timelines, milestones, and fees. The project begins once you&rsquo;ve approved this document.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Scope changes</p>
              <p className="mt-1">If the project scope changes after work has begun — new pages, additional features, expanded brand deliverables, or other additions — we will provide a change order documenting the updated scope and any additional fees. Work on scope additions does not begin until the change order is approved.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Timelines</p>
              <p className="mt-1">Estimated timelines are provided in good faith based on project complexity. Timelines depend on both our delivery and your timely provision of required materials, feedback, and approvals. Delays caused by late client input may extend project timelines accordingly.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Project pauses</p>
              <p className="mt-1">If a project goes inactive for more than 30 days due to lack of client response or delayed materials, Graphxify reserves the right to move the project to a lower priority queue. Reactivation may involve a restart fee depending on the time elapsed.</p>
            </div>
          </div>
        </SectionShell>

        <SectionShell num="04" title="Payment Terms">
          <p>We keep our payment structure simple and transparent:</p>
          <div className="mt-4 space-y-3">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Deposit</p>
              <p className="mt-0.5">A non-refundable deposit (typically 50% of the total project fee) is required before work begins. This deposit secures your place in our schedule and covers initial discovery and planning work.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Milestone payments</p>
              <p className="mt-0.5">For larger projects, payments are structured around agreed milestones. Each milestone payment is due upon completion of that phase and before the next phase begins.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Final payment</p>
              <p className="mt-0.5">The remaining balance is due before final files, source code, or production deployment are handed over. Ownership of final deliverables transfers only upon receipt of full payment.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Late payments</p>
              <p className="mt-0.5">Invoices are due within 14 days of issue unless otherwise agreed. Overdue invoices may result in a pause to active work. Graphxify reserves the right to charge interest on invoices that are more than 30 days overdue.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Cancellation</p>
              <p className="mt-0.5">If you cancel a project after work has begun, you are responsible for payment covering all work completed to that point. The deposit is non-refundable in all cases.</p>
            </div>
          </div>
        </SectionShell>

        <SectionShell num="05" title="Intellectual Property">
          <p>Ownership of work depends on what it is and when it&rsquo;s paid for. Here&rsquo;s the breakdown:</p>
          <div className="mt-4 space-y-4">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Final deliverables — yours after full payment</p>
              <p className="mt-1">Once you&rsquo;ve paid in full, ownership of the final deliverables transfers to you. This includes final logo files, brand assets, design files, website code, and other deliverables explicitly listed in your project scope.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Underlying tools &amp; frameworks</p>
              <p className="mt-1">Any open-source libraries, third-party frameworks, or proprietary internal tools we use to build your project retain their original licences. You gain the right to use them as part of your delivered product but do not own them outright.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Work in progress</p>
              <p className="mt-1">Until final payment is received, all work in progress — including drafts, concepts, prototypes, and code — remains the intellectual property of Graphxify.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Portfolio rights</p>
              <p className="mt-1">Unless you explicitly request otherwise in writing before the project starts, Graphxify retains the right to display completed work in our portfolio, case studies, and marketing materials. We will always credit you appropriately and will never share confidential business information without permission.</p>
            </div>
          </div>
        </SectionShell>

        <SectionShell num="06" title="Revisions & Change Requests">
          <p>We build revision rounds into every project so you have meaningful opportunity to refine the work. Here&rsquo;s how it works:</p>
          <ul className="mt-4 space-y-2.5">
            <Bullet>Each phase of work includes a set number of revision rounds as specified in your project proposal</Bullet>
            <Bullet>A revision round means a consolidated batch of feedback on a single version of the deliverable — not multiple separate rounds for the same version</Bullet>
            <Bullet>Revision requests should be provided in writing (email or project management tool) so we can track and address everything clearly</Bullet>
            <Bullet>Feedback that changes the fundamental direction of the work — new concept requests, major strategic pivots — is treated as a scope change, not a revision</Bullet>
            <Bullet>Additional revision rounds beyond what&rsquo;s included in scope are available at our standard hourly rate</Bullet>
          </ul>
          <p className="mt-4">
            We want you to love what we build. We&rsquo;ll always work with you to get there — we just need clear, consolidated feedback and mutual respect for the scope we agreed on.
          </p>
        </SectionShell>

        <SectionShell num="07" title="Client Responsibilities">
          <p>A great project is a collaboration. Here&rsquo;s what we need from you:</p>
          <ul className="mt-4 space-y-2.5">
            <Bullet>Provide accurate, complete, and timely briefs, content, and materials</Bullet>
            <Bullet>Designate a primary point of contact with authority to approve decisions and provide feedback</Bullet>
            <Bullet>Review and respond to deliverables within the timeframe agreed in your project plan</Bullet>
            <Bullet>Ensure that any assets, content, or materials you provide to us are either owned by you or properly licensed for use</Bullet>
            <Bullet>Inform us promptly of any changes to your business, scope requirements, or timeline that might affect the project</Bullet>
            <Bullet>Provide access to necessary platforms, accounts, and systems at the appropriate project phase</Bullet>
          </ul>
          <p className="mt-4">
            You are responsible for ensuring that the final product complies with any industry-specific regulations, legal requirements, or platform policies relevant to your business. Graphxify is not liable for compliance failures arising from your content or industry.
          </p>
        </SectionShell>

        <SectionShell num="08" title="Limitation of Liability">
          <p>
            Graphxify provides its services with care and skill. That said, our liability is limited in the following ways:
          </p>
          <div className="mt-4 space-y-3">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Maximum liability</p>
              <p className="mt-0.5">Our total liability to you for any claim arising from a project is limited to the total fees paid for that specific project.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">No liability for indirect losses</p>
              <p className="mt-0.5">Graphxify is not liable for indirect, incidental, or consequential losses — including lost revenue, lost data, or lost business — arising from our work, even if we were advised of the possibility of such losses.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Third-party services</p>
              <p className="mt-0.5">We build on reputable third-party platforms (hosting providers, CMS systems, payment processors). We are not responsible for outages, data loss, or service failures caused by those third-party providers.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Client-provided content</p>
              <p className="mt-0.5">We are not responsible for the accuracy, legality, or appropriateness of content you provide to us. You warrant that your content does not infringe the rights of any third party.</p>
            </div>
          </div>
        </SectionShell>

        <SectionShell num="09" title="Confidentiality">
          <p>
            Both parties may share sensitive business information during a project engagement. We take confidentiality seriously:
          </p>
          <ul className="mt-4 space-y-2.5">
            <Bullet>Graphxify will not disclose your confidential business information to any third party without your written consent</Bullet>
            <Bullet>Confidential information includes business strategy, unreleased products, financials, client lists, and any materials marked as confidential</Bullet>
            <Bullet>This obligation survives the end of the project engagement</Bullet>
            <Bullet>If you require a formal NDA before sharing sensitive information, we are happy to sign one — let us know before the project kick-off</Bullet>
          </ul>
        </SectionShell>

        <SectionShell num="10" title="Acceptable Use">
          <p>
            Graphxify will not accept projects that involve illegal activity, hate speech, harassment, deceptive marketing, or content that causes harm to others. We reserve the right to decline or discontinue any engagement that violates these standards, without refund of fees already earned.
          </p>
          <p className="mt-3">
            If you commission work for a website, campaign, or brand that is later used in a way that is illegal or harmful, that is your responsibility — not ours.
          </p>
        </SectionShell>

        <SectionShell num="11" title="Termination">
          <p>Either party can end a project engagement with written notice. Here&rsquo;s what happens:</p>
          <div className="mt-4 space-y-3">
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Client-initiated termination</p>
              <p className="mt-0.5">You are responsible for payment for all work completed up to the date of termination. The deposit is non-refundable. Partially completed work-in-progress may be handed over at our discretion.</p>
            </div>
            <div className="border-l-2 border-accentA/25 pl-4">
              <p className="font-semibold text-fg/90">Graphxify-initiated termination</p>
              <p className="mt-0.5">We may terminate an engagement if payment obligations are not met, if the working relationship becomes untenable, or if a project would require us to produce work that violates our standards. In this case, we will provide all completed work and invoice for work done to date.</p>
            </div>
          </div>
        </SectionShell>

        <SectionShell num="12" title="Governing Law">
          <p>
            These Terms &amp; Conditions are governed by the laws of the Province of Ontario and the applicable federal laws of Canada. Any disputes arising from a project engagement will be subject to the exclusive jurisdiction of the courts of Ontario.
          </p>
          <p className="mt-3">
            We genuinely hope it never comes to that. If there&rsquo;s a problem, contact us first and we&rsquo;ll work to resolve it directly.
          </p>
        </SectionShell>

        <SectionShell num="13" title="Changes to These Terms">
          <p>
            We may update these terms from time to time. When we do, we&rsquo;ll update the &ldquo;Last Updated&rdquo; date at the top of this page. Changes take effect immediately for new projects. Ongoing projects remain subject to the terms that were in place when the project began, unless both parties agree otherwise in writing.
          </p>
          <p className="mt-3">
            The current version of these terms is always available at{" "}
            <Link href="/terms" className="link-sweep text-accentA hover:text-accentA/80">
              graphxify.com/terms
            </Link>
            .
          </p>
        </SectionShell>

        <SectionShell num="14" title="Questions & Contact">
          <p>
            Questions about how something in here applies to your project? Ask before you sign — we&rsquo;d rather clarify upfront than deal with confusion later.
          </p>
          <div className="mt-4 space-y-2">
            <p>
              <span className="text-fg/56">Email: </span>
              <a href="mailto:info@graphxify.com" className="link-sweep text-accentA hover:text-accentA/80">
                info@graphxify.com
              </a>
            </p>
            <p>
              <span className="text-fg/56">Phone: </span>
              <a href="tel:+16475700334" className="link-sweep text-accentA hover:text-accentA/80">
                +1 (647) 570-0334
              </a>
            </p>
            <p>
              <span className="text-fg/56">Location: </span>
              <span>Toronto, Canada</span>
            </p>
          </div>
          <p className="mt-4">
            Or skip the email and{" "}
            <Link href="/contact" className="link-sweep text-accentA hover:text-accentA/80">
              start a conversation directly
            </Link>
            .
          </p>
        </SectionShell>

      </div>

      {/* Footer cue */}
      <div className="mx-auto mt-10 max-w-3xl text-center">
        <p className="text-xs text-fg/40">
          Ready to start a project?{" "}
          <Link href="/contact" className="link-sweep text-fg/56 hover:text-fg">
            Let&rsquo;s talk
          </Link>
          .
        </p>
      </div>

    </div>
  );
}
