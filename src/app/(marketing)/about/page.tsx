import type { Metadata } from "next";
import { FounderIntroSection } from "@/components/marketing/founder-intro-section";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Graphxify is an agency focused on premium digital systems for enterprise teams.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <section className="container py-14 md:py-16">
      <RevealStagger className="space-y-10" effect="up">
        <RevealItem className="space-y-3" effect="left">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">About</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Graphxify is built for product teams that care how things feel.</h1>
        </RevealItem>

        <RevealItem effect="up">
          <FounderIntroSection showIntroLabel={false} animateFounderCopy />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
