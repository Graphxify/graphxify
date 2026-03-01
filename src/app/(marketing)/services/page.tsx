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
    <section className="container py-16">
      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Services</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Strategic Delivery Stack</h1>
          <p className="max-w-2xl text-fg/68">Flexible engagement blocks tailored to product teams that value speed and polish.</p>
        </RevealItem>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((item) => (
            <RevealItem key={item.key}>
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
