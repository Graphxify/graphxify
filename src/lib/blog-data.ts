import "server-only";

import { getPublishedPostBySlug, getPublishedPosts } from "@/db/queries/posts";
import { normalizeBlogPost, toBlogPostSummary, type BlogCmsRecord, type BlogPost, type BlogPostSummary } from "@/lib/blog";
import {
  getOriginalPublishedBlogBySlug,
  getOriginalPublishedBlogs,
  isLegacyPlaceholderBlogSlug
} from "@/lib/original-blog-content";

function sortBlogsByPublishedAt(blogs: BlogPost[]): BlogPost[] {
  return [...blogs].sort((left, right) => {
    const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
    const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

function mergeWithOriginalBlogBackfill(blogs: BlogPost[]): BlogPost[] {
  const merged = new Map<string, BlogPost>();

  for (const blog of blogs) {
    merged.set(blog.slug, blog);
  }

  for (const original of getOriginalPublishedBlogs()) {
    if (!merged.has(original.slug)) {
      merged.set(original.slug, original);
    }
  }

  return sortBlogsByPublishedAt(Array.from(merged.values()));
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const rows = await getPublishedPosts();
    const cmsBlogs = rows
      .map((row) => normalizeBlogPost(row as BlogCmsRecord))
      .filter((row): row is BlogPost => row !== null)
      .filter((row) => !isLegacyPlaceholderBlogSlug(row.slug));

    if (cmsBlogs.length === 0) {
      return getOriginalPublishedBlogs();
    }

    return mergeWithOriginalBlogBackfill(cmsBlogs);
  } catch {
    return getOriginalPublishedBlogs();
  }
}

export async function getPublishedBlogBySlug(slug: string): Promise<BlogPost | null> {
  if (isLegacyPlaceholderBlogSlug(slug)) {
    return null;
  }

  try {
    const row = await getPublishedPostBySlug(slug);
    const blog = row ? normalizeBlogPost(row as BlogCmsRecord) : null;
    if (blog && !isLegacyPlaceholderBlogSlug(blog.slug)) {
      return blog;
    }
  } catch {
    return getOriginalPublishedBlogBySlug(slug);
  }

  return getOriginalPublishedBlogBySlug(slug);
}

export async function getPublishedBlogSummaries(): Promise<BlogPostSummary[]> {
  const blogs = await getPublishedBlogs();
  return blogs.map(toBlogPostSummary);
}
