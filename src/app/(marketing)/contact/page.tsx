import type { Metadata } from "next";
import { ContactPageContent } from "@/components/marketing/contact-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, breadcrumbListJsonLd, canonicalUrl, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Start a Web Design or Branding Project",
  description: "Tell Graphxify about your website or brand project. We work with the Greater Toronto Area and clients worldwide, and reply within 24 hours with next steps.",
  path: "/contact",
  ogTitle: "Start a Project — Work with Graphxify",
  ogDescription: "Tell us about your brand or website project. We review every inquiry personally and typically respond within 24 hours with a clear, honest recommendation.",
  ogImageAlt: "Contact Graphxify — start a web design or branding project"
});

export default function ContactPage(): JSX.Element {
  return (
    <>
      <JsonLd data={webPageJsonLd("ContactPage", "/contact", "Contact Graphxify")} />
      <JsonLd data={breadcrumbListJsonLd([{ name: "Home", url: canonicalUrl("/") }, { name: "Contact", url: canonicalUrl("/contact") }])} />
      <ContactPageContent />
    </>
  );
}
