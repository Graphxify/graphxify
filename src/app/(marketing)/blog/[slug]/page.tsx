import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
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
            datePublished: ("created_at" in post && typeof post.created_at === "string" ? post.created_at : undefined) || new Date().toISOString()
          }) as Record<string, unknown>
        }
      />

      <RevealStagger className="space-y-10" effect="up">
        <RevealItem className="space-y-4" effect="left">
          <Link href="/blog" className="link-sweep text-sm text-fg/68">
            Back to blog
          </Link>
          <h1 className="text-4xl font-semibold md:text-5xl">{post.title}</h1>
          <p className="max-w-3xl text-fg/68">{post.excerpt}</p>
        </RevealItem>
        <RevealItem effect="zoom">
          <div className="relative h-[28rem] overflow-hidden rounded-2xl border border-border/18">
            <Image
              src={post.cover_image_url || "/assets/post-fallback.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              priority
            />
          </div>
        </RevealItem>
        <RevealItem effect="right">
          <div className="section-shell border-border/18 bg-card/72 p-6 text-fg/78">
            <p>{post.content}</p>
          </div>
        </RevealItem>
      </RevealStagger>
    </article>
  );
}
