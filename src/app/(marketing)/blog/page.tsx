import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { getPublishedPosts } from "@/db/queries/posts";
import { demoPosts } from "@/lib/demo-content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

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
    <section className="container py-14 md:py-16">
      <RevealStagger className="space-y-10" effect="up">
        <RevealItem className="space-y-3" effect="left">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Insights</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Graphxify Journal</h1>
          <p className="max-w-2xl text-fg/68">Practical notes on UX quality, CMS operations, and premium interaction design.</p>
        </RevealItem>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <RevealItem key={post.id} effect={index % 3 === 0 ? "left" : index % 3 === 1 ? "zoom" : "right"}>
              <article className="section-shell lift-hover overflow-hidden border-border/18 bg-card/72 p-4">
                <div className="relative h-48 overflow-hidden rounded-lg border border-border/14">
                  <Image
                    src={post.cover_image_url || "/assets/post-fallback.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
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
