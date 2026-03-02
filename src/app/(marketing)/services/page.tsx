import type { Metadata } from "next";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";
import { services } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "Brand strategy, design systems, and platform engineering services by Graphxify.",
  path: "/services"
});

export default function ServicesPage() {
  return (
    <section className="container py-14 md:py-16">
      <RevealStagger className="space-y-10" effect="up">
        <RevealItem className="space-y-3" effect="left">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Services</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Strategic Delivery Stack</h1>
          <p className="max-w-2xl text-fg/68">Flexible engagement blocks tailored to product teams that value speed and polish.</p>
        </RevealItem>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((item, index) => (
            <RevealItem key={item.key} effect={index % 2 === 0 ? "left" : "right"}>
              <article className="section-shell lift-hover border-border/18 bg-card/72 p-6">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm text-fg/68">{item.body}</p>
              </article>
            </RevealItem>
          ))}
        </div>
      </RevealStagger>
    </section>
  );
}
