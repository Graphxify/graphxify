import type { Metadata } from "next";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About - Graphxify",
  description:
    "Graphxify is a branding + web design + development studio focused on system-first execution and structured CMS delivery.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <section className="container py-16">
      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">About</p>
          <h1 className="text-4xl font-semibold md:text-5xl">A small studio built for premium execution.</h1>
        </RevealItem>

        <RevealItem>
          <div className="section-shell max-w-4xl p-6 text-fg/76">
            <p>
              Graphxify is a branding + web design + development studio. We build brand systems and websites that stay
              consistent under real use - with CMS structure so publishing doesn't break the design.
            </p>
            <p className="mt-4">
              Our work is system-first: tokens, components, templates, and clean handoff. The goal is simple: your site
              looks premium today and stays premium as it grows.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>- Brand systems designed for digital</li>
              <li>- Performance-first builds</li>
              <li>- CMS architecture with guardrails</li>
            </ul>
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
