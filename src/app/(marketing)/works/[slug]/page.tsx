// ISR: re-render at most once per 60 s; serve cached version between revalidations.
// On-demand revalidatePath() is also called by content-service on every CMS save.
export const revalidate = 60;
// Only slugs from generateStaticParams are served (it has a hardcoded fallback),
// so any other /works/* URL returns a real 404 instead of a soft-404 200.
export const dynamicParams = false;

import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLink } from "@/components/site/arrow-link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaBlock } from "@/components/site/cta-block";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectStage } from "@/components/site/project-stage";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { CaseGallery } from "@/components/work/case-gallery";
import { CaseHero, CaseOverview, CaseStory } from "@/components/work/case-study";
import { getImageRatio, packRows } from "@/components/work/gallery-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { getPublishedWorks, getWorkImageAlts } from "@/db/queries/works";
import { getProjectArt, renderAlt, resolveProjectRenders } from "@/lib/project-art";
import {
  applyConfirmedCopy,
  getProjectDisplayTitle,
  getProjectPathSlug,
  resolveProjectSlugFromPathSlug,
  withProjectCardContent
} from "@/lib/project-card-content";
import {
  getProjectBySlug,
  graphxifyProjects,
  type LayoutVariant,
  type ProjectDetail,
  type ProjectImage
} from "@/lib/project-details";
import { breadcrumbListJsonLd, buildCaseStudyTitle, buildMetadata, canonicalUrl, caseStudyJsonLd } from "@/lib/seo";

type Params = { slug: string };
type CmsWorkLike = {
  id: string;
  title: string;
  slug: string;
  year: number;
  role?: string | null;
  services: string[] | null;
  subtitle?: string | null;
  layout_variant?: string | null;
  excerpt: string;
  content?: string | null;
  cover_image_url?: string | null;
  gallery_images?: string[] | null;
  updated_at?: string | null;
  // CMS-managed fields
  industry?: string | null;
  platform?: string | null;
  timeline?: string | null;
  location?: string | null;
  live_url?: string | null;
  overview?: string | null;
  challenge?: string | null;
  approach?: string | null;
  solution?: string | null;
  result?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  og_image_alt?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
  twitter_card?: string | null;
  canonical_url?: string | null;
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

function withImageVersion(src: string, version: string | null | undefined): string {
  if (!version) {
    return src;
  }

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  const [path, rawQuery = ""] = src.split("?");
  const params = new URLSearchParams(rawQuery);
  params.set("v", version);
  const nextQuery = params.toString();

  return nextQuery.length > 0 ? `${path}?${nextQuery}` : path;
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
  // When CMS gallery images exist, cycle through them only — never mix in SVG placeholders.
  const cmsSources = uniqueStrings(primary);
  if (cmsSources.length > 0) {
    return Array.from({ length: REQUIRED_GALLERY_IMAGES }, (_, i) => cmsSources[i % cmsSources.length]);
  }

  // No CMS images: use hardcoded fallback images, then SVGs as last resort.
  const candidateSources = uniqueStrings([...fallback, ...getFallbackGallerySources(coverImage)]).filter(
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
            alt: `${title} project by Graphxify, gallery image 1`,
            caption: fallbackCaption
          }
        ];

  return Array.from({ length: REQUIRED_GALLERY_IMAGES }, (_, index) => {
    const source = baseImages[index % baseImages.length];
    return {
      src: source.src,
      alt: `${title} project by Graphxify, gallery image ${index + 1}`,
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

/**
 * CMS `works.location` = the CLIENT's location / primary market (not
 * Graphxify's). Until 2026-09-29 the column defaulted to 'Canada' and a bulk
 * migration wrote that default into every row, so the exact legacy value is not
 * trustworthy per-project data. It is ignored here until the data fix in
 * supabase/drafts/confirmed-facts-2026-09-29.sql has cleared it; after that,
 * editors can enter real values (e.g. "Toronto, Canada") and they render.
 */
const LEGACY_BULK_LOCATION = "canada";

function getClientLocation(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.toLowerCase() === LEGACY_BULK_LOCATION) return null;
  return trimmed;
}

function toUnixMs(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildLatestCmsWorkByCanonicalSlug(cmsWorks: CmsWorkLike[]): Map<string, CmsWorkLike> {
  const byCanonicalSlug = new Map<string, CmsWorkLike>();

  for (const work of cmsWorks) {
    const canonicalSlug = resolveProjectSlugFromPathSlug(work.slug);
    const candidate: CmsWorkLike = { ...work, slug: canonicalSlug };
    const existing = byCanonicalSlug.get(canonicalSlug);
    if (!existing || toUnixMs(candidate.updated_at) >= toUnixMs(existing.updated_at)) {
      byCanonicalSlug.set(canonicalSlug, candidate);
    }
  }

  return byCanonicalSlug;
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
      const latestByCanonicalSlug = buildLatestCmsWorkByCanonicalSlug(cmsWorks as CmsWorkLike[]);
      return buildUniqueLayoutVariantMap(
        Array.from(latestByCanonicalSlug.values()).map((work) => {
          return {
            slug: work.slug,
            preferred:
              normalizeLayoutVariant((work as CmsWorkLike).layout_variant) ??
              fallbackBySlug.get(work.slug)?.layoutVariant ??
              null
          };
        })
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

const CORRECTED_CMS_TEXT_FIELDS = [
  "subtitle", "excerpt", "content", "overview", "challenge", "approach", "solution", "result",
  "meta_title", "meta_description", "og_title", "og_description", "og_image_alt",
  "twitter_title", "twitter_description"
] as const;

/** Applies the confirmed-facts copy corrections to every CMS text field that renders. */
function withConfirmedCopy(work: CmsWorkLike): CmsWorkLike {
  const corrected: CmsWorkLike = { ...work };
  for (const field of CORRECTED_CMS_TEXT_FIELDS) {
    const value = corrected[field];
    if (typeof value === "string") {
      (corrected as Record<string, unknown>)[field] = applyConfirmedCopy(work.slug, value);
    }
  }
  return corrected;
}

function mapCmsWorkToProject(
  rawWork: CmsWorkLike,
  fallbackProject: ProjectDetail | null,
  index = 0,
  forcedLayoutVariant?: LayoutVariant
): ProjectDetail {
  const work = withConfirmedCopy(rawWork);
  const displayTitle = getProjectDisplayTitle(work.slug, work.title);
  const imageVersion = work.updated_at ?? null;
  const layoutSectionTitle = work.role?.trim() || fallbackProject?.layoutSectionTitle || "Visual Layout";
  const normalizedCmsGallerySources = uniqueStrings(Array.isArray(work.gallery_images) ? work.gallery_images : []);
  const explicitCover = normalizeImageSrc(work.cover_image_url);
  const coverImageBase =
    explicitCover ?? normalizedCmsGallerySources[0] ?? fallbackProject?.coverImage ?? "/assets/work-1.svg";
  // Only remove the cover from gallery sources when it was explicitly set as the hero —
  // if the cover was derived from the first gallery image, keep all uploads intact.
  const cmsGallerySources = explicitCover
    ? normalizedCmsGallerySources.filter((src) => src !== coverImageBase)
    : normalizedCmsGallerySources;
  // Only use hardcoded project images to pad the gallery when CMS provides none.
  // When CMS has gallery images, repeat only those (plus the SVG placeholders as a last resort)
  // so the hardcoded images from a previous project version never bleed through.
  const fallbackSources =
    cmsGallerySources.length === 0
      ? uniqueStrings((fallbackProject?.images ?? []).map((image) => image.src)).filter((src) => src !== coverImageBase)
      : [];
  const gallerySources = ensureExactGallerySources(cmsGallerySources, fallbackSources, coverImageBase);

  const images: ProjectImage[] =
    gallerySources.length > 0
      ? gallerySources.map((src, imageIndex) => ({
          src: withImageVersion(src, imageVersion),
          alt: `${displayTitle} project by Graphxify, gallery image ${imageIndex + 1}`,
          caption: work.excerpt
        }))
      : [];

  const coverImage = withImageVersion(coverImageBase, imageVersion);

  const excerpt = work.excerpt?.trim() || fallbackProject?.excerpt || displayTitle;
  const content = work.content?.trim() || fallbackProject?.content || excerpt;
  const services = Array.isArray(work.services) && work.services.length > 0 ? work.services : fallbackProject?.services ?? [];
  const subtitle = work.subtitle?.trim() || fallbackProject?.subtitle || excerpt;
  const layoutVariant =
    forcedLayoutVariant ??
    normalizeLayoutVariant(work.layout_variant) ??
    fallbackProject?.layoutVariant ??
    variantForSlug(work.slug, index);

  // Build scope from CMS fields with local fallback
  const fallbackScope = fallbackProject?.scope ?? [];
  const cmsScope: Array<{ label: string; value: string }> = [];
  const cmsPlatform = work.platform?.trim() || fallbackScope.find(({ label }) => label.toLowerCase() === "platform")?.value;
  const cmsTimeline = work.timeline?.trim() || fallbackScope.find(({ label }) => label.toLowerCase() === "timeline")?.value || String(work.year);
  if (cmsPlatform) cmsScope.push({ label: "Platform", value: cmsPlatform });
  cmsScope.push({ label: "Timeline", value: cmsTimeline });
  const clientLocation = getClientLocation(work.location);
  if (clientLocation) cmsScope.push({ label: "Client location", value: clientLocation });

  // Case study content: CMS fields first, local fallback second
  const cmsOverview = work.overview?.trim() || fallbackProject?.overview || content;
  const cmsChallenge = work.challenge?.trim() || fallbackProject?.proof?.problem || excerpt;
  const cmsApproach = work.approach?.trim() || fallbackProject?.proof?.approach || "";
  const cmsSolution = work.solution?.trim() || fallbackProject?.proof?.solution || content;
  const cmsResult = work.result?.trim() || fallbackProject?.proof?.outcome || "";

  return {
    id: work.id,
    slug: work.slug,
    layoutVariant,
    layoutSectionTitle,
    title: displayTitle,
    subtitle,
    year: Number.isFinite(work.year) ? work.year : fallbackProject?.year ?? new Date().getFullYear(),
    industry: work.industry?.trim() || fallbackProject?.industry || "Digital Product",
    services,
    overview: cmsOverview,
    excerpt,
    content,
    coverImage,
    liveUrl: work.live_url?.trim() || fallbackProject?.liveUrl,
    images,
    scope: cmsScope,
    proof: {
      problem: cmsChallenge,
      approach: cmsApproach,
      solution: cmsSolution,
      outcome: cmsResult
    },
    // SEO fields passed through so generateMetadata can read them via `project as CmsWorkLike`
    meta_title: work.meta_title ?? null,
    meta_description: work.meta_description ?? null,
    og_title: work.og_title ?? null,
    og_description: work.og_description ?? null,
    og_image: work.og_image ?? null,
    og_image_alt: work.og_image_alt ?? null,
    twitter_title: work.twitter_title ?? null,
    twitter_description: work.twitter_description ?? null,
    twitter_image: work.twitter_image ?? null,
    twitter_card: work.twitter_card ?? null,
    canonical_url: work.canonical_url ?? null
  } as unknown as ProjectDetail;
}

async function getResolvedProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const resolvedSlug = resolveProjectSlugFromPathSlug(slug);
  const fallbackProject = getProjectBySlug(resolvedSlug);
  const layoutVariantMap = await getResolvedLayoutVariantMap();
  const forcedLayoutVariant = layoutVariantMap.get(resolvedSlug);

  try {
    const cmsWorks = await getPublishedWorks();
    const cmsByCanonicalSlug = buildLatestCmsWorkByCanonicalSlug(cmsWorks as CmsWorkLike[]);
    const cmsWork = cmsByCanonicalSlug.get(resolvedSlug);
    if (!cmsWork) {
      return fallbackProject ? withProjectCardContent(withLayoutVariant(fallbackProject, forcedLayoutVariant)) : null;
    }
    return withProjectCardContent(mapCmsWorkToProject(cmsWork, fallbackProject, 0, forcedLayoutVariant));
  } catch {
    return fallbackProject ? withProjectCardContent(withLayoutVariant(fallbackProject, forcedLayoutVariant)) : null;
  }
}

async function getResolvedRelatedProjects(currentSlug: string): Promise<ProjectDetail[]> {
  const layoutVariantMap = await getResolvedLayoutVariantMap();
  const uniqueBySlug = (items: ProjectDetail[]) => {
    const bySlug = new Map<string, ProjectDetail>();
    for (const item of items) {
      if (!bySlug.has(item.slug)) {
        bySlug.set(item.slug, item);
      }
    }
    return Array.from(bySlug.values());
  };
  const fallbackRelated = () =>
    uniqueBySlug(
      graphxifyProjects
      .filter((project) => project.slug !== currentSlug)
      .map((project) => withProjectCardContent(withLayoutVariant(project, layoutVariantMap.get(project.slug))))
    );

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      const cmsByCanonicalSlug = buildLatestCmsWorkByCanonicalSlug(cmsWorks as CmsWorkLike[]);
      const cmsRelated = uniqueBySlug(
        Array.from(cmsByCanonicalSlug.values())
        .filter((work) => work.slug !== currentSlug)
        .map((work, index) => {
          return mapCmsWorkToProject(
            work,
            getProjectBySlug(work.slug),
            index,
            layoutVariantMap.get(work.slug)
          );
        })
        .map((project) => withProjectCardContent(project))
      );

      const related = uniqueBySlug([...cmsRelated, ...fallbackRelated()]);

      if (related.length > 0) {
        return related;
      }
    }
  } catch {
    // Local fallback below.
  }

  return fallbackRelated();
}

export async function generateStaticParams(): Promise<Params[]> {
  // Only the public path slug of each project is prerendered. Internal CMS
  // slugs and legacy aliases are permanent redirects in next.config.ts
  // (legacyWorkPathRedirects), so they never render as duplicate 200 pages.
  const fallbackPathSlugs = graphxifyProjects.map((project) => getProjectPathSlug(project.slug));

  try {
    const cmsWorks = await getPublishedWorks();
    const slugs = new Set<string>(fallbackPathSlugs);
    cmsWorks.forEach((work) => {
      slugs.add(getProjectPathSlug(resolveProjectSlugFromPathSlug(work.slug)));
    });
    return Array.from(slugs).map((slug) => ({ slug }));
  } catch {
    return Array.from(new Set(fallbackPathSlugs)).map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getResolvedProjectBySlug(slug);
  if (!project) {
    // Unknown slug: keep it out of the index (ISR can serve the not-found render
    // with a 200, so noindex prevents a soft-404 from ever being indexed).
    return {
      ...buildMetadata({
        title: "Project Not Found",
        description: "Project item not found.",
        path: `/works/${slug}`
      }),
      robots: { index: false, follow: false }
    };
  }

  const canonicalPathSlug = getProjectPathSlug(project.slug);

  const cmsWork = project as CmsWorkLike;

  const autoTitle = buildCaseStudyTitle(project.title, project.industry);

  return buildMetadata({
    title: cmsWork.meta_title?.trim() || autoTitle,
    description: cmsWork.meta_description?.trim() || project.excerpt,
    path: `/works/${canonicalPathSlug}`,
    image: project.coverImage,
    ogTitle: cmsWork.og_title,
    ogDescription: cmsWork.og_description,
    ogImage: cmsWork.og_image,
    ogImageAlt: cmsWork.og_image_alt || `${project.title}${project.industry ? ` — ${project.industry} project` : " project"} by Graphxify`,
    twitterTitle: cmsWork.twitter_title,
    twitterDescription: cmsWork.twitter_description,
    twitterImage: cmsWork.twitter_image,
    twitterCard: cmsWork.twitter_card,
    canonicalUrl: cmsWork.canonical_url
  });
}

/** Gallery for display: padded set from the data layer, de-duplicated so no image repeats on the page. */
function getGalleryImages(project: ProjectDetail): ProjectImage[] {
  const padded = ensureExactGalleryImages(project.images, project.title, project.excerpt, project.coverImage);
  return Array.from(new Map(padded.map((image) => [image.src, image])).values()).map((image, index) => ({
    ...image,
    alt: `${project.title} project by Graphxify, gallery image ${index + 1}`
  }));
}

function getProjectTimeline(project: ProjectDetail): string {
  const found = project.scope.find(({ label }) => label.toLowerCase() === "timeline");
  return found?.value ?? String(project.year);
}

const SERVICE_ROUTE_MAP: Record<string, string> = {
  "Brand Identity": "/services/brand-systems",
  "Design System": "/services/brand-systems",
  "Branding": "/services/brand-systems",
  "Website Design": "/services/web-design",
  "Web Design": "/services/web-design",
  "UI/UX": "/services/web-design",
  "UX Strategy": "/services/web-design",
  "Web Development": "/services/web-development",
  "CMS Architecture": "/services/cms-architecture"
};

function getProjectFacts(project: ProjectDetail): Array<{ label: string; value: React.ReactNode }> {
  const platform = project.scope.find(({ label }) => label.toLowerCase() === "platform")?.value ?? "Web";
  const clientLocation = project.scope.find(({ label }) => label === "Client location")?.value;
  const services = project.services.length > 0 ? project.services.slice(0, 3) : ["Brand and Web"];

  const facts: Array<{ label: string; value: React.ReactNode }> = [
    { label: "Industry", value: project.industry },
    {
      label: "Services",
      value: services.map((service, index) => {
        const route = SERVICE_ROUTE_MAP[service];
        const separator = index < services.length - 1 ? ", " : "";
        return route ? (
          <span key={service}>
            <Link href={route} className="underline decoration-1 underline-offset-4 hover:decoration-2">
              {service}
            </Link>
            {separator}
          </span>
        ) : (
          <span key={service}>
            {service}
            {separator}
          </span>
        );
      })
    },
    { label: "Platform", value: platform },
    { label: "Timeline", value: getProjectTimeline(project) }
  ];
  // Client / project market. Rendered only when the CMS holds a real value.
  if (clientLocation) facts.push({ label: "Client location", value: clientLocation });
  return facts;
}

function ProjectNarrative({ project }: { project: ProjectDetail }): JSX.Element | null {
  // Thin records (fallback copy only) skip the narrative rather than repeat the summary.
  if (project.overview.length <= 40 || project.proof.problem.length <= 40) {
    return null;
  }

  const steps = [
    { title: "Challenge", body: project.proof.problem },
    { title: "Approach", body: project.proof.approach ?? "" },
    { title: "Solution", body: project.proof.solution }
  ].filter((step) => step.body.trim());

  return (
    <>
      <CaseOverview text={project.overview} />
      <CaseStory steps={steps} result={project.proof.outcome.trim()} services={project.services} />
    </>
  );
}

/** Unique renders in CMS order: [cover, ...gallery], the indexing project-art.ts expects. */
function getRenders(project: ProjectDetail): string[] {
  return Array.from(new Set([project.coverImage, ...project.images.map((image) => image.src)]));
}

/** Other projects ordered to start right after the current one, so "Next project" cycles through the whole portfolio. */
async function getProjectOrder(): Promise<string[]> {
  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      return Array.from(buildLatestCmsWorkByCanonicalSlug(cmsWorks as CmsWorkLike[]).keys());
    }
  } catch {
    // Local order below.
  }
  return graphxifyProjects.map((project) => project.slug);
}

function orderAfter(projects: ProjectDetail[], order: string[], currentSlug: string): ProjectDetail[] {
  const at = order.indexOf(currentSlug);
  const rank = (slug: string) => {
    const index = order.indexOf(slug);
    return index === -1 ? Number.MAX_SAFE_INTEGER : (index - at + order.length) % order.length;
  };
  return [...projects].sort((a, b) => rank(a.slug) - rank(b.slug));
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getResolvedProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const canonicalPathSlug = getProjectPathSlug(project.slug);
  if (slug !== canonicalPathSlug) {
    // Safety net only — known aliases are already 308s in next.config.ts.
    permanentRedirect(`/works/${canonicalPathSlug}`);
  }

  const [related, order, cmsAlts] = await Promise.all([getResolvedRelatedProjects(project.slug), getProjectOrder(), getWorkImageAlts(project.slug)]);
  const [nextProject, ...moreProjects] = orderAfter(related, order, project.slug);
  const casePath = `/works/${canonicalPathSlug}`;
  const cmsWork = project as unknown as CmsWorkLike;
  // Every image is described by what it shows (CMS alt text first), not by its position in the gallery.
  const altFor = (src: string) => renderAlt(project.title, src, cmsAlts);
  const cover = { src: project.coverImage, alt: altFor(project.coverImage) };
  const liveMockups = getProjectArt(project.slug).mockups ?? [];
  const galleryImages = [
    ...liveMockups.map((src) => ({ src, alt: altFor(src) })),
    cover,
    ...getGalleryImages(project)
      .filter((image) => image.src !== cover.src)
      .map((image) => ({ ...image, alt: altFor(image.src) }))
  ];
  const { art, hero } = resolveProjectRenders(project.slug, galleryImages.slice(liveMockups.length).map((image) => image.src));
  const ratios = await Promise.all(galleryImages.map((image) => getImageRatio(image.src)));
  const galleryItems = galleryImages.map((image, index) => ({ src: image.src, alt: image.alt, ratio: ratios[index] }));
  const galleryRows = packRows(ratios.map((ratio) => ratio ?? 1.5));
  const nextTitle = nextProject ? getProjectDisplayTitle(nextProject.slug, nextProject.title) : null;
  const otherProjects = moreProjects.slice(0, 3);

  return (
    // <article>, not <main>: the marketing layout already provides the single <main> landmark.
    <article>
      <JsonLd
        data={caseStudyJsonLd({
          title: project.title,
          description: cmsWork.meta_description?.trim() || project.excerpt,
          path: casePath,
          industry: project.industry,
          services: project.services,
          images: [project.coverImage, ...project.images.map((image) => image.src)].filter(
            (src) => !src.startsWith("/assets/")
          ),
          liveUrl: project.liveUrl
        })}
      />
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: "Home", url: canonicalUrl("/") },
          { name: "Work", url: canonicalUrl("/works") },
          { name: project.title, url: canonicalUrl(casePath) }
        ])}
      />
      <ContentRefreshListener pathPrefixes={["/works"]} />

      <div className="container pt-6 md:pt-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work", href: "/works" }, { label: project.title }]} />
        <div className="mt-6 md:mt-8">
          <CaseHero
            title={project.title}
            industry={project.industry}
            summary={project.subtitle}
            facts={getProjectFacts(project)}
            image={hero}
            imageAlt={hero === cover.src ? cover.alt : galleryImages.find((image) => image.src === hero)?.alt ?? cover.alt}
            art={art}
            liveUrl={project.liveUrl}
            analyticsSlug={resolveProjectSlugFromPathSlug(project.slug)}
          />
        </div>
      </div>

      <ProjectNarrative project={project} />

      {galleryItems.length ? (
        <section aria-label="Gallery" className="container section pt-0 md:pt-0 lg:pt-0">
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionIntro align="left" badge="Gallery" title={<>{project.title} in <span className="text-accentB">detail</span></>} />
            <p className="t-small md:pb-2">{galleryItems.length} renders. Select any to enlarge.</p>
          </Reveal>
          <div className="mt-12 md:mt-16">
            <CaseGallery items={galleryItems} rows={galleryRows} stage={art.stage} />
          </div>
        </section>
      ) : null}

      {nextProject && nextTitle ? (
        <section aria-label="Next project" className="container section pt-0 md:pt-0 lg:pt-0">
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionIntro align="left" badge="Next project" title={<>Keep <span className="text-accentB">exploring</span></>} />
            <ArrowLink href="/works" className="md:pb-2">
              All work
            </ArrowLink>
          </Reveal>
          <Reveal className="mt-12 md:mt-16">
            <ProjectStage
              project={{
                slug: nextProject.slug,
                href: `/works/${getProjectPathSlug(nextProject.slug)}`,
                title: nextTitle,
                industry: nextProject.industry,
                images: getRenders(nextProject),
                summary: nextProject.subtitle,
                tags: nextProject.services
              }}
            />
          </Reveal>
          {otherProjects.length ? (
            <div className="mt-5 grid gap-5 md:mt-6 md:grid-cols-3 md:gap-6">
              {otherProjects.map((item, index) => (
                <Reveal key={item.slug} delay={index * 80}>
                  <ProjectCard
                    href={`/works/${getProjectPathSlug(item.slug)}`}
                    slug={item.slug}
                    title={getProjectDisplayTitle(item.slug, item.title)}
                    industry={item.industry}
                    image={item.coverImage}
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                </Reveal>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <CtaBlock />
    </article>
  );
}
