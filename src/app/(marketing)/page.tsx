import { HomeSections } from "@/components/marketing/home-sections";
import { getTestimonialMetrics } from "@/db/queries/testimonial-metrics";
import { getPublishedTestimonials } from "@/db/queries/testimonials";
import { getPublishedWorks } from "@/db/queries/works";
import { testimonialMetricsDefault, testimonials as fallbackTestimonials } from "@/lib/constants";
import { projectCardContent, withProjectCardContent } from "@/lib/project-card-content";
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
    const cmsBySlug = new Map(worksResult.value.map((work) => [work.slug, work]));
    homeProjects = homeProjects.map((project) => {
      const cmsProject = cmsBySlug.get(project.slug);
      const fallbackProject = getProjectBySlug(project.slug);
      const baseProject: HomeProjectPreview = {
        ...project,
        id: cmsProject?.id ?? project.id,
        coverImage: normalizeImage(cmsProject?.cover_image_url) ?? fallbackProject?.coverImage ?? project.coverImage
      };

      return withProjectCardContent(baseProject);
    });
  }

  return <HomeSections testimonials={testimonials} testimonialMetrics={testimonialMetrics} homeProjects={homeProjects} />;
}
