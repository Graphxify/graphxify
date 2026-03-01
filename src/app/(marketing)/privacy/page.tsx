import type { Metadata } from "next";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy - Graphxify",
  description: "Graphxify privacy policy and data handling commitments.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <section className="container py-16">
      <RevealStagger className="space-y-8">
        <RevealItem>
          <h1 className="text-4xl font-semibold md:text-5xl">Privacy Policy</h1>
        </RevealItem>
        <RevealItem>
          <div className="section-shell max-w-3xl border-border/18 bg-card/72 p-6 text-sm text-fg/74">
            <p>Graphxify collects only the information required to respond to inquiries and operate requested services.</p>
            <p className="mt-4">Lead submissions are stored securely in Supabase and accessed by authorized team members only.</p>
            <p className="mt-4">Contact privacy@graphxify.com for data access or deletion requests.</p>
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
