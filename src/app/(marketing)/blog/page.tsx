import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/db/queries/posts";
import { demoPosts } from "@/lib/demo-content";
import { buildMetadata } from "@/lib/seo";

type PostPreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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
    cover_image_url: item.cover_image_url ?? null,
    created_at: item.created_at
  };
}

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Insights on enterprise websites, governance, analytics, and content operations.",
  path: "/blog"
});

export default async function BlogPage() {
  let posts: PostPreview[] = demoPosts
    .map((item) => toPostPreview(item))
    .filter((item): item is PostPreview => item !== null);

  try {
    const dbPosts = await getPublishedPosts();
    if (dbPosts.length > 0) {
      posts = dbPosts
        .map((item) => toPostPreview(item as Partial<PostPreview>))
        .filter((item): item is PostPreview => item !== null);
    }
  } catch {
    // fallback
  }

  return (
    <section className="container py-16">
      <h1 className="text-4xl font-semibold">Blog</h1>
      <p className="mt-3 max-w-2xl text-[rgba(242,240,235,0.75)]">Tactical guides and system-level practices from Graphxify.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-xl border border-[rgba(242,240,235,0.18)] p-4 transition-transform hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden rounded-lg">
              <Image
                src={post.cover_image_url || "/assets/post-fallback.svg"}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-[rgba(242,240,235,0.76)]">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm text-accentA">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
