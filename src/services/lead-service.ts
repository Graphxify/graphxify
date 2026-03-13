import "server-only";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditEvent } from "@/lib/audit";
import { sendEmail } from "@/lib/email/provider";
import { isNotificationEnabled } from "@/lib/email/notification-settings";
import { leadNotificationTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { leadSchema, publicLeadSchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";

const LEAD_SERVICE_LABELS: Record<string, string> = {
  "brand-systems": "Brand Systems",
  "web-design": "Web Design",
  "web-development": "Web Development",
  "cms-architecture": "CMS Architecture",
  "something-else": "Something Else"
};

export type PublicLeadInput = z.infer<typeof publicLeadSchema>;

function getWriteClient() {
  return createAdminClient() ?? createClient();
}

function formatLeadNeed(value: string): string {
  return LEAD_SERVICE_LABELS[value] ?? value;
}

function buildStoredLeadMessage(payload: PublicLeadInput): string {
  const needs = payload.intakeNeeds.map(formatLeadNeed).join(", ") || "Not specified";
  const userMessage = payload.message?.trim() ?? "";

  const lines = [
    payload.source === "contact" ? "Contact Inquiry" : "Quick Start Inquiry",
    `Services: ${needs}`,
    payload.customRequest ? `Custom request: ${payload.customRequest}` : null,
    payload.company ? `Company / Brand: ${payload.company}` : null,
    payload.website ? `Website / Link: ${payload.website}` : null,
    payload.budgetRange ? `Budget range: ${payload.budgetRange}` : null,
    payload.timeline ? `Timeline: ${payload.timeline}` : null,
    userMessage ? `\nMessage:\n${userMessage}` : null
  ].filter((line): line is string => line !== null);

  return lines.join("\n").slice(0, 2000);
}

export async function createLead(payload: PublicLeadInput): Promise<{ id: string }> {
  const parsedPublic = publicLeadSchema.parse(payload);
  const compiledPayload = leadSchema.parse({
    name: parsedPublic.name,
    email: parsedPublic.email,
    message: buildStoredLeadMessage(parsedPublic),
    attachments: parsedPublic.attachments
  });
  const { name, email, message, attachments } = compiledPayload;
  const supabase = getWriteClient();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      name,
      email,
      message
    })
    .select("id,created_at")
    .single();

  if (error) {
    throw error;
  }

  // Fire-and-forget: audit log + email notification
  // These are non-critical — don't block the API response
  void (async () => {
    try {
      await logAuditEvent({
        actorId: null,
        actorEmail: email,
        actorRole: "public",
        action: "lead.create",
        entityType: "lead",
        entityId: data.id,
        metadata: {
          source: parsedPublic.source,
          intake_needs: parsedPublic.intakeNeeds,
          custom_request: parsedPublic.customRequest || null,
          attachments: attachments ?? []
        }
      });
    } catch (err) {
      logger.error("Audit log failed for lead", { error: err instanceof Error ? err.message : "unknown" });
    }

    try {
      if (env.OWNER_NOTIFY_EMAIL && await isNotificationEnabled("notify_leads")) {
        const template = leadNotificationTemplate({
          name,
          email,
          message,
          createdAt: data.created_at,
          attachments: attachments ?? []
        });
        void sendEmail({ to: env.OWNER_NOTIFY_EMAIL, ...template });
      }
    } catch (err) {
      logger.error("Email notification failed for lead", { error: err instanceof Error ? err.message : "unknown" });
    }
  })();

  return { id: data.id };
}
