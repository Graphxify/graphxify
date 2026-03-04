import type { Metadata } from "next";
import { AboutPageContent } from "@/components/marketing/about-page-content";
import { getPublishedWorks } from "@/db/queries/works";
import { projectCardContent, withProjectCardContent } from "@/lib/project-card-content";
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

export default async function AboutPage() {
  const works = await getWorkCards();
  return <AboutPageContent works={works.slice(0, 3)} />;
}
