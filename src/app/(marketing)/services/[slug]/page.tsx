import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { findServiceDetail, serviceDetails } from "@/lib/marketing-content";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return serviceDetails.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const detail = findServiceDetail(params.slug);
  if (!detail) {
    return buildMetadata({
      title: "Service Not Found - Graphxify",
      description: "Requested service page was not found.",
      path: `/services/${params.slug}`
    });
  }

  return buildMetadata({
    title: `${detail.title} - Graphxify`,
    description: detail.intro,
    path: `/services/${detail.slug}`
  });
}

export default function ServiceDetailPage({ params }: { params: Params }) {
  const detail = findServiceDetail(params.slug);
  if (!detail) {
    notFound();
  }

  return (
    <section className="container py-16">
      <JsonLd data={serviceJsonLd({ name: detail.title, description: detail.intro, path: `/services/${detail.slug}` })} />

      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-3">
          <Link href="/services" className="link-sweep text-sm text-fg/70">
            Back to services
          </Link>
          <h1 className="text-4xl font-semibold md:text-5xl">{detail.title}</h1>
          <p className="max-w-3xl text-fg/72">{detail.intro}</p>
        </RevealItem>

        <div className="grid gap-5 md:grid-cols-2">
          <RevealItem>
            <article className="section-shell p-6">
              <h2 className="text-2xl font-semibold">Who it's for</h2>
              <ul className="mt-4 space-y-2 text-sm text-fg/76">
                {detail.whoItsFor.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          </RevealItem>

          <RevealItem>
            <article className="section-shell p-6">
              <h2 className="text-2xl font-semibold">Deliverables</h2>
              <ul className="mt-4 space-y-2 text-sm text-fg/76">
                {detail.deliverables.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          </RevealItem>
        </div>

        <RevealItem>
          <article className="section-shell p-6">
            <h2 className="text-2xl font-semibold">Process</h2>
            <ol className="mt-4 space-y-2 text-sm text-fg/76">
              {detail.process.map((item, index) => (
                <li key={item}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </article>
        </RevealItem>

        <RevealItem>
          <article className="section-shell px-6">
            <h2 className="py-5 text-2xl font-semibold">FAQ</h2>
            <Accordion type="single" collapsible>
              {detail.faqs.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </article>
        </RevealItem>

        <RevealItem>
          <article className="section-shell p-6 md:p-8">
            <p className="text-sm text-fg/70">{detail.ctaQuestion}</p>
            <Button asChild className="mt-4">
              <Link href="/contact#inquiry">Start a project inquiry</Link>
            </Button>
          </article>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
