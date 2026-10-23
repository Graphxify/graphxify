"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { formatBlogDate } from "@/components/marketing/blog-card";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { Badge } from "@/components/site/badge";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { Button, buttonVariants } from "@/components/ui/button";
import { BLOG_CATEGORIES, type BlogPostSummary } from "@/lib/blog";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import { cn } from "@/lib/utils";

const CATEGORY_FILTERS = ["All", ...BLOG_CATEGORIES] as const;
const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

const PILL = "rounded-full bg-bg px-3 py-1 text-[0.8125rem] font-semibold text-fg/72";

function PostDate({ value }: { value?: string }): JSX.Element {
  return value ? <time dateTime={value}>{formatBlogDate(value)}</time> : <>{formatBlogDate(value)}</>;
}

/** White card: cover framed inside, category and read time as pills below it, title, date. Used by the index and related posts. */
export function PostCard({ post, headingLevel: Heading = "h3" }: { post: BlogPostSummary; headingLevel?: "h2" | "h3" }): JSX.Element {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-[2rem] bg-white p-3 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift motion-reduce:transform-none"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-bg">
        <Image
          src={post.coverImage}
          alt={`Cover illustration for “${post.title}”`}
          fill
          unoptimized={shouldBypassNextImageOptimization(post.coverImage)}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
        />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <p className="flex flex-wrap gap-2">
          <span className={PILL}>{post.category}</span>
          <span className={PILL}>{post.readTime}</span>
        </p>
        <Heading className="t-h3 mt-4 line-clamp-3 text-fg">{post.title}</Heading>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className="t-small">
            <PostDate value={post.publishedAt} />
          </p>
          <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function BlogPageContent({ blogs }: { blogs: BlogPostSummary[] }): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORY_FILTERS)[number]>("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const featuredBlog = blogs[0];
  const remainingBlogs = useMemo(() => blogs.slice(1), [blogs]);

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") {
      return remainingBlogs;
    }
    return remainingBlogs.filter((blog) => blog.category === activeCategory);
  }, [activeCategory, remainingBlogs]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleBlogs.length < filteredBlogs.length;

  function onFilterChange(filter: (typeof CATEGORY_FILTERS)[number]): void {
    setActiveCategory(filter);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  return (
    <>
      <PageHero
        label="Blog"
        title={
          <>
            Web design, branding, and digital strategy <span className="text-accentB">insights</span> for modern businesses.
          </>
        }
        lead="Practical guides to help businesses worldwide build better websites, stronger brands, and smarter digital strategy."
        className="[&_h1]:max-w-[20ch] [&_h1]:text-[clamp(2.25rem,5vw,4.25rem)]"
      />

      <section aria-label="About the blog" className="container pb-10 md:pb-14">
        <div className="grid gap-4 border-t border-fg/[0.08] pt-8 md:grid-cols-12 md:gap-6 md:pt-10">
          <p className="t-small font-semibold text-fg md:col-span-3">About the blog</p>
          <p className="max-w-[64ch] text-[1.0625rem] leading-relaxed text-fg/72 md:col-span-9">
            Written for business owners rather than designers, each article answers one practical question about building a brand or website that works. Topics range from choosing a web design partner and designing mobile-first to what a brand identity really includes, custom development versus WordPress, and getting found in local search. Filter by topic below, or start with the featured article.
          </p>
        </div>
      </section>
      {featuredBlog ? (
        <section aria-label="Featured article" className="container">
          <Reveal>
            <Link
              href={`/blog/${featuredBlog.slug}`}
              className="group grid gap-6 rounded-[2rem] bg-white p-3 transition-shadow duration-300 hover:shadow-lift md:rounded-[2.5rem] md:p-4 lg:grid-cols-12 lg:items-center lg:gap-10"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-bg md:rounded-[2rem] lg:col-span-7">
                <Image
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  fill
                  priority
                  unoptimized={shouldBypassNextImageOptimization(featuredBlog.coverImage)}
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                />
              </div>
              <div className="flex flex-col items-start px-3 pb-4 lg:col-span-5 lg:py-6 lg:pl-0 lg:pr-8">
                <p className="flex flex-wrap items-center gap-2">
                  <Badge dot="blue" className="bg-bg shadow-none">
                    Featured
                  </Badge>
                  <span className={PILL}>{featuredBlog.category}</span>
                </p>
                <h2 className="t-h2 mt-6 !text-[clamp(1.75rem,3.2vw,2.75rem)] text-fg">{featuredBlog.title}</h2>
                <p className="t-body mt-4 line-clamp-3 max-w-[48ch]">{featuredBlog.excerpt}</p>
                <div className="mt-7 flex items-center gap-3">
                  <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fg text-[0.8125rem] font-extrabold text-white">
                    {initials(featuredBlog.authorName) || "G"}
                  </span>
                  <div>
                    <p className="text-[0.9375rem] font-bold text-fg">{featuredBlog.authorName}</p>
                    <p className="t-small !text-[0.8125rem]">
                      <PostDate value={featuredBlog.publishedAt} />
                      <span aria-hidden="true" className="mx-1.5">
                        ·
                      </span>
                      {featuredBlog.readTime}
                    </p>
                  </div>
                </div>
                {/* Styled like a button; the whole card is already the link. */}
                <span className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
                  Read article
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      ) : null}

      <section className="container section">
        <Reveal>
          <SectionIntro
            badge="Articles"
            title={
              <>
                Latest <span className="text-accentB">articles</span>
              </>
            }
          />
        </Reveal>

        <div role="group" aria-label="Filter articles by category" className="mt-10 flex flex-wrap justify-center gap-2 md:mt-12">
          {CATEGORY_FILTERS.map((filter) => {
            const active = activeCategory === filter;
            // Counts match what the grid below will show (the featured post sits above it).
            const count = filter === "All" ? remainingBlogs.length : remainingBlogs.filter((blog) => blog.category === filter).length;
            return (
              <button
                key={`blog-filter-${filter}`}
                type="button"
                onClick={() => onFilterChange(filter)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.875rem] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentB focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  active ? "bg-fg text-white" : "bg-white text-fg/72 hover:text-fg"
                )}
              >
                {filter}
                <span className={cn("text-[0.75rem] tabular-nums", active ? "text-white/60" : "text-fg/40")}>{count}</span>
              </button>
            );
          })}
        </div>

        {visibleBlogs.length > 0 ? (
          <ul className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {visibleBlogs.map((blog, index) => (
              <Reveal as="li" key={blog.id} delay={(index % 3) * 60}>
                <PostCard post={blog} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-10 max-w-xl rounded-[2rem] bg-white px-6 py-12 text-center md:mt-12">
            <p className="t-h3 text-fg">No articles in this category yet.</p>
            <p className="t-body mt-2">Check back soon. New articles are published regularly.</p>
          </div>
        )}

        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <Button type="button" variant="secondary" size="lg" onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}>
              Load more
            </Button>
          </div>
        ) : null}
      </section>

      <section className="container">
        <Reveal>
          <NewsletterSignup source="blog" idPrefix="blog" />
        </Reveal>
      </section>
    </>
  );
}
