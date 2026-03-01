import type { Metadata } from "next";
import { InquiryForm } from "@/components/marketing/inquiry-form";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Start a Project Inquiry - Graphxify",
  description:
    "Share your goals, timeline, and scope. Graphxify replies within one business day with clear next steps.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <section id="inquiry" className="container py-16">
      <RevealStagger className="space-y-8">
        <RevealItem>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Contact</p>
            <h1 className="text-4xl font-semibold md:text-5xl">Start a project inquiry</h1>
            <p className="max-w-2xl text-fg/72">
              Share your goals, timeline, and what you need built. We reply within one business day with a clear next
              step.
            </p>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="section-shell max-w-4xl p-6 md:p-8">
            <InquiryForm source="contact" />
          </div>
        </RevealItem>

        <RevealItem>
          <p className="text-sm text-fg/72">
            Prefer email?{" "}
            <a href="mailto:hello@graphxify.com" className="link-sweep">
              hello@graphxify.com
            </a>
          </p>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
