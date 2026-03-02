import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type FallbackTestimonial = {
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

export type FallbackTestimonialMetric = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export function isTestimonialsTableMissing(error: unknown): boolean {
  const code =
    error && typeof error === "object" && "code" in error ? String((error as { code?: unknown }).code || "") : "";
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message || "").toLowerCase()
      : "";

  return (
    ["42P01", "42703", "PGRST116", "PGRST204", "PGRST205"].includes(code) ||
    message.includes("could not find the table 'public.testimonials'") ||
    message.includes("schema cache")
  );
}

export function isTestimonialMetricsTableMissing(error: unknown): boolean {
  const code =
    error && typeof error === "object" && "code" in error ? String((error as { code?: unknown }).code || "") : "";
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message || "").toLowerCase()
      : "";

  return (
    ["42P01", "42703", "PGRST116", "PGRST204", "PGRST205"].includes(code) ||
    message.includes("could not find the table 'public.testimonial_metrics'") ||
    message.includes("schema cache")
  );
}

function normalizeFallback(input: Record<string, unknown>): FallbackTestimonial | null {
  if (typeof input.id !== "string" || !input.id) {
    return null;
  }

  const createdAt =
    typeof input.created_at === "string" && input.created_at ? input.created_at : new Date().toISOString();
  const updatedAt =
    typeof input.updated_at === "string" && input.updated_at ? input.updated_at : createdAt;

  return {
    id: input.id,
    quote: typeof input.quote === "string" ? input.quote : "",
    name: typeof input.name === "string" ? input.name : "",
    role: typeof input.role === "string" ? input.role : "",
    image_url: typeof input.image_url === "string" ? input.image_url : null,
    status: input.status === "published" ? "published" : "draft",
    sort_order: typeof input.sort_order === "number" ? input.sort_order : 0,
    author_id: typeof input.author_id === "string" ? input.author_id : null,
    created_at: createdAt,
    updated_at: updatedAt
  };
}

export async function readFallbackTestimonials(): Promise<FallbackTestimonial[]> {
  const supabase = createAdminClient() ?? createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("entity_id,metadata,created_at")
    .eq("action", "testimonial.snapshot")
    .eq("entity_type", "system")
    .order("created_at", { ascending: true })
    .limit(2000);

  if (error || !Array.isArray(data)) {
    return [];
  }

  const snapshotMap = new Map<string, FallbackTestimonial>();

  for (const row of data) {
    const entityId = typeof row.entity_id === "string" ? row.entity_id : "";
    const metadata = row.metadata && typeof row.metadata === "object" ? (row.metadata as Record<string, unknown>) : {};
    const deleted = metadata.deleted === true;
    if (!entityId) {
      continue;
    }
    if (deleted) {
      snapshotMap.delete(entityId);
      continue;
    }

    const payload =
      metadata.testimonial && typeof metadata.testimonial === "object"
        ? (metadata.testimonial as Record<string, unknown>)
        : {};
    const normalized = normalizeFallback({
      id: entityId,
      ...payload,
      created_at:
        typeof payload.created_at === "string" && payload.created_at
          ? payload.created_at
          : typeof row.created_at === "string"
            ? row.created_at
            : new Date().toISOString()
    });

    if (normalized) {
      snapshotMap.set(entityId, normalized);
    }
  }

  return Array.from(snapshotMap.values()).sort(
    (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)
  );
}

export async function writeFallbackSnapshot(params: {
  entityId: string;
  actorId: string;
  actorEmail: string;
  actorRole: "admin" | "mod";
  testimonial?: FallbackTestimonial;
  deleted?: boolean;
}): Promise<void> {
  const supabase = createAdminClient() ?? createClient();
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: params.actorId,
    actor_email: params.actorEmail,
    actor_role: params.actorRole,
    action: "testimonial.snapshot",
    entity_type: "system",
    entity_id: params.entityId,
    metadata: {
      fallback_store: "audit_logs",
      deleted: params.deleted === true,
      testimonial: params.testimonial ?? null
    }
  });

  if (error) {
    throw error;
  }
}

function normalizeMetricFallback(input: Record<string, unknown>): FallbackTestimonialMetric | null {
  if (typeof input.id !== "string" || !input.id) {
    return null;
  }

  const createdAt =
    typeof input.created_at === "string" && input.created_at ? input.created_at : new Date().toISOString();
  const updatedAt =
    typeof input.updated_at === "string" && input.updated_at ? input.updated_at : createdAt;

  return {
    id: input.id,
    value: typeof input.value === "string" ? input.value : "",
    label: typeof input.label === "string" ? input.label : "",
    sort_order: typeof input.sort_order === "number" ? input.sort_order : 0,
    author_id: typeof input.author_id === "string" ? input.author_id : null,
    created_at: createdAt,
    updated_at: updatedAt
  };
}

export async function readFallbackTestimonialMetrics(): Promise<FallbackTestimonialMetric[]> {
  const supabase = createAdminClient() ?? createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("metadata,created_at")
    .eq("action", "testimonial.metrics.snapshot")
    .eq("entity_type", "system")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data || typeof data.metadata !== "object" || data.metadata === null) {
    return [];
  }

  const metadata = data.metadata as Record<string, unknown>;
  const metricsRaw = Array.isArray(metadata.metrics) ? metadata.metrics : [];
  const normalized = metricsRaw
    .map((item, index) =>
      normalizeMetricFallback({
        ...(item && typeof item === "object" ? (item as Record<string, unknown>) : {}),
        id:
          item && typeof item === "object" && typeof (item as Record<string, unknown>).id === "string"
            ? String((item as Record<string, unknown>).id)
            : `metric-${index + 1}`,
        created_at:
          item && typeof item === "object" && typeof (item as Record<string, unknown>).created_at === "string"
            ? String((item as Record<string, unknown>).created_at)
            : typeof data.created_at === "string"
              ? data.created_at
              : new Date().toISOString()
      })
    )
    .filter((item): item is FallbackTestimonialMetric => item !== null)
    .sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));

  return normalized;
}

export async function writeFallbackMetricsSnapshot(params: {
  actorId: string;
  actorEmail: string;
  actorRole: "admin" | "mod";
  metrics: FallbackTestimonialMetric[];
}): Promise<void> {
  const supabase = createAdminClient() ?? createClient();
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: params.actorId,
    actor_email: params.actorEmail,
    actor_role: params.actorRole,
    action: "testimonial.metrics.snapshot",
    entity_type: "system",
    metadata: {
      fallback_store: "audit_logs",
      metrics: params.metrics
    }
  });

  if (error) {
    throw error;
  }
}
