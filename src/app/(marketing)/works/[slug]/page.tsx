import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectLightboxImage } from "@/components/marketing/project-details-interactive";
import { OtherProjectsSlider } from "@/components/marketing/other-projects-slider";
import { getPublishedWorks } from "@/db/queries/works";
import {
  getProjectBySlug,
  graphxifyProjects,
  type LayoutVariant,
  type ProjectDetail,
  type ProjectImage
} from "@/lib/project-details";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Params = { slug: string };
type AccentMode = "none" | "corner" | "hairline" | "ring";
type CmsWorkLike = {
  id: string;
  title: string;
  slug: string;
  year: number;
  role: string;
  services: string[] | null;
  subtitle?: string | null;
  layout_variant?: string | null;
  excerpt: string;
  content?: string | null;
  cover_image_url: string | null;
  gallery_images?: string[] | null;
};

const galleryNotes: Record<LayoutVariant, string> = {
  A: "Hero dominant rhythm with intentional 1 / 2 / 1 / 2 pacing.",
  B: "Asymmetrical editorial composition with portrait, stack, spread, and squares.",
  C: "Split showcase sequence: two-up, centered spread, then a clean three-up finish.",
  D: "Organic masonry collage with tight packing and mixed image orientations.",
  E: "Alternating cadence from full-width to triple row and balanced two-up close.",
  F: "Framed sequence with centered lead, offset pair, spread, and balanced close."
};

const layoutCycle: LayoutVariant[] = ["A", "B", "C", "D", "E", "F"];
const galleryFallbackPool = ["/assets/work-1.svg", "/assets/work-2.svg", "/assets/work-3.svg"] as const;
const REQUIRED_GALLERY_IMAGES = 6;

function normalizeImageSrc(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => normalizeImageSrc(value))
        .filter((value): value is string => Boolean(value))
    )
  );
}

function getFallbackGallerySources(coverImage: string): string[] {
  const filtered = galleryFallbackPool.filter((src) => src !== coverImage);
  return filtered.length > 0 ? filtered : [...galleryFallbackPool];
}

function ensureExactGallerySources(primary: string[], fallback: string[], coverImage: string): string[] {
  const candidateSources = uniqueStrings([...primary, ...fallback, ...getFallbackGallerySources(coverImage)]).filter(
    (src) => src !== coverImage
  );
  const usableSources = candidateSources.length > 0 ? candidateSources : getFallbackGallerySources(coverImage);

  return Array.from({ length: REQUIRED_GALLERY_IMAGES }, (_, index) => usableSources[index % usableSources.length]);
}

function ensureExactGalleryImages(
  images: ProjectImage[],
  title: string,
  fallbackCaption: string,
  coverImage: string
): ProjectImage[] {
  const baseImages =
    images.length > 0
      ? images
      : [
          {
            src: coverImage,
            alt: `${title} visual 1`,
            caption: fallbackCaption
          }
        ];

  return Array.from({ length: REQUIRED_GALLERY_IMAGES }, (_, index) => {
    const source = baseImages[index % baseImages.length];
    return {
      src: source.src,
      alt: `${title} visual ${index + 1}`,
      caption: source.caption || fallbackCaption
    };
  });
}

function variantForSlug(slug: string, index = 0): LayoutVariant {
  let hash = index;
  for (let charIndex = 0; charIndex < slug.length; charIndex += 1) {
    hash = (hash * 31 + slug.charCodeAt(charIndex)) >>> 0;
  }
  return layoutCycle[hash % layoutCycle.length];
}

function seedFromSlug(slug: string): number {
  let hash = 17;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 33 + slug.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function rotateItems<T>(items: T[], seed: number): T[] {
  if (items.length <= 1) {
    return items;
  }
  const start = seed % items.length;
  if (start === 0) {
    return items;
  }
  return [...items.slice(start), ...items.slice(0, start)];
}

function normalizeLayoutVariant(value: string | null | undefined): LayoutVariant | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toUpperCase();
  if (normalized === "A" || normalized === "B" || normalized === "C" || normalized === "D" || normalized === "E" || normalized === "F") {
    return normalized;
  }
  return null;
}

function buildUniqueLayoutVariantMap(
  entries: Array<{ slug: string; preferred: LayoutVariant | null }>
): Map<string, LayoutVariant> {
  const bySlug = new Map<string, { slug: string; preferred: LayoutVariant | null }>();
  entries.forEach((entry) => {
    if (!bySlug.has(entry.slug)) {
      bySlug.set(entry.slug, entry);
    }
  });

  const ordered = Array.from(bySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug));
  const result = new Map<string, LayoutVariant>();
  const used = new Set<LayoutVariant>();
  let cycleCursor = 0;

  ordered.forEach((entry) => {
    if (used.size === layoutCycle.length) {
      used.clear();
    }

    if (entry.preferred && !used.has(entry.preferred)) {
      result.set(entry.slug, entry.preferred);
      used.add(entry.preferred);
      return;
    }

    let selected: LayoutVariant | null = null;
    for (let offset = 0; offset < layoutCycle.length; offset += 1) {
      const candidate = layoutCycle[(cycleCursor + offset) % layoutCycle.length];
      if (!used.has(candidate)) {
        selected = candidate;
        cycleCursor = (layoutCycle.indexOf(candidate) + 1) % layoutCycle.length;
        break;
      }
    }

    if (!selected) {
      selected = layoutCycle[cycleCursor % layoutCycle.length];
      cycleCursor = (cycleCursor + 1) % layoutCycle.length;
    }

    result.set(entry.slug, selected);
    used.add(selected);
  });

  return result;
}

async function getResolvedLayoutVariantMap(): Promise<Map<string, LayoutVariant>> {
  const fallbackBySlug = new Map(graphxifyProjects.map((project) => [project.slug, project]));

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      return buildUniqueLayoutVariantMap(
        cmsWorks.map((work) => ({
          slug: work.slug,
          preferred:
            normalizeLayoutVariant((work as CmsWorkLike).layout_variant) ??
            fallbackBySlug.get(work.slug)?.layoutVariant ??
            null
        }))
      );
    }
  } catch {
    // Use local fallback below.
  }

  return buildUniqueLayoutVariantMap(
    graphxifyProjects.map((project) => ({
      slug: project.slug,
      preferred: project.layoutVariant
    }))
  );
}

function withLayoutVariant(project: ProjectDetail, layoutVariant: LayoutVariant | null | undefined): ProjectDetail {
  if (!layoutVariant || project.layoutVariant === layoutVariant) {
    return project;
  }

  return {
    ...project,
    layoutVariant
  };
}

function mapCmsWorkToProject(
  work: CmsWorkLike,
  fallbackProject: ProjectDetail | null,
  index = 0,
  forcedLayoutVariant?: LayoutVariant
): ProjectDetail {
  const coverImage = normalizeImageSrc(work.cover_image_url) ?? fallbackProject?.coverImage ?? "/assets/work-1.svg";
  const cmsGallerySources = uniqueStrings(Array.isArray(work.gallery_images) ? work.gallery_images : []).filter(
    (src) => src !== coverImage
  );
  const fallbackSources = uniqueStrings((fallbackProject?.images ?? []).map((image) => image.src)).filter((src) => src !== coverImage);
  const gallerySources = ensureExactGallerySources(cmsGallerySources, fallbackSources, coverImage);

  const images: ProjectImage[] =
    gallerySources.length > 0
      ? gallerySources.map((src, imageIndex) => ({
          src,
          alt: `${work.title} visual ${imageIndex + 1}`,
          caption: work.excerpt
        }))
      : [];

  const excerpt = work.excerpt?.trim() || fallbackProject?.excerpt || work.title;
  const content = work.content?.trim() || fallbackProject?.content || excerpt;
  const role = work.role?.trim();
  const services = Array.isArray(work.services) && work.services.length > 0 ? work.services : fallbackProject?.services ?? [];
  const subtitle = work.subtitle?.trim() || fallbackProject?.subtitle || excerpt;
  const layoutVariant =
    forcedLayoutVariant ??
    normalizeLayoutVariant(work.layout_variant) ??
    fallbackProject?.layoutVariant ??
    variantForSlug(work.slug, index);

  return {
    id: work.id,
    slug: work.slug,
    layoutVariant,
    title: work.title,
    subtitle,
    year: Number.isFinite(work.year) ? work.year : fallbackProject?.year ?? new Date().getFullYear(),
    industry: fallbackProject?.industry ?? "Digital Product",
    services,
    tools: fallbackProject?.tools ?? [],
    roles: role ? [role] : fallbackProject?.roles ?? ["Delivery Partner"],
    overview: fallbackProject?.overview ?? content,
    excerpt,
    content,
    coverImage,
    timelineSteps: fallbackProject?.timelineSteps ?? [],
    metrics: fallbackProject?.metrics ?? [],
    images,
    testimonial: fallbackProject?.testimonial ?? {
      quote: "Project details and outcomes can be managed from the Graphxify CMS.",
      name: "Graphxify Team",
      role: "Creative Partner",
      company: "Graphxify"
    },
    links: fallbackProject?.links ?? [
      { label: "Start a project", href: "/contact" },
      { label: "View all works", href: "/works" }
    ],
    chapters: fallbackProject?.chapters ?? [],
    scope: fallbackProject?.scope ?? [],
    tabPanels: fallbackProject?.tabPanels ?? {
      story: {
        heading: "Project Story",
        body: excerpt,
        points: services.slice(0, 3),
        images: images.map((image) => image.src).slice(0, 3)
      },
      designSystem: {
        heading: "Design System",
        body: excerpt,
        points: services.slice(0, 3),
        images: images.map((image) => image.src).slice(0, 3)
      },
      results: {
        heading: "Results",
        body: excerpt,
        points: services.slice(0, 3),
        images: images.map((image) => image.src).slice(0, 3)
      }
    },
    proof: fallbackProject?.proof ?? {
      problem: excerpt,
      solution: content,
      outcome: "Published via Graphxify CMS."
    }
  };
}

async function getResolvedProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const fallbackProject = getProjectBySlug(slug);
  const layoutVariantMap = await getResolvedLayoutVariantMap();
  const forcedLayoutVariant = layoutVariantMap.get(slug);

  try {
    const cmsWorks = await getPublishedWorks();
    const cmsWork = cmsWorks.find((work) => work.slug === slug);
    if (!cmsWork) {
      return fallbackProject ? withLayoutVariant(fallbackProject, forcedLayoutVariant) : null;
    }
    return mapCmsWorkToProject(cmsWork as CmsWorkLike, fallbackProject, 0, forcedLayoutVariant);
  } catch {
    return fallbackProject ? withLayoutVariant(fallbackProject, forcedLayoutVariant) : null;
  }
}

async function getResolvedRelatedProjects(currentSlug: string): Promise<ProjectDetail[]> {
  const layoutVariantMap = await getResolvedLayoutVariantMap();

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      const related = cmsWorks
        .filter((work) => work.slug !== currentSlug)
        .map((work, index) =>
          mapCmsWorkToProject(
            work as CmsWorkLike,
            getProjectBySlug(work.slug),
            index,
            layoutVariantMap.get(work.slug)
          )
        )
        .slice(0, 5);

      if (related.length > 0) {
        return related;
      }
    }
  } catch {
    // Local fallback below.
  }

  return graphxifyProjects
    .filter((project) => project.slug !== currentSlug)
    .slice(0, 5)
    .map((project) => withLayoutVariant(project, layoutVariantMap.get(project.slug)));
}

export async function generateStaticParams(): Promise<Params[]> {
  const fallbackSlugs = graphxifyProjects.map((project) => project.slug);

  try {
    const cmsWorks = await getPublishedWorks();
    const slugs = new Set([...fallbackSlugs, ...cmsWorks.map((work) => work.slug)]);
    return Array.from(slugs).map((slug) => ({ slug }));
  } catch {
    return fallbackSlugs.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = await getResolvedProjectBySlug(params.slug);
  if (!project) {
    return buildMetadata({
      title: "Project Not Found",
      description: "Project item not found.",
      path: `/works/${params.slug}`
    });
  }

  return buildMetadata({
    title: project.title,
    description: project.excerpt,
    path: `/works/${project.slug}`,
    image: project.coverImage
  });
}

function getGalleryImages(project: ProjectDetail): ProjectImage[] {
  return ensureExactGalleryImages(project.images, project.title, project.excerpt, project.coverImage);
}

function GalleryFrame({
  image,
  className,
  accent = "none"
}: {
  image: ProjectImage;
  className?: string;
  accent?: AccentMode;
}): JSX.Element {
  const accentStamp = accent === "corner";
  const accentHairline = accent === "hairline";
  const accentFocusRing = accent === "ring";

  return (
    <ProjectLightboxImage
      image={image}
      className={cn("h-full w-full box-border", className)}
      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
      hideCaption
      wipeReveal
      accentStamp={accentStamp}
      accentHairline={accentHairline}
      accentFocusRing={accentFocusRing}
    />
  );
}

type StrictGridTileSpec = {
  tileClassName: string;
  rowSpan: number;
  accent?: AccentMode;
};

const STRICT_GRID_ROW_UNIT_PX = 12;
const STRICT_GRID_GAP_PX = 12;

const strictGridPatterns: Record<LayoutVariant, StrictGridTileSpec[]> = {
  A: [
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-12", rowSpan: 24, accent: "hairline" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 16 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 16 },
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-12", rowSpan: 22, accent: "ring" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 14 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 14 }
  ],
  B: [
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-5", rowSpan: 32, accent: "corner" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-7", rowSpan: 16 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-7", rowSpan: 16, accent: "corner" },
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-12", rowSpan: 18 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 14 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 14, accent: "corner" }
  ],
  C: [
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 18 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 18 },
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-12", rowSpan: 16, accent: "ring" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-4", rowSpan: 14 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-4", rowSpan: 14 },
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-4", rowSpan: 14 }
  ],
  D: [
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-5", rowSpan: 20, accent: "hairline" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-3", rowSpan: 20 },
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-4", rowSpan: 20, accent: "corner" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-4 xl:col-span-7", rowSpan: 15 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-5", rowSpan: 15, accent: "hairline" },
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-12", rowSpan: 16 }
  ],
  E: [
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-12", rowSpan: 20 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-4", rowSpan: 16 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-4", rowSpan: 16 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-4", rowSpan: 16, accent: "ring" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 16 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 16 }
  ],
  F: [
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-2 lg:col-start-3 xl:col-span-6 xl:col-start-4", rowSpan: 20, accent: "ring" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 lg:col-start-1 xl:col-span-3 xl:col-start-1", rowSpan: 20 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-2 lg:col-start-5 xl:col-span-3 xl:col-start-10", rowSpan: 20, accent: "corner" },
    { tileClassName: "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-12", rowSpan: 18, accent: "hairline" },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 16 },
    { tileClassName: "col-span-1 sm:col-span-1 lg:col-span-3 xl:col-span-6", rowSpan: 16 }
  ]
};

function StrictGridGallery({
  images,
  seed,
  variant
}: {
  images: ProjectImage[];
  seed: number;
  variant: LayoutVariant;
}): JSX.Element {
  const orderedImages = rotateItems(images, seed);
  const pattern = strictGridPatterns[variant];

  return (
    <div
      className="grid grid-cols-1 gap-[12px] [grid-auto-flow:dense] sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12"
      style={{ gridAutoRows: `${STRICT_GRID_ROW_UNIT_PX}px`, gap: `${STRICT_GRID_GAP_PX}px` }}
    >
      {orderedImages.map((image, index) => {
        const tile = pattern[index % pattern.length];
        return (
          <div
            key={`${variant}-${image.src}-${index}`}
            className={cn("min-h-0 box-border leading-none", tile.tileClassName)}
            style={{
              gridRow: `span ${tile.rowSpan} / span ${tile.rowSpan}`,
              minHeight: `${tile.rowSpan * STRICT_GRID_ROW_UNIT_PX}px`
            }}
          >
            <GalleryFrame image={image} className="h-full w-full" accent={tile.accent ?? "none"} />
          </div>
        );
      })}
    </div>
  );
}

function GalleryA({ images, seed }: { images: ProjectImage[]; seed: number }): JSX.Element {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-[2px] w-20 bg-accent-gradient" />
        <p className="text-[0.6rem] uppercase tracking-[0.18em] text-fg/56">Hero Dominant · 1 / 2 / 1 / 2</p>
      </div>
      <StrictGridGallery images={images} seed={seed} variant="A" />
    </div>
  );
}

function GalleryB({ images, seed }: { images: ProjectImage[]; seed: number }): JSX.Element {
  return (
    <div className="space-y-4">
      <p className="text-[0.6rem] uppercase tracking-[0.18em] text-fg/56">Asymmetrical Editorial</p>
      <StrictGridGallery images={images} seed={seed} variant="B" />
    </div>
  );
}

function GalleryC({ images, seed }: { images: ProjectImage[]; seed: number }): JSX.Element {
  return (
    <div className="space-y-4">
      <div className="relative">
        <span aria-hidden className="absolute -left-3 top-0 h-full w-px bg-border/22 md:-left-5" />
        <span aria-hidden className="absolute -left-3 top-8 h-24 w-px bg-accent-gradient md:-left-5" />
        <p className="text-[0.6rem] uppercase tracking-[0.18em] text-fg/56">Split Grid Showcase</p>
      </div>
      <StrictGridGallery images={images} seed={seed} variant="C" />
    </div>
  );
}

function GalleryD({ images, seed }: { images: ProjectImage[]; seed: number }): JSX.Element {
  return (
    <div className="space-y-4">
      <p className="text-[0.6rem] uppercase tracking-[0.18em] text-fg/56">Masonry / Collage</p>
      <StrictGridGallery images={images} seed={seed} variant="D" />
    </div>
  );
}

function GalleryE({ images, seed }: { images: ProjectImage[]; seed: number }): JSX.Element {
  const ordered = rotateItems(images, seed);
  const activeIndicatorIndex = seed % REQUIRED_GALLERY_IMAGES;

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-bg/58 px-3 py-2">
        {ordered.map((_, index) => (
          <span
            key={`dot-${index}`}
            aria-hidden
            className={cn("h-1.5 w-1.5 rounded-full", index === activeIndicatorIndex ? "bg-accent-gradient" : "bg-border/35")}
          />
        ))}
        <span className="pl-2 text-[0.58rem] uppercase tracking-[0.14em] text-fg/58">Alternating Rhythm</span>
      </div>
      <StrictGridGallery images={ordered} seed={0} variant="E" />
    </div>
  );
}

function GalleryF({ images, seed }: { images: ProjectImage[]; seed: number }): JSX.Element {
  return (
    <div className="space-y-4">
      <p className="text-[0.6rem] uppercase tracking-[0.18em] text-fg/56">Framed Showcase</p>
      <StrictGridGallery images={images} seed={seed} variant="F" />
    </div>
  );
}

function ProjectVisualGallery({ project }: { project: ProjectDetail }): JSX.Element {
  const images = getGalleryImages(project);
  const seed = seedFromSlug(project.slug);

  if (project.layoutVariant === "A") return <GalleryA images={images} seed={seed} />;
  if (project.layoutVariant === "B") return <GalleryB images={images} seed={seed} />;
  if (project.layoutVariant === "C") return <GalleryC images={images} seed={seed} />;
  if (project.layoutVariant === "D") return <GalleryD images={images} seed={seed} />;
  if (project.layoutVariant === "E") return <GalleryE images={images} seed={seed} />;
  return <GalleryF images={images} seed={seed} />;
}

function ProjectCtaSection({ project }: { project: ProjectDetail }): JSX.Element {
  return (
    <section className="rounded-[1.2rem] border border-border/18 bg-bg/62 p-6 shadow-[0_14px_30px_rgba(13,13,15,0.08)] md:p-8">
      <p className="text-[0.62rem] uppercase tracking-[0.18em] text-fg/56">Call To Action</p>
      <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Let’s Build Your Next Project</h2>
      <p className="mt-3 max-w-2xl text-sm text-fg/66 md:text-base">{project.excerpt}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center rounded-[0.9rem] border border-accentA/45 bg-accent-gradient px-5 py-3 text-sm font-medium text-ivory shadow-[0_10px_22px_rgba(0,128,255,0.2)] transition-transform duration-200 hover:-translate-y-[1px]"
        >
          Start A Project
        </Link>
        <Link
          href="/works"
          className="inline-flex items-center rounded-[0.9rem] border border-border/24 bg-card/72 px-5 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg/40 hover:bg-bg/58"
        >
          View All Works
        </Link>
      </div>
    </section>
  );
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  const project = await getResolvedProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }
  const otherProjects = await getResolvedRelatedProjects(project.slug);

  return (
    <main className="relative -mt-28 sm:-mt-32 lg:-mt-40">
      <section className="pointer-events-none sticky top-0 z-0 h-[100svh] overflow-hidden">
        <Image src={project.coverImage} alt={project.title} fill className="object-cover" sizes="100vw" priority />
        <div aria-hidden className="absolute inset-0 bg-black/48" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[0.96] text-ivory">{project.title}</h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-ivory/78 md:text-base">{project.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-[28svh] min-h-[120svh] rounded-t-[2.4rem] border-x border-border/18 bg-card px-0 pt-12 pb-20 shadow-[0_-16px_40px_rgba(13,13,15,0.08)] md:-mt-[26svh] md:rounded-t-[3.25rem] md:pt-16 md:pb-28">
        <div className="container space-y-8">
          <header className="space-y-2">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-fg/56">Visual Layout · Template {project.layoutVariant}</p>
            <p className="max-w-2xl text-sm text-fg/66">{galleryNotes[project.layoutVariant]}</p>
          </header>

          <ProjectVisualGallery project={project} />

          <ProjectCtaSection project={project} />
          <OtherProjectsSlider projects={otherProjects} />
        </div>
      </section>
    </main>
  );
}
