export const revalidate = 60;

import type { Metadata } from "next";
import { AboutPageContent } from "@/components/marketing/about-page-content";
import { getPublishedWorks } from "@/db/queries/works";
import { getPublishedTestimonials } from "@/db/queries/testimonials";
import { normalizeImage, firstGalleryImage, withImageVersion } from "@/lib/content-helpers";
import { projectCardContent, resolveProjectSlugFromPathSlug, withProjectCardContent } from "@/lib/project-card-content";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Graphxify – Design & Development Studio",
  description: "Graphxify is a web design and branding agency delivering custom websites, brand identity systems, and digital platforms for businesses worldwide.",
  path: "/about",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "About Graphxify — Design & Development Studio",
  ogDescription: "Built by a designer who codes. Structured brand systems and custom websites for modern businesses — no templates, no shortcuts.",
  ogImageAlt: "Graphxify studio — precision-built brand systems and web design for modern businesses"
});

type WorkCard = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

type CmsWorkEntry = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  gallery_images?: string[] | null;
  updated_at?: string | null;
};

function toUnixMs(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function asCmsWorkEntry(work: unknown): CmsWorkEntry | null {
  if (!work || typeof work !== "object") return null;
  const w = work as Record<string, unknown>;
  if (typeof w.id !== "string" || typeof w.slug !== "string") return null;
  return {
    id: w.id,
    title: typeof w.title === "string" ? w.title : "",
    slug: w.slug,
    cover_image_url: typeof w.cover_image_url === "string" ? w.cover_image_url : null,
    gallery_images: Array.isArray(w.gallery_images) ? (w.gallery_images as string[]) : null,
    updated_at: typeof w.updated_at === "string" ? w.updated_at : null
  };
}

async function getWorkCards(): Promise<WorkCard[]> {
  const fallbackBySlug = new Map(graphxifyProjects.map((project) => [project.slug, project]));

  const buildCanonicalCards = (cmsBySlug: Map<string, CmsWorkEntry> = new Map()): WorkCard[] =>
    projectCardContent.map((card, index) => {
      const fallback = getProjectBySlug(card.slug) ?? fallbackBySlug.get(card.slug);
      const cms = cmsBySlug.get(card.slug);
      const coverImageBase =
        normalizeImage(cms?.cover_image_url) ??
        firstGalleryImage(cms?.gallery_images) ??
        fallback?.coverImage ??
        `/assets/work-${(index % 3) + 1}.svg`;

      return withProjectCardContent({
        id: cms?.id ?? fallback?.id ?? `work-card-${index + 1}`,
        slug: card.slug,
        title: cms?.title ?? fallback?.title ?? card.title,
        coverImage: cms ? withImageVersion(coverImageBase, cms.updated_at ?? null) : coverImageBase
      });
    });

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      const cmsBySlug = new Map<string, CmsWorkEntry>();
      for (const work of cmsWorks) {
        const entry = asCmsWorkEntry(work);
        if (!entry) continue;
        const canonicalSlug = resolveProjectSlugFromPathSlug(entry.slug);
        const existing = cmsBySlug.get(canonicalSlug);
        if (!existing || toUnixMs(entry.updated_at) >= toUnixMs(existing.updated_at)) {
          cmsBySlug.set(canonicalSlug, entry);
        }
      }
      return buildCanonicalCards(cmsBySlug);
    }
  } catch {
    // fallback below
  }

  return buildCanonicalCards();
}

export default async function AboutPage() {
  const [works, testimonialsResult] = await Promise.allSettled([
    getWorkCards(),
    getPublishedTestimonials()
  ]);

  const resolvedWorks = works.status === "fulfilled" ? works.value : [];

  const testimonials: { id: string; name: string; role: string; quote: string; rating?: number }[] =
    testimonialsResult.status === "fulfilled"
      ? testimonialsResult.value.slice(0, 6).map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          quote: t.quote,
          rating: t.rating ?? 5
        }))
      : [];

  return <AboutPageContent works={resolvedWorks.slice(0, 3)} testimonials={testimonials} />;
}
