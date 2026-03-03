import { HomeSections } from "@/components/marketing/home-sections";
import { getTestimonialMetrics } from "@/db/queries/testimonial-metrics";
import { getPublishedTestimonials } from "@/db/queries/testimonials";
import { getPublishedWorks } from "@/db/queries/works";
import { testimonialMetricsDefault, testimonials as fallbackTestimonials } from "@/lib/constants";
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

function normalizeImage(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function fallbackHomeProjects(): HomeProjectPreview[] {
  return graphxifyProjects.slice(0, 6).map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    industry: project.industry,
    coverImage: project.coverImage
  }));
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
    const cmsProjects = worksResult.value.map((work) => {
      const fallbackProject = getProjectBySlug(work.slug);
      return {
        id: work.id,
        slug: work.slug,
        title: work.title,
        industry: fallbackProject?.industry ?? "Digital Product",
        coverImage: normalizeImage(work.cover_image_url) ?? fallbackProject?.coverImage ?? "/assets/work-1.svg"
      };
    });

    if (cmsProjects.length > 0) {
      const usedSlugs = new Set(cmsProjects.map((item) => item.slug));
      const remainingFallback = homeProjects.filter((item) => !usedSlugs.has(item.slug));
      homeProjects = [...cmsProjects, ...remainingFallback].slice(0, 6);
    }
  }

  return <HomeSections testimonials={testimonials} testimonialMetrics={testimonialMetrics} homeProjects={homeProjects} />;
}
