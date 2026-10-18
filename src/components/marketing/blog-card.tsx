import Image from "next/image";
import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";

/** Pinned to UTC: CMS dates are UTC midnights, so local formatting could print the previous day. */
export function formatBlogDate(value?: string): string {
  if (!value) return "Latest";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Latest";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** Cover in a 20px frame, caption below. Used by the blog index and related posts. */
export function BlogCard({ post, headingLevel: Heading = "h3" }: { post: BlogPostSummary; headingLevel?: "h2" | "h3" }): JSX.Element {
  return (
    <Link href={`/blog/${post.slug}`} className="group block rounded-[1.25rem]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-surface">
        <Image
          src={post.coverImage}
          alt=""
          fill
          unoptimized={shouldBypassNextImageOptimization(post.coverImage)}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <p className="t-label mt-5">{post.category}</p>
      <Heading className="t-h3 mt-2 line-clamp-2 text-fg transition-colors duration-200 group-hover:text-accentB">{post.title}</Heading>
      <p className="t-body mt-3 line-clamp-2">{post.excerpt}</p>
      <p className="mt-4 text-[0.8125rem] text-fg/60">
        {post.publishedAt ? <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time> : formatBlogDate(post.publishedAt)}
        <span aria-hidden="true" className="mx-2 text-fg/30">/</span>
        {post.readTime}
      </p>
    </Link>
  );
}
