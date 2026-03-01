import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { getPublishedPosts } from "@/db/queries/posts";
import { buildMetadata } from "@/lib/seo";
import { journalPosts } from "@/lib/journal-content";

export const dynamic = "force-dynamic";

const MIN_JOURNAL_LENGTH = 600;

type PostPreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  cover_image_url: string | null;
  created_at?: string;
};

function toPostPreview(item: Partial<PostPreview>): PostPreview | null {
  if (!item.id || !item.title || !item.slug || !item.excerpt) {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    cover_image_url: item.cover_image_url ?? null,
    created_at: item.created_at
  };
}

export const metadata: Metadata = buildMetadata({
  title: "Journal - Graphxify",
  description:
    "Practical notes on brand systems, UX/UI quality, performance-first development, and structured CMS implementation.",
  path: "/blog"
});

export default async function BlogPage() {
  let posts: PostPreview[] = journalPosts;

  try {
    const dbPosts = await getPublishedPosts();
    const filtered = dbPosts
      .map((item) => toPostPreview(item as Partial<PostPreview>))
      .filter((item): item is PostPreview => item !== null)
      .filter((item) => (item.content || "").trim().length >= MIN_JOURNAL_LENGTH);

    const localBySlug = new Set(journalPosts.map((item) => item.slug));
    const merged = [...journalPosts, ...filtered.filter((item) => !localBySlug.has(item.slug))];

    if (merged.length > 0) {
      posts = merged.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
    }
  } catch {
    // degraded mode fallback
  }

  return (
    <section className="container py-16">
      <RevealStagger className="space-y-10">
        <RevealItem className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Journal</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Graphxify Journal</h1>
          <p className="max-w-3xl text-fg/72">
            Practical notes on brand systems, UX/UI quality, performance-first development, and structured CMS
            implementation.
          </p>
        </RevealItem>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <RevealItem key={post.id}>
              <article className="section-shell lift-hover overflow-hidden p-4">
                <div className="relative h-48 overflow-hidden rounded-lg border border-border/18">
                  <Image
                    src={post.cover_image_url || "/assets/post-fallback.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-fg/56">{post.created_at || "Latest"}</p>
                <h2 className="mt-1 text-xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-sm text-fg/68">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="link-sweep mt-4 inline-flex text-sm text-fg">
                  Read article
                </Link>
              </article>
            </RevealItem>
          ))}
        </div>
      </RevealStagger>
    </section>
  );
}
