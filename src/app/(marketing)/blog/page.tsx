import type { Metadata } from "next";
import { BlogPageContent } from "@/components/marketing/blog-page-content";
import { getPublishedBlogSummaries } from "@/lib/blog-data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 30;

export const metadata: Metadata = buildMetadata({
  title: "Web Design, Branding & Digital Strategy Blogs | Graphxify Canada",
  description: "Practical guides on web design, web development, and branding for Canadian businesses. Insights from Graphxify, a web design and branding agency serving Toronto, Mississauga, and all of Canada.",
  path: "/blog"
});

export default async function BlogPage() {
  const blogs = await getPublishedBlogSummaries();
  return <BlogPageContent blogs={blogs} />;
}
