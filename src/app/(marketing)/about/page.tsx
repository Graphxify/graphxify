import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Graphxify is an agency focused on premium digital systems for enterprise teams.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <section className="container py-16">
      <h1 className="text-4xl font-semibold">About Graphxify</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-[rgba(242,240,235,0.8)]">
        <p>
          Graphxify partners with teams that need precision, speed, and governance. We design and engineer digital platforms that match high-end brand standards and enterprise operating expectations.
        </p>
        <p>
          Our approach combines strategic direction, thoughtful UX systems, and robust implementation practices so content and growth teams can ship confidently.
        </p>
      </div>
    </section>
  );
}
