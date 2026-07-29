"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Clock, Sparkles } from "lucide-react";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES, type BlogCategory, type BlogPostSummary } from "@/lib/blog";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";

const CATEGORY_FILTERS = ["All", ...BLOG_CATEGORIES] as const;
const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

const CATEGORY_COLORS: Record<BlogCategory, { dot: string; pill: string }> = {
  "Web Design": { dot: "bg-sky-400", pill: "border-sky-500/25 text-sky-300" },
  "Web Development": { dot: "bg-emerald-400", pill: "border-emerald-500/25 text-emerald-300" },
  Branding: { dot: "bg-violet-400", pill: "border-violet-500/25 text-violet-300" },
  "Business Growth": { dot: "bg-amber-400", pill: "border-amber-500/25 text-amber-300" },
  "Digital Strategy": { dot: "bg-rose-400", pill: "border-rose-500/25 text-rose-300" }
};

function formatDate(value?: string): string {
  if (!value) {
    return "Latest";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Latest";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function BlogPageContent({ blogs }: { blogs: BlogPostSummary[] }): JSX.Element {
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORY_FILTERS)[number]>("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);

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
    <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
      <SectionReveal className="container" effect="up">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
            <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
            Blogs
          </p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.12] tracking-tight md:leading-[1.08]">
            Web design, branding, and digital strategy insights for modern businesses.
          </h1>
          <span className="mt-4 block h-px w-24 bg-accent-gradient" />
          <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.04rem]">
            Practical guides to help businesses worldwide build better websites, stronger brands, and smarter digital strategy.
          </p>
        </div>
      </SectionReveal>

      {featuredBlog ? (
        <SectionReveal className="container mt-10 md:mt-12" effect="up">
          <Link
            href={`/blog/${featuredBlog.slug}`}
            className="group block rounded-[1.2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            aria-label={`Open featured blog ${featuredBlog.title}`}
          >
            <article className="section-shell relative overflow-hidden border-border/18 bg-card/74 p-5 transition-[border-color] duration-150 group-hover:border-border/32 md:p-7">
              <span className="pointer-events-none absolute -right-20 -top-20 z-0 h-60 w-60 rounded-full bg-accentA/6 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_0.95fr] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accentA/30 bg-accentA/10 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-accentA">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                    <span className={`inline-flex items-center rounded-full border bg-bg/48 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em] ${CATEGORY_COLORS[featuredBlog.category].pill}`}>
                      {featuredBlog.category}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight md:text-3xl">{featuredBlog.title}</h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg/66 md:text-base">{featuredBlog.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-fg/50">
                    <span className="uppercase tracking-[0.14em]">{formatDate(featuredBlog.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 rounded-full bg-accentA/15 text-center text-[0.5rem] font-bold leading-[1rem] text-accentA">
                        {featuredBlog.authorName.charAt(0).toUpperCase()}
                      </span>
                      {featuredBlog.authorName}
                    </span>
                    <span className="flex items-center gap-1 text-fg/44">
                      <Clock className="h-3 w-3" />
                      {featuredBlog.readTime}
                    </span>
                  </div>
                  <span className="link-sweep mt-4 inline-flex items-center gap-1.5 text-sm text-fg/82 transition-colors group-hover:text-accentA">
                    Read Article
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                <div className="relative block aspect-[16/10] overflow-hidden rounded-[1rem] border border-border/16">
                  <Image
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    fill
                    unoptimized={shouldBypassNextImageOptimization(featuredBlog.coverImage)}
                    className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.025] group-hover:brightness-[0.68]"
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    priority
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/46 via-black/8 to-transparent" />
                </div>
              </div>
            </article>
          </Link>
        </SectionReveal>
      ) : null}

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_FILTERS.map((filter) => {
            const active = activeCategory === filter;
            const colors = filter !== "All" ? CATEGORY_COLORS[filter as BlogCategory] : null;
            return (
              <button
                key={`blog-filter-${filter}`}
                type="button"
                onClick={() => onFilterChange(filter)}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-all duration-200 ${active
                  ? "border-accentA/40 bg-accentA/12 text-accentA shadow-[0_0_12px_rgba(59,130,246,0.12)]"
                  : "border-border/18 bg-card/50 text-fg/56 hover:border-border/34 hover:text-fg/78"
                  }`}
                aria-pressed={active}
              >
                <span className={`h-1.5 w-1.5 rounded-full transition-colors ${active ? "bg-accentA" : colors?.dot ?? "bg-fg/28"}`} />
                {filter}
                {filter !== "All" ? (
                  <span className="ml-0.5 text-[0.58rem] tabular-nums text-fg/36">{blogs.filter((blog) => blog.category === filter).length}</span>
                ) : (
                  <span className="ml-0.5 text-[0.58rem] tabular-nums text-fg/36">{blogs.length}</span>
                )}
              </button>
            );
          })}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-6 md:mt-8" effect="up">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleBlogs.map((blog, index) => {
            const colors = CATEGORY_COLORS[blog.category];
            return (
              <motion.div
                key={blog.id}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(0.05 * index, 0.2), ease: [0.23, 1, 0.32, 1] }}
              >
                <Link
                  href={`/blog/${blog.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-border/18 bg-card/72 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-border/34 hover:shadow-[0_8px_30px_rgba(0,0,0,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  aria-label={`Open blog ${blog.title}`}
                >
                  <div className="relative block aspect-[16/10] overflow-hidden border-b border-border/14">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      unoptimized={shouldBypassNextImageOptimization(blog.coverImage)}
                      className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.025] group-hover:brightness-[0.65]"
                      sizes="(max-width: 1280px) 100vw, 33vw"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/6 to-transparent" />
                    <span className={`absolute left-3 top-3 inline-flex items-center rounded-full border bg-bg/70 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.14em] backdrop-blur-sm ${colors.pill}`}>
                      {blog.category}
                    </span>
                  </div>

                  <div className="flex h-full flex-col p-4">
                    <h3 className="line-clamp-2 text-lg font-semibold leading-tight transition-colors duration-200 group-hover:text-accentA">{blog.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg/60">{blog.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                      <div className="flex items-center gap-3 text-xs text-fg/48">
                        <span className="uppercase tracking-[0.14em]">{formatDate(blog.publishedAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.readTime}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm text-fg/70 transition-colors duration-200 group-hover:text-accentA">
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {visibleBlogs.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 py-12 text-center">
            <div className="rounded-2xl border border-border/14 bg-card/40 p-4">
              <BookOpen className="h-8 w-8 text-fg/28" />
            </div>
            <p className="text-sm font-medium text-fg/62">No blogs in this category yet.</p>
            <p className="text-xs text-fg/42">Check back soon. New articles are published regularly.</p>
          </div>
        ) : null}

        {hasMore ? (
          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="px-6 hover:border-accentA/45 hover:bg-accent-gradient hover:text-ivory"
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
            >
              Load More
            </Button>
          </div>
        ) : null}
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-14" effect="zoom">
        <NewsletterSignup source="blog" idPrefix="blog" />
      </SectionReveal>
    </div>
  );
}
