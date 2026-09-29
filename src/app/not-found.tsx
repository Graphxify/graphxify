import type { Metadata } from "next";
import { NotFound } from "@/components/ui/not-found-2";
import { siteConfig } from "@/lib/constants";

// Own title (instead of inheriting the homepage's) and no canonical. Next.js
// already serves this with HTTP 404 + noindex.
export const metadata: Metadata = {
  title: `Page Not Found | ${siteConfig.name}`,
  description: "The page you were looking for could not be found.",
  robots: { index: false, follow: true }
};

export default function NotFoundPage() {
  return <NotFound />;
}
