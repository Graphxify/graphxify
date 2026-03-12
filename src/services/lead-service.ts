import "server-only";

import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit";
import { sendEmail } from "@/lib/email/provider";
import { isNotificationEnabled } from "@/lib/email/notification-settings";
import { leadNotificationTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { leadSchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";

export async function createLead(payload: unknown): Promise<{ id: string }> {
  const parsed = leadSchema.parse(payload);
  const { name, email, message, attachments } = parsed;
  const supabase = createClient();

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
        metadata: { source: "public_contact", attachments: attachments ?? [] }
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
