import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  isTestimonialMetricsTableMissing,
  readFallbackTestimonialMetrics,
  type FallbackTestimonialMetric
} from "@/lib/testimonial-fallback";

function normalizeMetricRow(row: Record<string, unknown>): FallbackTestimonialMetric | null {
  if (typeof row.id !== "string" || !row.id) {
    return null;
  }

  const createdAt =
    typeof row.created_at === "string" && row.created_at ? row.created_at : new Date().toISOString();
  const updatedAt =
    typeof row.updated_at === "string" && row.updated_at ? row.updated_at : createdAt;

  return {
    id: row.id,
    value: typeof row.value === "string" ? row.value : "",
    label: typeof row.label === "string" ? row.label : "",
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    author_id: typeof row.author_id === "string" ? row.author_id : null,
    created_at: createdAt,
    updated_at: updatedAt
  };
}

export async function getTestimonialMetrics() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonial_metrics")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (isTestimonialMetricsTableMissing(error)) {
      return {
        rows: await readFallbackTestimonialMetrics(),
        warning:
          "Using fallback storage for testimonial metrics because the public.testimonial_metrics table is not available yet."
      };
    }
    throw error;
  }

  const rows = (data ?? [])
    .map((row) => normalizeMetricRow(row as Record<string, unknown>))
    .filter((row): row is FallbackTestimonialMetric => row !== null)
    .sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));

  return { rows, warning: "" };
}

