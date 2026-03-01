import type { Metadata } from "next";
import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { buildMetadata } from "@/lib/seo";
import { servicePillars } from "@/lib/marketing-content";

export const metadata: Metadata = buildMetadata({
  title: "Services - Graphxify",
  description:
    "Graphxify builds premium brand systems, calm UX/UI, high-performance websites, and structured CMS implementations.",
  path: "/services"
});

export default function ServicesPage() {
  return (
    <section className="container py-16">
      <RevealStagger className="space-y-12">
        <RevealItem className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Services</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Services that make digital foundations scalable.</h1>
          <p className="max-w-3xl text-fg/72">
            Graphxify builds premium brand systems, calm UX/UI, high-performance websites, and structured CMS
            implementations. The work is system-first: consistent components, clear rules, and clean handoff - so your
            site stays premium as it evolves.
          </p>
        </RevealItem>

        <div className="space-y-5">
          {servicePillars.map((item) => (
            <RevealItem key={item.slug}>
              <article className="section-shell p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-2xl font-semibold md:text-3xl">{item.title}</h2>
                  <Link href={`/services/${item.slug}`} className="link-sweep text-sm text-fg/78">
                    View details
                  </Link>
                </div>
                <p className="mt-3 max-w-3xl text-fg/72">{item.oneLiner}</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <h3 className="text-sm font-semibold">Best for</h3>
                    <p className="mt-2 text-sm text-fg/72">{item.bestFor}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">What we deliver</h3>
                    <p className="mt-2 text-sm text-fg/72">{item.whatWeDeliver}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Typical timeline</h3>
                    <p className="mt-2 text-sm text-fg/72">{item.timeline}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">What you leave with</h3>
                    <p className="mt-2 text-sm text-fg/72">{item.leaveWith}</p>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </div>
      </RevealStagger>
    </section>
  );
}
