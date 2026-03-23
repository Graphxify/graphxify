import type { Metadata } from "next";
import { BlogPageContent } from "@/components/marketing/blog-page-content";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { getPublishedBlogSummaries } from "@/lib/blog-data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 30;

export const metadata: Metadata = buildMetadata({
  title: "Web Design & Digital Strategy Blog",
  description: "Practical guides on web design, web development, and branding for Canadian businesses. Insights from Graphxify, a web design and branding agency serving Toronto, Mississauga, and all of Canada.",
  path: "/blog",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "Web Design & Branding Insights | Graphxify Blog",
  ogDescription: "Practical guides on web design, branding, and digital strategy for Canadian business owners and founders — written by the team at Graphxify.",
  ogImageAlt: "Graphxify blog — web design and branding insights for Canadian businesses"
});

export default async function BlogPage() {
  const blogs = await getPublishedBlogSummaries();
  return (
    <>
      <ContentRefreshListener pathPrefixes={["/blog"]} />
      <BlogPageContent blogs={blogs} />
    </>
  );
}
