import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Graphxify privacy policy and data handling commitments.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <section className="container py-16">
      <h1 className="text-4xl font-semibold">Privacy Policy</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-sm text-[rgba(242,240,235,0.8)]">
        <p>Graphxify collects only the information required to respond to inquiries and operate requested services.</p>
        <p>Lead submissions are stored securely in Supabase and accessed by authorized team members only.</p>
        <p>Contact privacy@graphxify.com for data access or deletion requests.</p>
      </div>
    </section>
  );
}
