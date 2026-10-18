import { getPublishedWorks } from "@/db/queries/works";
import { normalizeImage, firstGalleryImage, withImageVersion } from "@/lib/content-helpers";
import { projectCardContent, resolveProjectSlugFromPathSlug } from "@/lib/project-card-content";
import { getProjectBySlug } from "@/lib/project-details";

/** A published case study as the services pages show it: confirmed facts + CMS cover. */
export type ServiceWorkCard = {
  id: string;
  pathSlug: string;
  title: string;
  industry: string;
  coverImage: string;
  /** [cover, ...gallery], same order the home page and project art use. */
  images: string[];
};

/** One card per confirmed project, in registry order. CMS supplies covers; local data is the fallback. */
export async function getServiceWorkCards(): Promise<ServiceWorkCard[]> {
  type CmsWork = Awaited<ReturnType<typeof getPublishedWorks>>[number];
  const cmsBySlug = new Map<string, CmsWork>();

  try {
    for (const work of await getPublishedWorks()) {
      const canonicalSlug = resolveProjectSlugFromPathSlug(work.slug);
      const existing = cmsBySlug.get(canonicalSlug);
      const existingUpdated = Date.parse(existing?.updated_at ?? "") || 0;
      const candidateUpdated = Date.parse(work.updated_at ?? "") || 0;
      if (!existing || candidateUpdated >= existingUpdated) cmsBySlug.set(canonicalSlug, work);
    }
  } catch {
    // CMS unavailable: render from the local project data below.
  }

  return projectCardContent.map((card, index) => {
    const fallback = getProjectBySlug(card.slug);
    const cms = cmsBySlug.get(card.slug);
    const coverImageBase =
      normalizeImage(cms?.cover_image_url) ?? firstGalleryImage(cms?.gallery_images) ?? fallback?.coverImage ?? `/assets/work-${(index % 3) + 1}.svg`;

    return {
      id: cms?.id ?? fallback?.id ?? `work-card-${index + 1}`,
      pathSlug: card.pathSlug,
      title: card.title,
      industry: card.industry,
      coverImage: cms ? withImageVersion(coverImageBase, cms.updated_at ?? null) : coverImageBase,
      images: [coverImageBase, ...(cms?.gallery_images ?? []).map((src) => normalizeImage(src)).filter((src): src is string => Boolean(src))]
    };
  });
}
