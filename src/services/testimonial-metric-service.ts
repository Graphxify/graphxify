import "server-only";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/requireRole";
import { logAuditEvent } from "@/lib/audit";
import {
  isTestimonialMetricsTableMissing,
  writeFallbackMetricsSnapshot,
  type FallbackTestimonialMetric
} from "@/lib/testimonial-fallback";
import { testimonialMetricsSchema } from "@/lib/validation/schemas";

type MetricsClient = ReturnType<typeof createClient> | NonNullable<ReturnType<typeof createAdminClient>>;

function getWriteClient(): MetricsClient {
  return createAdminClient() ?? createClient();
}

function toValidUuid(id?: string): string {
  if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  return randomUUID();
}

function toMetricRow(params: {
  profileId: string;
  value: string;
  label: string;
  sort_order: number;
  id?: string;
  created_at?: string;
}): FallbackTestimonialMetric {
  const createdAt = params.created_at || new Date().toISOString();
  return {
    id: toValidUuid(params.id),
    value: params.value,
    label: params.label,
    sort_order: params.sort_order,
    author_id: params.profileId,
    created_at: createdAt,
    updated_at: new Date().toISOString()
  };
}

export async function saveTestimonialMetrics(payload: unknown): Promise<{ count: number }> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "mod")) {
    throw new Error("Forbidden");
  }

  const parsed = testimonialMetricsSchema.parse(payload);
  const rows = parsed.metrics
    .map((metric, index) =>
      toMetricRow({
        profileId: profile.id,
        value: metric.value,
        label: metric.label,
        sort_order: metric.sort_order ?? index,
        id: metric.id
      })
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const supabase = getWriteClient();

  try {
    const { data: existing, error: fetchError } = await supabase.from("testimonial_metrics").select("id");
    if (fetchError) {
      throw fetchError;
    }

    const ids = (existing ?? []).map((item) => item.id).filter((id): id is string => typeof id === "string");
    if (ids.length > 0) {
      const { error: deleteError } = await supabase.from("testimonial_metrics").delete().in("id", ids);
      if (deleteError) {
        throw deleteError;
      }
    }

    const { error: insertError } = await supabase.from("testimonial_metrics").insert(
      rows.map((row) => ({
        id: row.id,
        value: row.value,
        label: row.label,
        sort_order: row.sort_order,
        author_id: row.author_id
      }))
    );

    if (insertError) {
      throw insertError;
    }
  } catch (error) {
    if (!isTestimonialMetricsTableMissing(error)) {
      throw error;
    }
    await writeFallbackMetricsSnapshot({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      metrics: rows
    });
  }

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: "testimonial.update",
    entityType: "system",
    metadata: {
      section: "testimonial_metrics",
      count: rows.length
    }
  });

  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/dashboard/testimonials/metrics");

  return { count: rows.length };
}
