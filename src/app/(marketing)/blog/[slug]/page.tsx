import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PostCard } from "@/components/marketing/blog-page-content";
import { CopyLinkButton } from "@/components/marketing/copy-link-button";
import { OnThisPage, slugify } from "@/components/marketing/on-this-page";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowLink } from "@/components/site/arrow-link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaBlock } from "@/components/site/cta-block";
import { Badge } from "@/components/site/badge";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { estimateReadTime, selectRelatedBlogPosts } from "@/lib/blog";
import { getPublishedBlogBySlug, getPublishedBlogSummaries } from "@/lib/blog-data";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import { siteConfig } from "@/lib/constants";
import { blogPostingJsonLd, breadcrumbListJsonLd, buildMetadata, canonicalUrl } from "@/lib/seo";

export const revalidate = 30;
// Only slugs returned by generateStaticParams are served; any other /blog/* URL
// returns a real 404 (not a soft-404 200). Existing posts still update via ISR;
// a newly published post becomes reachable on the next deploy.
export const dynamicParams = false;

type Params = { slug: string };

type ContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; label: "Note" | "Tip" | "Key Insight"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "table"; header: string[]; rows: string[][] };

/** Splits a markdown table row like `| a | b |` into trimmed cells. */
function splitTableRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((cell) => cell.trim());
}

/** True if a line is a markdown table separator, e.g. `|---|:--:|`. */
function isTableSeparator(line: string): boolean {
  if (!line.includes("-") || !line.includes("|")) return false;
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{1,}:?$/.test(cell));
}

/** True if `lines[idx]` starts a markdown table (header row + separator row). */
function isTableStart(lines: string[], idx: number): boolean {
  const header = (lines[idx] ?? "").trim();
  const separator = (lines[idx + 1] ?? "").trim();
  return header.includes("|") && !isTableSeparator(header) && isTableSeparator(separator);
}

const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "cajxvhcrfgpyyqohlkfp.supabase.co";

const EXTRA_IMAGE_HOSTS = (process.env.NEXT_PUBLIC_IMAGE_DOMAINS || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

function formatDate(value?: string): string {
  if (!value) return "Latest";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Latest";
  // Pinned to UTC: CMS dates are stored as UTC midnights, so formatting in the
  // server's local zone could print the previous day and disagree with the
  // datePublished in the JSON-LD.
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}

function canUseNextImage(src: string): boolean {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(src);
    const hostname = url.hostname.toLowerCase();
    const siteHost = new URL(siteConfig.url).hostname.toLowerCase();
    return hostname === siteHost || hostname === SUPABASE_HOST || EXTRA_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

function PostContentImage({ src, alt }: { src: string; alt: string }): JSX.Element {
  if (canUseNextImage(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={shouldBypassNextImageOptimization(src)}
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 768px"
      />
    );
  }

  return (
    // Fallback for arbitrary external image URLs that are not whitelisted in next/image config.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      fetchPriority="low"
    />
  );
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
      blocks.push({ type: "image", src, alt: alt || "Blog visual", caption });
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

    if (isTableStart(lines, i)) {
      const header = splitTableRow(line);
      i += 2; // skip the header row and the separator row
      const rows: string[][] = [];
      while (i < lines.length) {
        const rowLine = (lines[i] ?? "").trim();
        if (!rowLine || !rowLine.includes("|")) break;
        rows.push(splitTableRow(rowLine));
        i += 1;
      }
      blocks.push({ type: "table", header, rows });
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
        /^[-*]\s+/.test(current) ||
        isTableStart(lines, i)
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

/** Renders **bold** and [label](href) inline markdown within a string. Link styling comes from .prose-site. */
function renderInline(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return <strong key={`${keyPrefix}-b${i}`}>{boldMatch[1]}</strong>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isInternal = href.startsWith("/");
      return isInternal ? (
        <Link key={`${keyPrefix}-l${i}`} href={href}>
          {label}
        </Link>
      ) : (
        <a key={`${keyPrefix}-l${i}`} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }
    return part || null;
  });
}

function PostContentRenderer({ blocks }: { blocks: ContentBlock[] }): JSX.Element {
  return (
    <div className="prose-site md:text-[1.0625rem] [&>:first-child]:!mt-0">
      {blocks.map((block, index) => {
        const key = `post-block-${index}`;

        if (block.type === "h2") {
          return (
            <h2 key={key} id={slugify(block.text)} className="scroll-mt-28">
              {block.text}
            </h2>
          );
        }

        if (block.type === "h3") {
          return <h3 key={key}>{block.text}</h3>;
        }

        if (block.type === "quote") {
          return (
            <blockquote key={key} className="border-l-[3px] border-accentB pl-6 text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-fg md:text-[1.375rem]">
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "callout") {
          return (
            <aside key={key} className="rounded-[1.25rem] bg-bg px-6 py-5">
              <p className="inline-flex items-center gap-2 text-[0.8125rem] font-bold text-fg">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accentB" />
                {block.label}
              </p>
              <p className="mt-2 text-fg/80">{renderInline(block.text, `${key}-callout`)}</p>
            </aside>
          );
        }

        if (block.type === "code") {
          return (
            <pre key={key} className="overflow-x-auto rounded-[1.25rem] bg-bg p-5 font-mono text-[0.875rem] leading-relaxed text-fg/80">
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={key} className="!mt-10 mb-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-bg">
                <PostContentImage src={block.src} alt={block.alt} />
              </div>
              {block.caption ? <figcaption className="mt-3 text-[0.8125rem] text-fg/60">{block.caption}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === "table") {
          return (
            <div key={key} className="overflow-x-auto rounded-[1.25rem] bg-bg px-5 py-2">
              <table className="w-full border-collapse text-[0.9375rem]">
                <thead>
                  <tr className="border-b border-fg/15">
                    {block.header.map((cell, cellIndex) => (
                      <th key={`${key}-th${cellIndex}`} className="whitespace-nowrap py-3 pr-6 text-left font-semibold text-fg">
                        {renderInline(cell, `${key}-th${cellIndex}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-tr${rowIndex}`} className="border-b border-fg/[0.08] last:border-b-0">
                      {row.map((cell, cellIndex) => (
                        <td key={`${key}-td${rowIndex}-${cellIndex}`} className="py-3 pr-6 align-top">
                          {renderInline(cell, `${key}-td${rowIndex}-${cellIndex}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-item${itemIndex}`}>{renderInline(item, `${key}-li${itemIndex}`)}</li>
              ))}
            </ListTag>
          );
        }

        return <p key={key}>{renderInline(block.text, key)}</p>;
      })}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) {
    // Unknown slug: keep it out of the index (ISR can serve the not-found render
    // with a 200, so noindex prevents a soft-404 from ever being indexed).
    return {
      ...buildMetadata({ title: "Blog Not Found", description: "Blog item not found.", path: `/blog/${slug}` }),
      robots: { index: false, follow: false }
    };
  }

  const base = buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    // Falls through to a generated 1200x630 OG card when the post has no cover.
    image: post.coverImage || undefined,
    ogEyebrow: post.category,
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    ogImage: post.ogImage,
    ogImageAlt: post.ogImageAlt || `${post.title} — ${post.category} article by Graphxify`,
    twitterTitle: post.twitterTitle,
    twitterDescription: post.twitterDescription,
    twitterImage: post.twitterImage,
    twitterCard: post.twitterCard,
    canonicalUrl: post.canonicalUrl,
    rss: true
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      authors: [post.authorName],
      section: post.category,
      tags: post.tags.length > 0 ? post.tags : undefined
    }
  };
}

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getPublishedBlogSummaries();
  // With dynamicParams = false, an empty result would 404 every post. The site
  // always has published posts, so treat empty as a build-time DB failure and
  // abort the build (keeping the previous deploy live) rather than ship 404s.
  if (posts.length === 0) {
    throw new Error("generateStaticParams: no published blog posts found at build time");
  }
  return posts.map((post) => ({ slug: post.slug }));
}

const SERVICE_DISPLAY: Record<string, { label: string; href: string; desc: string }> = {
  "brand-systems": { label: "Brand Systems", href: "/services/brand-systems", desc: "Logo suite, typography, colour palette, and brand guidelines as one system." },
  "web-design": { label: "Web Design", href: "/services/web-design", desc: "Visual design, UX strategy, and responsive UI for modern businesses." },
  "web-development": { label: "Web Development", href: "/services/web-development", desc: "Custom Next.js builds with full code ownership, engineered for performance." },
  "cms-architecture": { label: "CMS Architecture", href: "/services/cms-architecture", desc: "Structured content systems your team can manage without developer involvement." }
};
// CMS-controlled relatedService field wins; fall back to category-based mapping
const CATEGORY_FALLBACK: Record<string, string> = {
  "Web Design": "web-design",
  "Web Development": "web-development",
  "Branding": "brand-systems"
};

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedSource = await getPublishedBlogSummaries();
  const relatedPosts = selectRelatedBlogPosts(relatedSource, post.slug, post.category);
  const publishedAt = formatDate(post.publishedAt);
  const readingTime = post.readTime ?? estimateReadTime(post.content);
  const shareUrl = new URL(`/blog/${post.slug}`, siteConfig.url).toString();
  const authorInitials = post.authorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const blocks = parseContentBlocks(post.content);
  const toc = blocks.flatMap((block) => (block.type === "h2" ? [{ id: slugify(block.text), label: block.text }] : []));
  const serviceKey = post.relatedService ?? CATEGORY_FALLBACK[post.category] ?? null;
  const relatedService = serviceKey ? SERVICE_DISPLAY[serviceKey] : null;

  return (
    <>
      <ContentRefreshListener pathPrefixes={["/blog"]} />
      <JsonLd
        data={
          blogPostingJsonLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            // Real CMS dates only — never "now", which would fake freshness.
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            authorName: post.authorName,
            image: post.coverImage,
            keywords: post.tags,
            section: post.category,
            wordCount: post.content.trim().split(/\s+/).filter(Boolean).length
          })
        }
      />
      <JsonLd
        data={
          breadcrumbListJsonLd([
            { name: "Home", url: canonicalUrl("/") },
            { name: "Blog", url: canonicalUrl("/blog") },
            { name: post.title, url: canonicalUrl(`/blog/${post.slug}`) }
          ])
        }
      />

      <article>
        <header className="container pb-10 pt-8 md:pb-14 md:pt-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />
          <div className="mt-10 flex flex-col items-center text-center md:mt-14">
            <Badge dot="blue">{post.category}</Badge>
            <h1 className="t-h1 mt-6 max-w-[18ch] text-fg">{post.title}</h1>
            <p className="t-lead mt-6 max-w-[56ch]">{post.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
              <div className="flex items-center gap-3 text-left">
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fg text-[0.8125rem] font-extrabold text-white">
                  {authorInitials || "GT"}
                </span>
                <div>
                  <p className="text-[0.9375rem] font-bold text-fg">{post.authorName}</p>
                  <p className="t-small !text-[0.8125rem]">
                    {post.publishedAt ? <time dateTime={post.publishedAt}>{publishedAt}</time> : publishedAt}
                    <span aria-hidden="true" className="mx-1.5">
                      ·
                    </span>
                    {readingTime}
                  </p>
                </div>
              </div>
              <CopyLinkButton url={shareUrl} />
            </div>
          </div>
        </header>

        <div className="container">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-white sm:aspect-[16/9] md:rounded-[2.5rem]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              unoptimized={shouldBypassNextImageOptimization(post.coverImage)}
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1176px"
            />
          </div>
        </div>

        <div className="container mt-5 md:mt-6">
          <div className={toc.length >= 2 ? "grid items-start justify-center gap-6 lg:grid-cols-[15rem_minmax(0,47rem)]" : "mx-auto max-w-[47rem]"}>
            {toc.length >= 2 ? <OnThisPage items={toc} /> : null}

            <div className="min-w-0 rounded-[1.75rem] bg-white px-5 py-8 sm:px-8 md:rounded-[2.5rem] md:px-12 md:py-14 lg:px-14">
              <PostContentRenderer blocks={blocks} />

              <footer className="mt-14 max-w-[68ch] space-y-8 border-t border-fg/[0.08] pt-10">
                {post.tags.length > 0 ? (
                  <ul className="flex flex-wrap gap-2" aria-label="Tags">
                    {post.tags.map((tag) => (
                      <li key={`${post.id}-tag-${tag}`} className="rounded-full bg-bg px-3 py-1 text-[0.8125rem] font-semibold text-fg/72">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="flex items-start gap-4">
                  <span aria-hidden="true" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fg text-[0.875rem] font-extrabold text-white">
                    {authorInitials || "GT"}
                  </span>
                  <div>
                    <p className="font-bold text-fg">{post.authorName}</p>
                    <p className="t-small">{post.authorRole}</p>
                    <p className="t-body mt-3">{post.authorBio}</p>
                  </div>
                </div>

                {relatedService ? (
                  <Link
                    href={relatedService.href}
                    className="group flex items-center justify-between gap-6 rounded-[1.5rem] bg-bg p-6 transition-colors duration-300 hover:bg-fg/[0.06] md:p-7"
                  >
                    <span>
                      <span className="block text-[0.8125rem] font-bold text-fg/60">Related service</span>
                      <span className="t-h3 mt-2 block text-fg">{relatedService.label}</span>
                      <span className="t-body mt-2 block !text-[0.9375rem]">{relatedService.desc}</span>
                    </span>
                    <span aria-hidden="true" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                ) : null}
              </footer>
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="container section">
          <Reveal>
            <SectionIntro
              badge="Keep reading"
              title={
                <>
                  Related <span className="text-accentB">articles</span>
                </>
              }
              action={<ArrowLink href="/blog">All articles</ArrowLink>}
            />
          </Reveal>
          <ul className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {relatedPosts.map((item, index) => (
              <Reveal as="li" key={item.id} delay={index * 60}>
                <PostCard post={item} />
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      <CtaBlock className={relatedPosts.length > 0 ? undefined : "mt-20 md:mt-28"} />
    </>
  );
}
