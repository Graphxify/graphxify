export const revalidate = 60;

import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/marketing/services-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbListJsonLd, buildMetadata, canonicalUrl, servicesItemListJsonLd } from "@/lib/seo";
import { getServiceWorkCards } from "./work-cards";

export const metadata: Metadata = buildMetadata({
  title: "Web Design, Branding & Development Services",
  description: "Web design, branding, web development, and CMS services for businesses worldwide. Structured, high-performance digital work from Graphxify.",
  path: "/services",
  ogTitle: "Web Design, Branding & Development Services | Graphxify",
  ogDescription: "Brand identity, web design, custom development, and CMS architecture — four focused services built for modern businesses ready to grow.",
  ogImageAlt: "Graphxify services — brand systems, web design, web development, and CMS architecture"
});

export default async function ServicesPage() {
  const works = await getServiceWorkCards();
  return (
    <>
      <JsonLd data={servicesItemListJsonLd()} />
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: "Home", url: canonicalUrl("/") },
          { name: "Services", url: canonicalUrl("/services") }
        ])}
      />
      <ServicesPageContent works={works} />
    </>
  );
}
