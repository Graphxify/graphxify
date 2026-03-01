import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedPostBySlug } from "@/db/queries/posts";
import { demoPosts } from "@/lib/demo-content";
import { blogPostingJsonLd, buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  let post = demoPosts.find((item) => item.slug === params.slug) ?? null;
  try {
    const dbPost = await getPublishedPostBySlug(params.slug);
    if (dbPost) post = dbPost;
  } catch {
    // fallback
  }
  if (!post) return buildMetadata({ title: "Post Not Found", description: "Post item not found.", path: `/blog/${params.slug}` });

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover_image_url || "/assets/og-default.svg"
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  let post = demoPosts.find((item) => item.slug === params.slug) ?? null;
  try {
    const dbPost = await getPublishedPostBySlug(params.slug);
    if (dbPost) post = dbPost;
  } catch {
    // fallback
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="container py-16">
      <JsonLd
        data={
          blogPostingJsonLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            datePublished: post.created_at || new Date().toISOString()
          }) as Record<string, unknown>
        }
      />
      <h1 className="text-4xl font-semibold">{post.title}</h1>
      <p className="mt-3 max-w-3xl text-[rgba(242,240,235,0.75)]">{post.excerpt}</p>
      <div className="relative mt-8 h-80 overflow-hidden rounded-xl border border-[rgba(242,240,235,0.18)]">
        <Image src={post.cover_image_url || "/assets/post-fallback.svg"} alt={post.title} fill className="object-cover" priority />
      </div>
      <div className="mt-8 max-w-3xl space-y-4 text-[rgba(242,240,235,0.85)]">
        <p>{post.content}</p>
      </div>
    </article>
  );
}
