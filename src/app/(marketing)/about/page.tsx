import type { Metadata } from "next";
import { AboutPageContent } from "@/components/marketing/about-page-content";
import { getPublishedWorks } from "@/db/queries/works";
import { getPublishedTestimonials } from "@/db/queries/testimonials";
import { normalizeImage, firstGalleryImage, withImageVersion } from "@/lib/content-helpers";
import { projectCardContent, resolveProjectSlugFromPathSlug, withProjectCardContent } from "@/lib/project-card-content";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Learn how Graphxify designs and develops structured brand, website, and CMS systems that scale.",
  path: "/about"
});

type WorkCard = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

async function getWorkCards(): Promise<WorkCard[]> {
  const fallbackBySlug = new Map(graphxifyProjects.map((project) => [project.slug, project]));

  const buildCanonicalCards = (
    cmsBySlug: Map<
      string,
      {
        id: string;
        title: string;
        slug: string;
        cover_image_url: string | null;
        gallery_images?: string[] | null;
        updated_at?: string | null;
      }
    > = new Map()
  ): WorkCard[] =>
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
      const cmsBySlug = new Map<string, (typeof cmsWorks)[number]>();
      for (const work of cmsWorks) {
        const canonicalSlug = resolveProjectSlugFromPathSlug(work.slug);
        const existing = cmsBySlug.get(canonicalSlug);
        const existingUpdated = Number.isFinite(Date.parse(existing?.updated_at ?? "")) ? Date.parse(existing?.updated_at ?? "") : 0;
        const candidateUpdated = Number.isFinite(Date.parse(work.updated_at ?? "")) ? Date.parse(work.updated_at ?? "") : 0;
        if (!existing || candidateUpdated >= existingUpdated) {
          cmsBySlug.set(canonicalSlug, work);
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
  const works = await getWorkCards();

  let testimonials: { id: string; name: string; role: string; quote: string; image_url: string | null }[] = [];
  try {
    const raw = await getPublishedTestimonials();
    testimonials = raw.slice(0, 3).map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      quote: t.quote,
      image_url: t.image_url
    }));
  } catch {
    // testimonials table may not exist — graceful fallback
  }

  return <AboutPageContent works={works.slice(0, 3)} testimonials={testimonials} />;
}
