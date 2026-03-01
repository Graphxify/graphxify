import type { Metadata } from "next";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Graphxify is an agency focused on premium digital systems for enterprise teams.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <section className="container py-16">
      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">About</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Graphxify is built for product teams that care how things feel.</h1>
        </RevealItem>

        <div className="grid gap-5 md:grid-cols-2">
          <RevealItem>
            <div className="section-shell border-border/18 bg-card/72 p-6 text-fg/76">
              <p>
                We partner with ambitious teams to craft websites and content systems that remain elegant under scale. Every touchpoint is designed for comfort, clarity, and speed.
              </p>
            </div>
          </RevealItem>
          <RevealItem>
            <div className="section-shell border-border/18 bg-card/72 p-6 text-fg/76">
              <p>
                Graphxify combines strategy, interaction design, and enterprise implementation so your public experience and internal publishing workflows stay aligned.
              </p>
            </div>
          </RevealItem>
        </div>
      </RevealStagger>
    </section>
  );
}
