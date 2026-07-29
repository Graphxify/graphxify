import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPricingTier } from "@/lib/pricing";

/**
 * Starting-price callout for a /services/* page.
 *
 * Reads from lib/pricing so a figure shown here can never drift from /pricing.
 * `note` lets a page explain how its service relates to the tier (e.g. CMS work
 * being bundled into a larger build rather than sold standalone).
 */
export function ServicePricingCallout({
  tierKey,
  note
}: {
  tierKey: string;
  note?: string;
}): JSX.Element {
  const tier = getPricingTier(tierKey);

  return (
    <article className="section-shell border-border/18 bg-card/74 p-7 md:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-fg/52">Investment</p>
      <h2 className="mt-4 text-2xl font-semibold md:text-3xl">What this costs</h2>
      <span className="mt-3 block h-px w-20 bg-accent-gradient" />

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-12">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-fg/48">{tier.name}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-[0.16em] text-fg/48">from</span>
            <span className="text-[2.6rem] font-semibold leading-none tracking-tight">${tier.price}</span>
            <span className="text-sm text-fg/48">{tier.currency}</span>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-fg/44">{tier.timeline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="sm">
              <Link href="/contact">Get a Quote</Link>
            </Button>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fg/60 hover:text-fg"
            >
              All pricing
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[0.67rem] uppercase tracking-[0.18em] text-fg/52">Included at this tier</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {tier.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-fg/70">
                <Check className="mt-[0.15rem] h-3.5 w-3.5 shrink-0 text-accentA/70" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-fg/50">
            {note ?? "A starting price, not a fixed quote — final scope is agreed before any work begins."}
          </p>
        </div>
      </div>
    </article>
  );
}
