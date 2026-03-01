import type { Metadata } from "next";
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
      <h1 className="text-4xl font-semibold">Services</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {services.map((item) => (
          <article key={item.key} className="rounded-xl border border-[rgba(242,240,235,0.18)] p-6">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm text-[rgba(242,240,235,0.76)]">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
