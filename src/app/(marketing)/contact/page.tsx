import type { Metadata } from "next";
import { ContactPageContent } from "@/components/marketing/contact-page-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Start Your Web Design or Branding Project | Contact Graphxify",
  description: "Get in touch with Graphxify — a Canadian web design and branding agency serving Toronto, Mississauga, and Ontario. Tell us about your project and receive a clear, honest proposal.",
  path: "/contact"
});

export default function ContactPage(): JSX.Element {
  return <ContactPageContent />;
}
