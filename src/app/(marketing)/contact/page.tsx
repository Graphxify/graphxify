import type { Metadata } from "next";
import { ContactPageContent } from "@/components/marketing/contact-page-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Start a Web Design or Branding Project",
  description: "Get in touch with Graphxify, a web design and development agency based in Canada and working worldwide. Tell us about your project for a clear proposal.",
  path: "/contact",
  ogTitle: "Start a Project — Work with Graphxify",
  ogDescription: "Tell us about your brand or website project. We review every inquiry personally and typically respond within 24 hours with a clear, honest recommendation.",
  ogImageAlt: "Contact Graphxify — start a web design or branding project"
});

export default function ContactPage(): JSX.Element {
  return <ContactPageContent />;
}
