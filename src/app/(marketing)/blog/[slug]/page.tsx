import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { CopyLinkButton } from "@/components/marketing/copy-link-button";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedPostBySlug, getPublishedPosts } from "@/db/queries/posts";
import { demoPosts } from "@/lib/demo-content";
import { siteConfig } from "@/lib/constants";
import { blogPostingJsonLd, buildMetadata } from "@/lib/seo";

type Params = { slug: string };

type BlogCategory = "Brand Systems" | "Web Design" | "Development" | "CMS";

type RawPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  created_at?: string;
  updated_at?: string;
  category?: string;
  author?: string;
  author_name?: string;
  author_role?: string;
  author_bio?: string;
  tags?: string[] | string | null;
  tag_list?: string[] | string | null;
  keywords?: string[] | string | null;
  seo_title?: string;
  seo_description?: string;
};

type PostDetails = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  createdAt?: string;
  updatedAt?: string;
  category: BlogCategory;
  authorName: string;
  authorRole: string;
  authorBio: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
};

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt?: string;
  category: BlogCategory;
};

type ContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; label: "Note" | "Tip" | "Key Insight"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "image"; src: string; alt: string; caption?: string };

const CATEGORY_VALUES: readonly BlogCategory[] = ["Brand Systems", "Web Design", "Development", "CMS"] as const;

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0)
      .slice(0, 6);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 6);
  }

  return [];
}

function inferCategory(input: { title?: string; excerpt?: string; content?: string; category?: string }, index = 0): BlogCategory {
  const explicit = getString(input.category);
  if (explicit && CATEGORY_VALUES.includes(explicit as BlogCategory)) {
    return explicit as BlogCategory;
  }

  const source = `${input.title ?? ""} ${input.excerpt ?? ""} ${input.content ?? ""}`.toLowerCase();
  if (source.includes("brand") || source.includes("identity")) return "Brand Systems";
  if (source.includes("design") || source.includes("ux") || source.includes("ui")) return "Web Design";
  if (source.includes("cms") || source.includes("content")) return "CMS";
  if (source.includes("development") || source.includes("engineering") || source.includes("performance") || source.includes("code")) {
    return "Development";
  }
  return CATEGORY_VALUES[index % CATEGORY_VALUES.length];
}

function formatDate(value?: string): string {
  if (!value) return "Latest";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Latest";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function estimateReadingTime(content: string): string {
  const words = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

function normalizePostDetails(input: Partial<RawPost>, index = 0): PostDetails | null {
  if (!input.id || !input.title || !input.slug || !input.excerpt) {
    return null;
  }

  const content = getString(input.content) ?? input.excerpt;

  return {
    id: input.id,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt.trim(),
    content,
    coverImage: getString(input.cover_image_url) ?? "/assets/post-fallback.svg",
    createdAt: getString(input.created_at),
    updatedAt: getString(input.updated_at),
    category: inferCategory(input, index),
    authorName: getString(input.author_name) ?? getString(input.author) ?? "Graphxify Team",
    authorRole: getString(input.author_role) ?? "Editorial / Platform",
    authorBio: getString(input.author_bio) ?? "Shares practical insights on brand systems, web architecture, and CMS delivery.",
    tags: parseTags(input.tags).length > 0 ? parseTags(input.tags) : parseTags(input.tag_list).length > 0 ? parseTags(input.tag_list) : parseTags(input.keywords),
    seoTitle: getString(input.seo_title),
    seoDescription: getString(input.seo_description)
  };
}

function normalizeRelatedPost(input: Partial<RawPost>, index = 0): RelatedPost | null {
  if (!input.id || !input.title || !input.slug || !input.excerpt) {
    return null;
  }

  return {
    id: input.id,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt.trim(),
    coverImage: getString(input.cover_image_url) ?? "/assets/post-fallback.svg",
    createdAt: getString(input.created_at),
    category: inferCategory(input, index)
  };
}

function selectRelatedPosts(posts: RelatedPost[], currentSlug: string, category: BlogCategory): RelatedPost[] {
  const filtered = posts.filter((post) => post.slug !== currentSlug);
  const sameCategory = filtered.filter((post) => post.category === category);
  const fallback = filtered.filter((post) => post.category !== category);
  return [...sameCategory, ...fallback].slice(0, 3);
}

function parseContentBlocks(content: string): ContentBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ContentBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const line = raw.trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.replace(/```/g, "").trim();
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    const imageMatch = line.match(/^!\[(.*?)\]\((\S+?)(?:\s+"(.*?)")?\)$/);
    if (imageMatch) {
      const [, alt, src, caption] = imageMatch;
      blocks.push({ type: "image", src, alt: alt || "Post visual", caption });
      i += 1;
      continue;
    }

    if (/^###\s+/.test(line)) {
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "") });
      i += 1;
      continue;
    }

    if (/^##\s+/.test(line)) {
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "") });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test((lines[i] ?? "").trim())) {
        quoteLines.push((lines[i] ?? "").trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }

    const calloutMatch = line.match(/^(NOTE|TIP|KEY INSIGHT)\s*:\s*(.+)$/i);
    if (calloutMatch) {
      const labelRaw = calloutMatch[1].toLowerCase();
      const label: "Note" | "Tip" | "Key Insight" =
        labelRaw === "tip" ? "Tip" : labelRaw === "key insight" ? "Key Insight" : "Note";
      blocks.push({ type: "callout", label, text: calloutMatch[2] });
      i += 1;
      continue;
    }

    const isOrdered = /^\d+\.\s+/.test(line);
    const isBullet = /^[-*]\s+/.test(line);
    if (isOrdered || isBullet) {
      const items: string[] = [];
      while (i < lines.length) {
        const listLine = (lines[i] ?? "").trim();
        if (isOrdered && /^\d+\.\s+/.test(listLine)) {
          items.push(listLine.replace(/^\d+\.\s+/, ""));
          i += 1;
          continue;
        }
        if (!isOrdered && /^[-*]\s+/.test(listLine)) {
          items.push(listLine.replace(/^[-*]\s+/, ""));
          i += 1;
          continue;
        }
        break;
      }
      blocks.push({ type: "list", ordered: isOrdered, items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const current = (lines[i] ?? "").trim();
      if (!current) {
        i += 1;
        break;
      }
      if (
        current.startsWith("```") ||
        /^!\[/.test(current) ||
        /^##\s+/.test(current) ||
        /^###\s+/.test(current) ||
        /^>\s?/.test(current) ||
        /^(NOTE|TIP|KEY INSIGHT)\s*:/i.test(current) ||
        /^\d+\.\s+/.test(current) ||
        /^[-*]\s+/.test(current)
      ) {
        break;
      }
      paragraphLines.push(current);
      i += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
    i += 1;
  }

  if (blocks.length === 0) {
    return [{ type: "paragraph", text: content }];
  }

  return blocks;
}

function PostContentRenderer({ content }: { content: string }): JSX.Element {
  const blocks = parseContentBlocks(content);

  return (
    <div className="space-y-5 text-base leading-8 text-fg/78 md:text-[1.03rem]">
      {blocks.map((block, index) => {
        const key = `post-block-${index}`;

        if (block.type === "h2") {
          return (
            <h2 key={key} className="pt-2 text-2xl font-semibold leading-tight text-fg md:text-[1.85rem]">
              {block.text}
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3 key={key} className="pt-2 text-xl font-semibold leading-tight text-fg md:text-[1.4rem]">
              {block.text}
            </h3>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote key={key} className="border-l-2 border-accentA/58 pl-4 text-fg/72 italic">
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "callout") {
          return (
            <aside key={key} className="rounded-xl border border-accentA/30 bg-bg/52 px-4 py-3">
              <p className="text-[0.66rem] uppercase tracking-[0.14em] text-accentA">{block.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg/74 md:text-[0.98rem]">{block.text}</p>
            </aside>
          );
        }

        if (block.type === "code") {
          return (
            <pre key={key} className="overflow-x-auto rounded-xl border border-border/16 bg-bg/60 p-4 text-sm leading-relaxed text-fg/82">
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={key} className="overflow-hidden rounded-xl border border-border/16 bg-bg/46">
              <div className="relative aspect-[16/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.src} alt={block.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
              {block.caption ? <figcaption className="px-3 py-2 text-xs text-fg/56">{block.caption}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag key={key} className={`space-y-1.5 pl-5 text-fg/76 ${block.ordered ? "list-decimal" : "list-disc"}`}>
              {block.items.map((item) => (
                <li key={`${key}-${item}`}>{item}</li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={key} className="text-fg/76">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  let rawPost: Partial<RawPost> | null = demoPosts.find((item) => item.slug === params.slug) as Partial<RawPost> | null;

  try {
    const dbPost = await getPublishedPostBySlug(params.slug);
    if (dbPost) {
      rawPost = dbPost as Partial<RawPost>;
    }
  } catch {
    // fallback
  }

  const post = rawPost ? normalizePostDetails(rawPost) : null;
  if (!post) {
    return buildMetadata({ title: "Post Not Found", description: "Post item not found.", path: `/blog/${params.slug}` });
  }

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage || "/assets/og-default.svg"
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  let rawPost: Partial<RawPost> | null = demoPosts.find((item) => item.slug === params.slug) as Partial<RawPost> | null;

  try {
    const dbPost = await getPublishedPostBySlug(params.slug);
    if (dbPost) {
      rawPost = dbPost as Partial<RawPost>;
    }
  } catch {
    // fallback
  }

  const post = rawPost ? normalizePostDetails(rawPost) : null;

  if (!post) {
    notFound();
  }

  let relatedSource: RelatedPost[] = demoPosts
    .map((item, index) => normalizeRelatedPost(item as Partial<RawPost>, index))
    .filter((item): item is RelatedPost => item !== null);

  try {
    const dbPosts = await getPublishedPosts();
    if (dbPosts.length > 0) {
      relatedSource = dbPosts
        .map((item, index) => normalizeRelatedPost(item as Partial<RawPost>, index))
        .filter((item): item is RelatedPost => item !== null);
    }
  } catch {
    // fallback
  }

  const relatedPosts = selectRelatedPosts(relatedSource, post.slug, post.category);
  const publishedAt = formatDate(post.createdAt);
  const readingTime = estimateReadingTime(post.content);
  const shareUrl = new URL(`/blog/${post.slug}`, siteConfig.url).toString();
  const authorInitials = post.authorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <article className="pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24">
      <JsonLd
        data={
          blogPostingJsonLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            datePublished: post.createdAt || new Date().toISOString()
          }) as Record<string, unknown>
        }
      />

      <SectionReveal className="container" effect="up">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex w-fit items-center rounded-full border border-border/16 bg-bg/48 px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.14em] text-fg/62">
            {post.category}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[0.96] tracking-tight">{post.title}</h1>
          <p className="mt-4 max-w-3xl text-base text-fg/66 md:text-[1.04rem]">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-fg/56">
            <span>{post.authorName}</span>
            <span className="h-1 w-1 rounded-full bg-fg/36" />
            <span>{publishedAt}</span>
            <span className="h-1 w-1 rounded-full bg-fg/36" />
            <span>{readingTime}</span>
          </div>
          <span className="mt-4 block h-px w-24 bg-accent-gradient" />
        </div>

        <div className="mx-auto mt-7 max-w-5xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.2rem] border border-border/16 shadow-card">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 72vw"
            />
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="mx-auto max-w-3xl">
          <PostContentRenderer content={post.content} />
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="mx-auto max-w-3xl border-t border-border/16 pt-5">
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={`${post.id}-tag-${tag}`}
                  className="inline-flex items-center rounded-full border border-border/18 bg-bg/46 px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.14em] text-fg/62"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3 border-b border-border/16 pb-5">
            <p className="text-xs uppercase tracking-[0.14em] text-fg/56">Share</p>
            <CopyLinkButton url={shareUrl} />
          </div>

          <div className="mt-5 rounded-xl border border-border/16 bg-card/72 p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/20 bg-bg/52 text-xs font-semibold text-fg/76">
                {authorInitials || "GT"}
              </span>
              <div>
                <p className="text-sm font-medium text-fg">{post.authorName}</p>
                <p className="text-xs text-accentA">{post.authorRole}</p>
                <p className="mt-1 text-sm text-fg/64">{post.authorBio}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold md:text-3xl">Related Posts</h2>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-fg/72 hover:text-fg">
            All insights
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((item) => (
            <Link
              key={item.id}
              href={`/blog/${item.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-border/18 bg-card/72 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/34 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-label={`Open article ${item.title}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border/14">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:brightness-[0.68]"
                  sizes="(max-width: 1280px) 100vw, 33vw"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/6 to-transparent" />
              </div>
              <div className="flex h-full flex-col p-4">
                <p className="inline-flex w-fit items-center rounded-full border border-border/16 bg-bg/48 px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-fg/62">
                  {item.category}
                </p>
                <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg/64">{item.excerpt}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-fg/56">{formatDate(item.createdAt)}</p>
                  <span className="link-sweep inline-flex items-center gap-1.5 text-sm text-fg/82">
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="zoom">
        <div className="section-shell border-border/18 bg-card/76 p-6 text-center md:p-8">
          <h2 className="text-2xl font-semibold md:text-3xl">Want help building something like this?</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Start a Project</Link>
            </Button>
          </div>
        </div>
      </SectionReveal>
    </article>
  );
}
