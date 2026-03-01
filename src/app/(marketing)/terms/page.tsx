import type { Metadata } from "next";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Graphxify service terms and delivery boundaries.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <section className="container py-16">
      <RevealStagger className="space-y-8">
        <RevealItem>
          <h1 className="text-4xl font-semibold md:text-5xl">Terms of Service</h1>
        </RevealItem>
        <RevealItem>
          <div className="section-shell max-w-3xl border-border/18 bg-card/72 p-6 text-sm text-fg/74">
            <p>Project scopes, delivery milestones, and communication SLAs are documented in signed agreements.</p>
            <p className="mt-4">All materials delivered by Graphxify are licensed per client contract terms after final payment.</p>
            <p className="mt-4">Graphxify reserves the right to pause delivery for breaches of payment or abuse policies.</p>
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
