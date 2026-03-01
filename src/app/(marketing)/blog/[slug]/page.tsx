import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedPostBySlug } from "@/db/queries/posts";
import { blogPostingJsonLd, buildMetadata } from "@/lib/seo";
import { findJournalPost } from "@/lib/journal-content";

type Params = { slug: string };

const MIN_JOURNAL_LENGTH = 600;

type PostData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  created_at: string;
};

async function resolvePost(slug: string): Promise<PostData | null> {
  const local = findJournalPost(slug);

  try {
    const dbPost = await getPublishedPostBySlug(slug);

    if (local) {
      return {
        title: local.title,
        slug: local.slug,
        excerpt: local.excerpt,
        content: local.content,
        cover_image_url: dbPost?.cover_image_url || local.cover_image_url,
        created_at: dbPost?.created_at || local.created_at
      };
    }

    if (dbPost && String(dbPost.content || "").trim().length >= MIN_JOURNAL_LENGTH) {
      return {
        title: dbPost.title,
        slug: dbPost.slug,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        cover_image_url: dbPost.cover_image_url,
        created_at: dbPost.created_at
      };
    }
  } catch {
    if (local) {
      return {
        title: local.title,
        slug: local.slug,
        excerpt: local.excerpt,
        content: local.content,
        cover_image_url: local.cover_image_url,
        created_at: local.created_at
      };
    }
  }

  return null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await resolvePost(params.slug);

  if (!post) {
    return buildMetadata({
      title: "Journal Post Not Found - Graphxify",
      description: "Journal post not found.",
      path: `/blog/${params.slug}`
    });
  }

  return buildMetadata({
    title: `${post.title} - Graphxify`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover_image_url || "/opengraph-image"
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post = await resolvePost(params.slug);

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

      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-4">
          <Link href="/blog" className="link-sweep text-sm text-fg/68">
            Back to journal
          </Link>
          <h1 className="text-4xl font-semibold md:text-5xl">{post.title}</h1>
          <p className="max-w-3xl text-fg/72">{post.excerpt}</p>
        </RevealItem>

        <RevealItem>
          <div className="relative h-[28rem] overflow-hidden rounded-2xl border border-border/18">
            <Image
              src={post.cover_image_url || "/assets/post-fallback.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </RevealItem>

        <RevealItem>
          <div className="section-shell p-6 text-fg/80">
            <div className="space-y-4">
              {post.content
                .split("\n\n")
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                ))}
            </div>
          </div>
        </RevealItem>
      </RevealStagger>
    </article>
  );
}
