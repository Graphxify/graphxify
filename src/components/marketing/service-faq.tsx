import { HelpCircle } from "lucide-react";

export type ServiceFaqItem = { q: string; a: string };

/**
 * Per-service FAQ block.
 *
 * Rendered as a definition list rather than <details> so the answers are in the
 * initial HTML for crawlers and for readers who never click. No FAQPage schema:
 * Google retired the FAQ rich result in May 2026 for everything except
 * authoritative government and health sites, so the markup would do nothing.
 */
export function ServiceFaq({ items }: { items: readonly ServiceFaqItem[] }): JSX.Element {
  return (
    <div className="section-shell border-border/18 bg-card/74 p-7 md:p-10">
      <div className="flex items-center gap-2.5">
        <HelpCircle className="h-4 w-4 text-accentA" aria-hidden="true" />
        <p className="text-xs uppercase tracking-[0.2em] text-fg/52">Questions</p>
      </div>
      <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Common questions</h2>
      <span className="mt-3 block h-px w-20 bg-accent-gradient" />

      <dl className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.q} className="rounded-xl border border-border/16 bg-bg/45 px-5 py-4">
            <dt className="text-sm font-semibold text-fg/86">{item.q}</dt>
            <dd className="mt-2 text-xs leading-relaxed text-fg/58">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
