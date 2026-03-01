import type { Metadata } from "next";
import { LeadForm } from "@/components/marketing/lead-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Start your next premium website and CMS build with Graphxify.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <section className="container py-16">
      <h1 className="text-4xl font-semibold">Contact</h1>
      <p className="mt-3 max-w-2xl text-[rgba(242,240,235,0.75)]">Share your timeline, goals, and current stack. We reply quickly.</p>
      <div className="mt-8 max-w-xl rounded-xl border border-[rgba(242,240,235,0.18)] p-6">
        <LeadForm />
      </div>
    </section>
  );
}
