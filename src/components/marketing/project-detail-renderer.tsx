import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Badge } from "@/components/ui/badge";
import {
  CountUpMetric,
  GridFeatureTransform,
  ProjectLightboxImage,
  ScrollScaleHero,
  StickySplitShowcase,
  StoryboardLane
} from "@/components/marketing/project-details-interactive";
import type { LayoutVariant, ProjectDetail } from "@/lib/project-details";
import { cn } from "@/lib/utils";

const shellClass = "rounded-[1.35rem] border border-border/18 bg-card/80 shadow-[0_14px_30px_rgba(13,13,15,0.08)]";
const dividerClass = "h-px w-full bg-border/24";

function pickImage(project: ProjectDetail, index: number) {
  return project.images[index % project.images.length];
}

function brief(text: string, maxWords = 12): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function BackToWorks(): JSX.Element {
  return (
    <Link
      href="/works"
      className="inline-flex text-[0.68rem] uppercase tracking-[0.17em] text-fg/58 transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      Back to works
    </Link>
  );
}

function ProjectMeta({ project }: { project: ProjectDetail }): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" className="border-border/24 bg-bg/70 text-[0.62rem] uppercase tracking-[0.14em] text-fg/62">
        {project.industry}
      </Badge>
      <Badge variant="secondary" className="border-border/24 bg-bg/70 text-[0.62rem] uppercase tracking-[0.14em] text-fg/62">
        {project.year}
      </Badge>
      <Badge variant="secondary" className="border-border/24 bg-bg/70 text-[0.62rem] uppercase tracking-[0.14em] text-fg/62">
        Template {project.layoutVariant}
      </Badge>
      <Badge variant="secondary" className="border-border/24 bg-bg/70 text-[0.62rem] uppercase tracking-[0.14em] text-fg/62">
        {project.roles[0]}
      </Badge>
    </div>
  );
}

function VariantHeader({
  project,
  label,
  titleClassName,
  subtitleClassName
}: {
  project: ProjectDetail;
  label: string;
  titleClassName?: string;
  subtitleClassName?: string;
}): JSX.Element {
  return (
    <header className="space-y-4">
      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-fg/56">{label}</p>
      <h1 className={cn("font-semibold leading-[0.96] text-[clamp(2.1rem,5vw,4.7rem)]", titleClassName)}>{project.title}</h1>
      <p className={cn("max-w-2xl text-sm text-fg/68 md:text-base", subtitleClassName)}>{brief(project.subtitle, 15)}</p>
      <ProjectMeta project={project} />
    </header>
  );
}

const ctaHoverFx: Record<LayoutVariant, string> = {
  A: "after:absolute after:bottom-2 after:left-4 after:right-4 after:h-px after:origin-left after:scale-x-0 after:bg-accent-gradient after:transition-transform after:duration-300 hover:after:scale-x-100",
  B: "hover:shadow-[0_0_0_1px_rgba(0,163,255,0.28),0_14px_26px_rgba(0,163,255,0.14)]",
  C: "hover:border-accentA/54",
  D: "before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-accent-gradient before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
  E: "hover:ring-1 hover:ring-accentA/40",
  F: "after:absolute after:inset-x-4 after:top-2 after:h-[2px] after:bg-accent-gradient after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
};

function ProjectCta({
  project,
  variant,
  className
}: {
  project: ProjectDetail;
  variant: LayoutVariant;
  className?: string;
}): JSX.Element {
  return (
    <section className={cn(shellClass, "space-y-4 p-6 md:p-7", className)}>
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-fg/56">Start a Project</p>
      <p className="max-w-2xl text-sm text-fg/68 md:text-base">{brief(project.overview, 17)}</p>
      <div className="flex flex-wrap gap-3 pt-1">
        {project.links.map((link, index) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className={cn(
              "group relative inline-flex items-center gap-2 overflow-hidden rounded-[0.9rem] border px-5 py-3 text-sm font-medium transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/42 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              index === 0
                ? "border-fg bg-fg text-bg hover:bg-fg/90"
                : "border-border/24 bg-transparent text-fg hover:border-fg/46 hover:bg-bg/56",
              ctaHoverFx[variant]
            )}
          >
            <span>{link.label}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function TemplateA({ project }: { project: ProjectDetail }): JSX.Element {
  return (
    <section className="space-y-10 md:space-y-12">
      <BackToWorks />

      <RevealStagger className="space-y-8" effect="up">
        <RevealItem effect="zoom">
          <ScrollScaleHero image={pickImage(project, 0)}>
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-black/34" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/68">Template A · Cinematic Hero</p>
              <h1 className="mt-2 max-w-4xl text-[clamp(2.2rem,5.2vw,4.9rem)] font-semibold leading-[0.95] text-ivory">{project.title}</h1>
              <span aria-hidden className="mt-4 block h-[2px] w-44 bg-accent-gradient" />
              <p className="mt-3 max-w-2xl text-sm text-ivory/78 md:text-base">{brief(project.subtitle, 15)}</p>
              <div className="mt-4">
                <ProjectMeta project={project} />
              </div>
            </div>
          </ScrollScaleHero>
        </RevealItem>

        <RevealItem effect="up">
          <div className="relative z-10 -mt-12 grid gap-3 px-2 sm:grid-cols-2 lg:grid-cols-4 md:px-6">
            {project.metrics.map((metric) => (
              <article key={metric.label} className={cn(shellClass, "p-4")}> 
                <p className="text-[0.6rem] uppercase tracking-[0.16em] text-fg/56">{metric.label}</p>
                <CountUpMetric
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  className="mt-2 block text-3xl font-semibold leading-none"
                />
                <p className="mt-2 text-xs text-fg/62">{brief(metric.note, 7)}</p>
              </article>
            ))}
          </div>
        </RevealItem>

        <RevealItem effect="up">
          <div className="space-y-4">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-fg/56">Film Strip</p>
            <div className="overflow-x-auto pb-2 scroll-smooth">
              <div className="flex min-w-max snap-x snap-mandatory gap-4 pr-4">
                {project.images.slice(1, 7).map((image, index) => (
                  <div key={`${image.src}-${index}`} className="w-[17rem] snap-start space-y-2 md:w-[18.5rem]">
                    <ProjectLightboxImage
                      image={image}
                      className={cn(index % 3 === 0 ? "aspect-[4/5]" : "aspect-[5/4]")}
                      captionMode="overlay"
                      hideCaption
                      sizes="(max-width: 1024px) 70vw, 320px"
                    />
                    <p className="link-sweep w-fit text-[0.58rem] uppercase tracking-[0.14em] text-fg/62">{brief(image.caption, 5)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealItem>

        <RevealItem effect="up">
          <ProjectCta project={project} variant="A" className="max-w-3xl" />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

function TemplateB({ project }: { project: ProjectDetail }): JSX.Element {
  return (
    <section className="space-y-10 md:space-y-12">
      <BackToWorks />

      <RevealStagger className="space-y-8" effect="up">
        <RevealItem effect="up">
          <div className="grid items-end gap-8 lg:grid-cols-[0.42fr_0.58fr]">
            <div className="space-y-5">
              <VariantHeader
                project={project}
                label="Template B · Editorial Collage"
                titleClassName="text-[clamp(2.4rem,5.6vw,5rem)]"
                subtitleClassName="text-base"
              />
              <blockquote className="max-w-md border-l border-border/28 pl-4 text-sm uppercase tracking-[0.12em] text-fg/62">
                “{brief(project.testimonial.quote, 11)}”
              </blockquote>
            </div>

            <div className="relative lg:pl-10">
              <div className="lg:-translate-y-7">
                <ProjectLightboxImage
                  image={pickImage(project, 0)}
                  className="aspect-[4/5]"
                  captionMode="overlay"
                  wipeReveal
                  accentStamp
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  priority
                />
              </div>
            </div>
          </div>
        </RevealItem>

        <RevealItem effect="up">
          <div className="relative grid gap-4 md:grid-cols-12">
            <div className="md:col-span-7 md:translate-y-5">
              <ProjectLightboxImage
                image={pickImage(project, 1)}
                className="aspect-[16/10]"
                captionMode="side"
                wipeReveal
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="md:col-span-5 md:-translate-y-7">
              <ProjectLightboxImage
                image={pickImage(project, 2)}
                className="aspect-[4/5]"
                captionMode="below"
                wipeReveal
                accentStamp
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            <div className="md:col-span-4 md:-mt-8">
              <ProjectLightboxImage
                image={pickImage(project, 3)}
                className="aspect-square"
                captionMode="below"
                wipeReveal
                sizes="(max-width: 1024px) 100vw, 34vw"
              />
            </div>
            <div className="md:col-span-8 md:translate-y-2">
              <ProjectLightboxImage
                image={pickImage(project, 4)}
                className="aspect-[16/9]"
                captionMode="side"
                wipeReveal
                accentStamp
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          </div>
        </RevealItem>

        <RevealItem effect="up">
          <ProjectCta project={project} variant="B" className="ml-auto max-w-3xl" />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

function TemplateC({ project }: { project: ProjectDetail }): JSX.Element {
  return (
    <section className="space-y-10 md:space-y-12">
      <BackToWorks />

      <RevealStagger className="space-y-7" effect="up">
        <RevealItem effect="up">
          <StickySplitShowcase project={project} />
        </RevealItem>

        <RevealItem effect="up">
          <ProjectCta project={project} variant="C" className="max-w-3xl" />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

function TemplateD({ project }: { project: ProjectDetail }): JSX.Element {
  return (
    <section className="space-y-10 md:space-y-12">
      <BackToWorks />

      <RevealStagger className="space-y-8" effect="up">
        <RevealItem effect="up">
          <div className="space-y-4">
            <VariantHeader project={project} label="Template D · Museum Pacing" />
            <ProjectLightboxImage
              image={pickImage(project, 0)}
              className="aspect-[19/9]"
              parallax
              accentHairline
              priority
              sizes="100vw"
            />
          </div>
        </RevealItem>

        <RevealItem effect="zoom">
          <ProjectLightboxImage image={pickImage(project, 1)} className="aspect-[16/8]" parallax sizes="100vw" />
        </RevealItem>

        <RevealItem effect="up">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-fg/56">Moment · Brand Contrast</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <ProjectLightboxImage image={pickImage(project, 2)} className="aspect-[4/3]" sizes="(max-width: 1024px) 100vw, 50vw" />
            <ProjectLightboxImage
              image={pickImage(project, 3)}
              className="aspect-[4/3]"
              accentHairline
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </RevealItem>

        <RevealItem effect="up">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((metric) => (
              <article key={metric.label} className={cn(shellClass, "p-4")}>
                <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fg/56">{metric.label}</p>
                <CountUpMetric
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  className="mt-2 block text-2xl font-semibold leading-none"
                />
                <p className="mt-2 text-xs text-fg/62">{brief(metric.note, 7)}</p>
              </article>
            ))}
          </div>
        </RevealItem>

        <RevealItem effect="zoom">
          <ProjectLightboxImage image={pickImage(project, 4)} className="aspect-[16/8]" parallax sizes="100vw" />
        </RevealItem>

        <RevealItem effect="up">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-fg/56">Moment · Detail Rhythm</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <ProjectLightboxImage image={pickImage(project, 5)} className="aspect-[4/3]" sizes="(max-width: 768px) 100vw, 33vw" />
            <ProjectLightboxImage
              image={pickImage(project, 6)}
              className="aspect-[4/3]"
              accentHairline
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <ProjectLightboxImage image={pickImage(project, 7)} className="aspect-[4/3]" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        </RevealItem>

        <RevealItem effect="zoom">
          <ProjectLightboxImage image={pickImage(project, 2)} className="aspect-[18/8]" parallax accentHairline sizes="100vw" />
        </RevealItem>

        <RevealItem effect="up">
          <ProjectCta project={project} variant="D" className="max-w-3xl" />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

function TemplateE({ project }: { project: ProjectDetail }): JSX.Element {
  return (
    <section className="space-y-10 md:space-y-12">
      <BackToWorks />

      <RevealStagger className="space-y-8" effect="up">
        <RevealItem effect="up">
          <VariantHeader project={project} label="Template E · Grid to Feature" />
        </RevealItem>

        <RevealItem effect="up">
          <GridFeatureTransform project={project} />
        </RevealItem>

        <RevealItem effect="up">
          <ProjectCta project={project} variant="E" className="max-w-3xl" />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

function TemplateF({ project }: { project: ProjectDetail }): JSX.Element {
  return (
    <section className="space-y-10 md:space-y-12">
      <BackToWorks />

      <RevealStagger className="space-y-8" effect="up">
        <RevealItem effect="up">
          <VariantHeader project={project} label="Template F · Storyboard Lane" />
        </RevealItem>

        <RevealItem effect="up">
          <StoryboardLane project={project} />
        </RevealItem>

        <RevealItem effect="up">
          <ProjectCta project={project} variant="F" className="ml-auto max-w-3xl" />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

function RelatedProjects({ projects }: { projects: ProjectDetail[] }): JSX.Element {
  return (
    <section className="space-y-6">
      <div className={dividerClass} />
      <header className="space-y-2">
        <p className="text-[0.62rem] uppercase tracking-[0.19em] text-fg/56">Related Projects</p>
        <h2 className="text-2xl font-semibold md:text-3xl">Continue Exploring</h2>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/works/${project.slug}`}
            className="group rounded-[1.2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/42 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <article className={cn(shellClass, "h-full overflow-hidden p-0")}> 
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-[0.6rem] uppercase tracking-[0.16em] text-fg/56">Template {project.layoutVariant}</p>
                <h3 className="mt-2 text-lg font-semibold leading-tight">{project.title}</h3>
                <p className="mt-2 text-sm text-fg/66">{brief(project.excerpt, 10)}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProjectDetailRenderer({
  project,
  relatedProjects
}: {
  project: ProjectDetail;
  relatedProjects: ProjectDetail[];
}): JSX.Element {
  const template = (() => {
    if (project.layoutVariant === "A") return <TemplateA project={project} />;
    if (project.layoutVariant === "B") return <TemplateB project={project} />;
    if (project.layoutVariant === "C") return <TemplateC project={project} />;
    if (project.layoutVariant === "D") return <TemplateD project={project} />;
    if (project.layoutVariant === "E") return <TemplateE project={project} />;
    return <TemplateF project={project} />;
  })();

  return (
    <article className="container py-16 md:py-20">
      <div className="space-y-16 md:space-y-20">
        {template}
        <RelatedProjects projects={relatedProjects} />
      </div>
    </article>
  );
}
