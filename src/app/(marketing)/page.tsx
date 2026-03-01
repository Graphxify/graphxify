import { HomeSections } from "@/components/marketing/home-sections";
import { demoWorks } from "@/lib/demo-content";
import { getPublishedWorks } from "@/db/queries/works";

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
