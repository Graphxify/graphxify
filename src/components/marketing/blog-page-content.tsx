"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type BlogCategory = "Brand Systems" | "Web Design" | "Development" | "CMS";

export type BlogPostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt?: string;
  category: BlogCategory;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const CATEGORY_FILTERS = ["All", "Brand Systems", "Web Design", "Development", "CMS"] as const;
const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

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

export function BlogPageContent({ posts }: { posts: BlogPostItem[] }): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORY_FILTERS)[number]>("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success">("idle");

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") {
      return remainingPosts;
    }
    return remainingPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory, remainingPosts]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visiblePosts.length < filteredPosts.length;

  function onFilterChange(filter: (typeof CATEGORY_FILTERS)[number]): void {
    setActiveCategory(filter);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function onSubscribeSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    event.currentTarget.reset();
    setSubscribeStatus("success");
    window.setTimeout(() => setSubscribeStatus("idle"), 2400);
  }

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
      <SectionReveal className="container" effect="up">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
            <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
            Insights
          </p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.96] tracking-tight">
            Ideas, systems, and structured thinking.
          </h1>
          <span className="mt-4 block h-px w-24 bg-accent-gradient" />
          <p className="mt-5 max-w-3xl text-base text-fg/66 md:text-[1.04rem]">
            Thoughts on branding, web architecture, and building scalable digital platforms.
          </p>
        </div>
      </SectionReveal>

      {featuredPost ? (
        <SectionReveal className="container mt-10 md:mt-12" effect="up">
          <article className="section-shell border-border/18 bg-card/74 p-5 md:p-7">
            <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr] lg:items-center">
              <div>
                <p className="inline-flex w-fit items-center rounded-full border border-border/16 bg-bg/48 px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.14em] text-fg/62">
                  {featuredPost.category}
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight md:text-3xl">{featuredPost.title}</h2>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg/66 md:text-base">{featuredPost.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-fg/56">
                  <span>{formatDate(featuredPost.createdAt)}</span>
                  {featuredPost.author ? <span>{featuredPost.author}</span> : null}
                </div>
                <Link href={`/blog/${featuredPost.slug}`} className="link-sweep mt-4 inline-flex items-center gap-1.5 text-sm text-fg/82">
                  Read Article
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group relative block aspect-[16/10] overflow-hidden rounded-[1rem] border border-border/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label={`Open featured post ${featuredPost.title}`}
              >
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:brightness-[0.68]"
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  priority
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/46 via-black/8 to-transparent" />
              </Link>
            </div>
          </article>
        </SectionReveal>
      ) : null}

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/16 pb-4">
          {CATEGORY_FILTERS.map((filter) => {
            const active = activeCategory === filter;
            return (
              <button
                key={`blog-filter-${filter}`}
                type="button"
                onClick={() => onFilterChange(filter)}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-fg/64 transition-colors hover:text-fg"
                aria-pressed={active}
              >
                <span className={`h-1.5 w-1.5 rounded-full transition-colors ${active ? "bg-accentA" : "bg-fg/28 group-hover:bg-fg/44"}`} />
                <span className={`relative pb-1 ${active ? "text-fg" : ""}`}>
                  {filter}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent-gradient transition-transform duration-200 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-6 md:mt-8" effect="up">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-border/18 bg-card/72 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/34 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-label={`Open article ${post.title}`}
            >
              <div className="relative block aspect-[16/10] overflow-hidden border-b border-border/14">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:brightness-[0.68]"
                  sizes="(max-width: 1280px) 100vw, 33vw"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/6 to-transparent" />
              </div>

              <div className="flex h-full flex-col p-4">
                <p className="inline-flex w-fit items-center rounded-full border border-border/16 bg-bg/48 px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-fg/62">
                  {post.category}
                </p>
                <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg/64">{post.excerpt}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-fg/56">{formatDate(post.createdAt)}</p>
                  <span className="link-sweep inline-flex items-center gap-1.5 text-sm text-fg/82">
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {visiblePosts.length === 0 ? (
          <p className="mt-6 text-center text-sm text-fg/62">No posts in this category yet.</p>
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

      <SectionReveal className="container mt-10 md:mt-12" effect="zoom">
        <div className="section-shell border-border/18 bg-card/76 p-5 md:p-6">
          <h2 className="text-2xl font-semibold md:text-3xl">Stay Updated</h2>
          <p className="mt-2 text-sm text-fg/66">Occasional insights. No spam.</p>
          <form onSubmit={onSubscribeSubmit} className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]" aria-label="Blog subscribe form">
            <Input
              type="email"
              required
              placeholder="Email address"
              className="h-12 rounded-xl border-border/18 bg-bg/62 px-4 text-sm placeholder:text-fg/45 placeholder:opacity-100"
              aria-label="Email address"
            />
            <Button type="submit" size="lg" className="h-12 px-6">
              Subscribe
            </Button>
          </form>
          {subscribeStatus === "success" ? <p className="mt-3 text-sm text-accentA">Subscribed. Thanks for joining.</p> : null}
        </div>
      </SectionReveal>
    </div>
  );
}
