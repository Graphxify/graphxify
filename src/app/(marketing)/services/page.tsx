import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/marketing/services-page-content";
import { getPublishedWorks } from "@/db/queries/works";
import { projectCardContent, withProjectCardContent } from "@/lib/project-card-content";
import { buildMetadata } from "@/lib/seo";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "Structured brand systems, modern web design, scalable development, and CMS architecture by Graphxify.",
  path: "/services"
});

type WorkCard = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

function normalizeImage(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

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
      }
    > = new Map()
  ): WorkCard[] =>
    projectCardContent.map((card, index) => {
      const fallback = getProjectBySlug(card.slug) ?? fallbackBySlug.get(card.slug);
      const cms = cmsBySlug.get(card.slug);

      return withProjectCardContent({
        id: cms?.id ?? fallback?.id ?? `work-card-${index + 1}`,
        slug: card.slug,
        title: cms?.title ?? fallback?.title ?? card.title,
        coverImage: normalizeImage(cms?.cover_image_url) ?? fallback?.coverImage ?? `/assets/work-${(index % 3) + 1}.svg`
      });
    });

  try {
    const cmsWorks = await getPublishedWorks();
    if (cmsWorks.length > 0) {
      const cmsBySlug = new Map(cmsWorks.map((work) => [work.slug, work]));
      return buildCanonicalCards(cmsBySlug);
    }
  } catch {
    // fallback below
  }

  return buildCanonicalCards();
}

export default async function ServicesPage() {
  const works = await getWorkCards();
  return <ServicesPageContent works={works.slice(0, 3)} />;
}
