import type { Metadata } from "next";
import { HomeSections } from "@/components/marketing/home-sections";
import { getPublishedWorks } from "@/db/queries/works";
import { demoWorks } from "@/lib/demo-content";
import { buildMetadata } from "@/lib/seo";

type WorkPreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  year?: number;
  role?: string;
  services?: string[];
};

export const metadata: Metadata = buildMetadata({
  title: "Graphxify — Premium Brand Systems & High-Performance Websites",
  description:
    "Graphxify is a premium branding + web design + development studio. We design cohesive brand systems, craft clean UX/UI, and ship fast, accessible websites with structured CMS implementations.",
  path: "/"
});

function toWorkPreview(item: Partial<WorkPreview>): WorkPreview | null {
  if (!item.id || !item.title || !item.slug || !item.excerpt) {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    cover_image_url: item.cover_image_url ?? null,
    year: item.year,
    role: item.role,
    services: item.services
  };
}

export default async function HomePage() {
  let works: WorkPreview[] = demoWorks
    .map((item) => toWorkPreview(item))
    .filter((item): item is WorkPreview => item !== null);

  try {
    const dbWorks = await getPublishedWorks();
    if (dbWorks.length > 0) {
      works = dbWorks
        .map((item) => toWorkPreview(item as Partial<WorkPreview>))
        .filter((item): item is WorkPreview => item !== null);
    }
  } catch {
    // Degraded mode fallback.
  }

  return <HomeSections works={works} />;
}
