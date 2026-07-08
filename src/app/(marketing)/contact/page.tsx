import type { Metadata } from "next";
import { ContactPageContent } from "@/components/marketing/contact-page-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Graphxify – Start Your Project",
  description: "Get in touch with Graphxify — a web design and branding agency serving businesses worldwide. Tell us about your project and receive a clear, honest proposal.",
  path: "/contact",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "Start a Project — Work with Graphxify",
  ogDescription: "Tell us about your brand or website project. We review every inquiry personally and respond within 24 hours with a clear, honest recommendation.",
  ogImageAlt: "Contact Graphxify — start a web design or branding project"
});

export default function ContactPage(): JSX.Element {
  return <ContactPageContent />;
}
