import { HomeSections } from "@/components/marketing/home-sections";
import { getTestimonialMetrics } from "@/db/queries/testimonial-metrics";
import { getPublishedTestimonials } from "@/db/queries/testimonials";
import { testimonialMetricsDefault, testimonials as fallbackTestimonials } from "@/lib/constants";

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

  const [testimonialsResult, metricsResult] = await Promise.allSettled([getPublishedTestimonials(), getTestimonialMetrics()]);

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

  return <HomeSections testimonials={testimonials} testimonialMetrics={testimonialMetrics} />;
}
