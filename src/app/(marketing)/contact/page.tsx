import type { Metadata } from "next";
import { ContactPageContent } from "@/components/marketing/contact-page-content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Start your project with Graphxify. Share your goals, timeline, and scope to receive clear next steps.",
  path: "/contact"
});

export default function ContactPage(): JSX.Element {
  return <ContactPageContent />;
}
