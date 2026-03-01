import type { Metadata } from "next";
import { LeadForm } from "@/components/marketing/lead-form";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Start your next premium website and CMS build with Graphxify.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <section className="container py-16">
      <RevealStagger className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <RevealItem>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Contact</p>
            <h1 className="text-4xl font-semibold md:text-5xl">Tell us what you need to ship next.</h1>
            <p className="max-w-xl text-fg/68">
              Share your stage, team setup, and timeline. We will follow up with a clear delivery approach within one business day.
            </p>
          </div>
        </RevealItem>
        <RevealItem>
          <div className="section-shell border-border/18 bg-card/74 p-6">
            <LeadForm />
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
