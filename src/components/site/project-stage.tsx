import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import { resolveProjectRenders } from "@/lib/project-art";
import { cn } from "@/lib/utils";

export type StageProject = { slug: string; href: string; title: string; industry: string; images: string[]; tags?: readonly string[]; summary?: string };

/**
 * A project on its own brand-colour stage: the lead render large, two supporting
 * renders layered beside it. `flip` mirrors the composition so a list of stages alternates.
 */
export function ProjectStage({ project, flip = false, priority = false, headingLevel: Heading = "h3" }: { project: StageProject; flip?: boolean; priority?: boolean; headingLevel?: "h2" | "h3" }): JSX.Element {
  const { art, hero, supports } = resolveProjectRenders(project.slug, project.images);
  const light = art.tone === "light";
  const img = (src: string, sizes: string, eager = false) => (
    <Image
      src={src}
      alt=""
      fill
      priority={eager}
      sizes={sizes}
      unoptimized={shouldBypassNextImageOptimization(src)}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
    />
  );

  return (
    <Link
      href={project.href}
      className="group block overflow-hidden rounded-[2rem] p-5 transition-shadow duration-300 hover:shadow-lift md:rounded-[2.5rem] md:p-8 lg:p-10"
      style={{ backgroundColor: art.stage }}
    >
      <div className={cn("grid gap-4 md:grid-cols-12 md:gap-5", flip && "md:[direction:rtl]")}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] md:col-span-8 md:aspect-[16/11] md:[direction:ltr]">{img(hero, "(max-width: 767px) 100vw, 60vw", priority)}</div>
        <div className="grid grid-cols-2 gap-4 md:col-span-4 md:grid-cols-1 md:gap-5 md:[direction:ltr]">
          {supports.slice(0, 2).map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-[1.25rem] md:aspect-auto md:h-full">
              {img(src, "(max-width: 767px) 50vw, 25vw")}
            </div>
          ))}
        </div>
      </div>

      <div className={cn("mt-7 flex flex-col gap-5 md:mt-9 md:flex-row md:items-end md:justify-between", light ? "text-white" : "text-fg")}>
        <div>
          <p className={cn("text-[0.875rem] font-semibold", light ? "text-white/80" : "text-fg/80")}>{project.industry}</p>
          <Heading className="mt-1 text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">{project.title}</Heading>
          {project.summary ? <p className={cn("mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed", light ? "text-white/72" : "text-fg/72")}>{project.summary}</p> : null}
          {project.tags?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Services">
              {project.tags.map((tag) => (
                <li key={tag} className={cn("rounded-full px-3 py-1 text-[0.8125rem] font-semibold", light ? "bg-white/12 text-white" : "bg-black/10 text-fg")}>
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full px-5 text-[0.9375rem] font-semibold transition-transform duration-300 ease-out group-hover:-translate-y-0.5 md:self-auto",
            light ? "bg-white text-fg" : "bg-fg text-white"
          )}
        >
          View case study
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
