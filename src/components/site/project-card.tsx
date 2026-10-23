import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import { getProjectArt, renderAlt } from "@/lib/project-art";
import { cn } from "@/lib/utils";

/** Compact project card: the cover on the project's stage colour, caption below in a white card. */
export function ProjectCard({
  href,
  title,
  industry,
  image,
  slug,
  summary,
  tags,
  priority = false,
  sizes = "(max-width: 767px) 100vw, 50vw",
  aspect = "aspect-[4/3]",
  className,
  headingLevel: Heading = "h3"
}: {
  href: string;
  title: string;
  industry?: string;
  image: string;
  slug?: string;
  summary?: string;
  tags?: readonly string[];
  priority?: boolean;
  sizes?: string;
  aspect?: string;
  className?: string;
  headingLevel?: "h2" | "h3";
}): JSX.Element {
  const art = slug ? getProjectArt(slug) : null;
  const stage = art?.stage ?? "#171717";
  // Projects with a live site lead with the real-site device mockup.
  const src = art?.mockups?.[0] ?? image;
  return (
    <Link href={href} className={cn("group flex h-full flex-col rounded-[2rem] bg-white p-3 transition-shadow duration-300 hover:shadow-lift", className)}>
      <div className={cn("relative overflow-hidden rounded-[1.5rem]", aspect)} style={{ backgroundColor: stage }}>
        <Image
          src={src}
          alt={renderAlt(title, image)}
          fill
          priority={priority}
          unoptimized={shouldBypassNextImageOptimization(src)}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 items-start justify-between gap-5 px-3 pb-3 pt-5">
        <div className="min-w-0">
          <Heading className="t-h3 text-fg">{title}</Heading>
          {industry ? <p className="t-small mt-1">{industry}</p> : null}
          {summary ? <p className="t-body mt-3 max-w-[46ch] !text-[0.9375rem]">{summary}</p> : null}
          {tags?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Services">
              {tags.map((tag) => (
                <li key={tag} className="rounded-full bg-bg px-3 py-1 text-[0.8125rem] font-semibold text-fg/72">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <span aria-hidden="true" className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
