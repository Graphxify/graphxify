import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Graphxify service terms and delivery boundaries.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <section className="container py-16">
      <h1 className="text-4xl font-semibold">Terms of Service</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-sm text-[rgba(242,240,235,0.8)]">
        <p>Project scopes, delivery milestones, and communication SLAs are documented in signed agreements.</p>
        <p>All materials delivered by Graphxify are licensed per client contract terms after final payment.</p>
        <p>Graphxify reserves the right to pause delivery for breaches of payment or abuse policies.</p>
      </div>
    </section>
  );
}
