// ISR: re-fetch from Supabase at most once per minute; serve cache between revalidations
export const revalidate = 60;

import type { Metadata } from "next";
import { HomeSections } from "@/components/marketing/home-sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Design & Development Agency for Modern Businesses",
  description: "Graphxify is a Canadian web design and branding agency serving Toronto, Mississauga, and Ontario. We build brand identities, custom websites, and performance digital platforms for businesses across Canada.",
  path: "/",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "Brands and Websites Built for Canadian Businesses | Graphxify",
  ogDescription: "A Toronto-based design studio helping small businesses and founders launch with a brand and website that looks credible, loads fast, and converts.",
  ogImageAlt: "Graphxify design studio — brand identity and web design for Canadian businesses"
});
import { getTestimonialMetrics } from "@/db/queries/testimonial-metrics";
import { getPublishedTestimonials } from "@/db/queries/testimonials";
import { getPublishedWorks } from "@/db/queries/works";
import { normalizeImage, firstGalleryImage, withImageVersion } from "@/lib/content-helpers";
import { testimonialMetricsDefault, testimonials as fallbackTestimonials } from "@/lib/constants";
import { projectCardContent, resolveProjectSlugFromPathSlug, withProjectCardContent } from "@/lib/project-card-content";
import { getProjectBySlug, graphxifyProjects } from "@/lib/project-details";

type TestimonialPreview = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image_url?: string | null;
};

type TestimonialMetricPreview = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
};

type HomeProjectPreview = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  coverImage: string;
};

function fallbackHomeProjects(): HomeProjectPreview[] {
  return projectCardContent.map((card, index) => {
    const fallbackProject = getProjectBySlug(card.slug) ?? graphxifyProjects[index];
    const baseProject: HomeProjectPreview = {
      id: fallbackProject?.id ?? `home-project-${index + 1}`,
      slug: fallbackProject?.slug ?? card.slug,
      title: fallbackProject?.title ?? `Project ${index + 1}`,
      industry: fallbackProject?.industry ?? "Digital Platform",
      coverImage: fallbackProject?.coverImage ?? `/assets/work-${(index % 3) + 1}.svg`
    };

    return withProjectCardContent(baseProject);
  });
}

function deduplicateWorksByCanonicalSlug<T extends { slug: string; updated_at?: string | null }>(works: T[]): T[] {
  const latestByCanonicalSlug = new Map<string, T>();

  for (const work of works) {
    const canonicalSlug = resolveProjectSlugFromPathSlug(work.slug);
    const existing = latestByCanonicalSlug.get(canonicalSlug);
    const existingUpdated = Number.isFinite(Date.parse(existing?.updated_at ?? "")) ? Date.parse(existing?.updated_at ?? "") : 0;
    const candidateUpdated = Number.isFinite(Date.parse(work.updated_at ?? "")) ? Date.parse(work.updated_at ?? "") : 0;

    if (!existing || candidateUpdated >= existingUpdated) {
      latestByCanonicalSlug.set(canonicalSlug, work);
    }
  }

  return works.filter((work) => {
    const canonicalSlug = resolveProjectSlugFromPathSlug(work.slug);
    return latestByCanonicalSlug.get(canonicalSlug) === work;
  });
}

function toTestimonialPreview(item: Partial<TestimonialPreview>): TestimonialPreview | null {
  if (!item.id || !item.quote || !item.name || !item.role) {
    return null;
  }

  return {
    id: item.id,
    quote: item.quote,
    name: item.name,
    role: item.role,
    image_url: item.image_url ?? null
  };
}

function toMetricPreview(item: Partial<TestimonialMetricPreview>): TestimonialMetricPreview | null {
  if (!item.id || !item.value || !item.label) {
    return null;
  }

  return {
    id: item.id,
    value: item.value,
    label: item.label,
    sort_order: typeof item.sort_order === "number" ? item.sort_order : 0
  };
}

export default async function HomePage() {
  let testimonials: TestimonialPreview[] = fallbackTestimonials
    .map((item) => toTestimonialPreview(item))
    .filter((item): item is TestimonialPreview => item !== null);
  let testimonialMetrics: TestimonialMetricPreview[] = testimonialMetricsDefault
    .map((item) => toMetricPreview(item))
    .filter((item): item is TestimonialMetricPreview => item !== null);
  let homeProjects: HomeProjectPreview[] = fallbackHomeProjects();

  const [testimonialsResult, metricsResult, worksResult] = await Promise.allSettled([
    getPublishedTestimonials(),
    getTestimonialMetrics(),
    getPublishedWorks()
  ]);

  if (testimonialsResult.status === "fulfilled" && testimonialsResult.value.length > 0) {
    testimonials = testimonialsResult.value
      .map((item) => toTestimonialPreview(item as Partial<TestimonialPreview>))
      .filter((item): item is TestimonialPreview => item !== null);
  }

  if (metricsResult.status === "fulfilled" && metricsResult.value.rows.length > 0) {
    testimonialMetrics = metricsResult.value.rows
      .map((item) => toMetricPreview(item as Partial<TestimonialMetricPreview>))
      .filter((item): item is TestimonialMetricPreview => item !== null)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  if (worksResult.status === "fulfilled" && worksResult.value.length > 0) {
    const dedupedCmsWorks = deduplicateWorksByCanonicalSlug(worksResult.value);

    homeProjects = dedupedCmsWorks.map((work, index) => {
      const canonicalSlug = resolveProjectSlugFromPathSlug(work.slug);
      const fallbackProject = getProjectBySlug(canonicalSlug);
      const coverImageBase =
        normalizeImage(work.cover_image_url) ??
        firstGalleryImage(work.gallery_images) ??
        fallbackProject?.coverImage ??
        `/assets/work-${(index % 3) + 1}.svg`;

      return withProjectCardContent({
        id: work.id,
        slug: canonicalSlug,
        title: work.title,
        industry: work.industry?.trim() || fallbackProject?.industry || "Digital Platform",
        coverImage: withImageVersion(coverImageBase, work.updated_at ?? null)
      });
    });
  }

  return <HomeSections testimonials={testimonials} testimonialMetrics={testimonialMetrics} homeProjects={homeProjects} />;
}
