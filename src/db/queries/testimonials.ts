import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isTestimonialsTableMissing, readFallbackTestimonials } from "@/lib/testimonial-fallback";

type TestimonialRow = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image_url: string | null;
  status: "draft" | "published";
  sort_order: number;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

function normalizeTestimonialRow(row: Record<string, unknown>): TestimonialRow | null {
  if (typeof row.id !== "string" || !row.id) {
    return null;
  }

  const status = row.status === "published" ? "published" : "draft";
  const createdAt =
    typeof row.created_at === "string" && row.created_at ? row.created_at : new Date().toISOString();
  const updatedAt =
    typeof row.updated_at === "string" && row.updated_at ? row.updated_at : createdAt;

  return {
    id: row.id,
    quote: typeof row.quote === "string" ? row.quote : "",
    name: typeof row.name === "string" ? row.name : "Unknown",
    role: typeof row.role === "string" ? row.role : "",
    image_url: typeof row.image_url === "string" ? row.image_url : null,
    status,
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    author_id: typeof row.author_id === "string" ? row.author_id : null,
    created_at: createdAt,
    updated_at: updatedAt
  };
}

export async function getPublishedTestimonials() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*");

  if (error) {
    if (isTestimonialsTableMissing(error)) {
      const fallback = await readFallbackTestimonials();
      return fallback.filter((row) => row.status === "published");
    }
    throw error;
  }

  const rows = (data ?? [])
    .map((row) => normalizeTestimonialRow(row as Record<string, unknown>))
    .filter((row): row is TestimonialRow => row !== null)
    .filter((row) => row.status === "published")
    .sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));

  return rows;
}

export async function getDashboardTestimonials(page = 1, pageSize = 12) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("testimonials")
    .select("*", { count: "exact" })
    .range(from, to);

  if (error) {
    if (isTestimonialsTableMissing(error)) {
      const fallback = await readFallbackTestimonials();
      const rows = fallback
        .slice()
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(from, to + 1);

      return {
        rows,
        total: fallback.length,
        page,
        pageSize,
        warning:
          "Using fallback storage for testimonials because the public.testimonials table is not available yet."
      };
    }
    throw error;
  }

  const rows = (data ?? [])
    .map((row) => normalizeTestimonialRow(row as Record<string, unknown>))
    .filter((row): row is TestimonialRow => row !== null)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  return {
    rows,
    total: count ?? 0,
    page,
    pageSize,
    warning: ""
  };
}

export async function getTestimonialById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();

  if (error) {
    if (isTestimonialsTableMissing(error)) {
      const fallback = await readFallbackTestimonials();
      return fallback.find((item) => item.id === id) ?? null;
    }
    throw error;
  }

  return data;
}
