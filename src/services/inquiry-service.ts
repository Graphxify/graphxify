import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inquirySchema } from "@/lib/validation/schemas";
import { logAuditEvent } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

const FALLBACK_EMAIL = "hello@graphxify.com";

type InquiryPayload = {
  name: string;
  email: string;
  company: string;
  website?: string;
  services: string[];
  timeline: string;
  budget: string;
  details: string;
  source: "homepage" | "contact";
};

export type InquiryResult =
  | { mode: "stored"; id: string }
  | { mode: "mailto"; mailtoUrl: string; reason: string };

function buildMailtoUrl(payload: InquiryPayload): string {
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company/Team: ${payload.company}`,
    `Website: ${payload.website || "N/A"}`,
    `Services: ${payload.services.join(", ")}`,
    `Timeline: ${payload.timeline}`,
    `Budget: ${payload.budget}`,
    "",
    "Project details:",
    payload.details,
    "",
    `Source: ${payload.source}`
  ];

  const subject = encodeURIComponent(`New inquiry - ${payload.company}`);
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
}

export async function createInquiry(payload: unknown): Promise<InquiryResult> {
  const parsed = inquirySchema.parse(payload);
  const normalizedPayload: InquiryPayload = {
    ...parsed,
    website: parsed.website || ""
  };

  const hasSupabaseKeys = Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY);
  if (!hasSupabaseKeys) {
    return {
      mode: "mailto",
      mailtoUrl: buildMailtoUrl(normalizedPayload),
      reason: "supabase_not_configured"
    };
  }

  const admin = createAdminClient();
  const supabase = admin ?? createClient();

  try {
    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name: normalizedPayload.name,
        email: normalizedPayload.email,
        company: normalizedPayload.company,
        website: normalizedPayload.website || null,
        services: normalizedPayload.services,
        timeline: normalizedPayload.timeline,
        budget: normalizedPayload.budget,
        details: normalizedPayload.details,
        source: normalizedPayload.source
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    await logAuditEvent({
      actorId: null,
      actorEmail: normalizedPayload.email,
      actorRole: "public",
      action: "lead.create",
      entityType: "lead",
      entityId: data.id,
      metadata: {
        channel: "inquiry",
        source: normalizedPayload.source,
        services: normalizedPayload.services,
        timeline: normalizedPayload.timeline,
        budget: normalizedPayload.budget
      }
    });

    return { mode: "stored", id: data.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    logger.warn("Inquiry insert failed, falling back to mailto", { error: message });

    return {
      mode: "mailto",
      mailtoUrl: buildMailtoUrl(normalizedPayload),
      reason: message
    };
  }
}
