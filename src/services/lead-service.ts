import "server-only";

import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit";
import { sendEmail } from "@/lib/email/provider";
import { leadNotificationTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { leadSchema } from "@/lib/validation/schemas";

export async function createLead(payload: unknown): Promise<{ id: string }> {
  const parsed = leadSchema.parse(payload);
  const supabase = createClient();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: parsed.name,
      email: parsed.email,
      message: parsed.message
    })
    .select("id,created_at")
    .single();

  if (error) {
    throw error;
  }

  await logAuditEvent({
    actorId: null,
    actorEmail: parsed.email,
    actorRole: "public",
    action: "lead.create",
    entityType: "lead",
    entityId: data.id,
    metadata: { source: "public_contact" }
  });

  if (env.OWNER_NOTIFY_EMAIL) {
    const template = leadNotificationTemplate({
      name: parsed.name,
      email: parsed.email,
      message: parsed.message,
      createdAt: data.created_at
    });
    await sendEmail({ to: env.OWNER_NOTIFY_EMAIL, ...template });
  }

  return { id: data.id };
}
