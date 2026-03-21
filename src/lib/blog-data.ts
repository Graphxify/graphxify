import "server-only";

import { getPublishedPostBySlug, getPublishedPosts } from "@/db/queries/posts";
import { normalizeBlogPost, toBlogPostSummary, type BlogCmsRecord, type BlogPost, type BlogPostSummary } from "@/lib/blog";

function sortBlogsByPublishedAt(blogs: BlogPost[]): BlogPost[] {
  return [...blogs].sort((left, right) => {
    const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
    const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const rows = await getPublishedPosts();
  return sortBlogsByPublishedAt(
    rows
      .map((row) => normalizeBlogPost(row as BlogCmsRecord))
      .filter((row): row is BlogPost => row !== null)
  );
}

export async function getPublishedBlogBySlug(slug: string): Promise<BlogPost | null> {
  const row = await getPublishedPostBySlug(slug);
  return row ? normalizeBlogPost(row as BlogCmsRecord) : null;
}

export async function getPublishedBlogSummaries(): Promise<BlogPostSummary[]> {
  const blogs = await getPublishedBlogs();
  return blogs.map(toBlogPostSummary);
}
