import "server-only";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditEvent } from "@/lib/audit";
import { sendEmail } from "@/lib/email/provider";
import { rateLimit } from "@/lib/rate-limit";
import { isNotificationEnabled } from "@/lib/email/notification-settings";
import { leadAutoReplyTemplate, leadNotificationTemplate } from "@/lib/email/templates";
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
export type LeadNotificationResult =
  | { status: "sent" }
  | { status: "disabled" }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

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

export async function createLead(payload: PublicLeadInput): Promise<{ id: string; notification: LeadNotificationResult }> {
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

  const notificationType = parsedPublic.source === "contact" ? "notify_contact_form" : "notify_leads";
  let notification: LeadNotificationResult = { status: "disabled" };

  try {
    const enabled = await isNotificationEnabled(notificationType);
    if (!enabled) {
      notification = { status: "disabled" };
    } else if (!env.OWNER_NOTIFY_EMAIL) {
      notification = { status: "skipped", reason: "OWNER_NOTIFY_EMAIL is not configured." };
    } else {
      const template = leadNotificationTemplate({
        name,
        email,
        message,
        createdAt: data.created_at,
        attachments: attachments ?? []
      });
      const emailResult = await sendEmail({
        to: env.OWNER_NOTIFY_EMAIL,
        replyTo: email,
        ...template
      });
      notification = emailResult.ok
        ? { status: "sent" }
        : { status: "failed", reason: emailResult.error || "SMTP delivery failed." };
    }
  } catch (err) {
    notification = {
      status: "failed",
      reason: err instanceof Error ? err.message : "Unknown notification error."
    };
  }

  if (notification.status === "failed" || notification.status === "skipped") {
    logger.error("Lead notification failed", {
      leadId: data.id,
      source: parsedPublic.source,
      reason: notification.reason
    });
  }

  // Branded auto-reply to the person who submitted the form. Best-effort: a
  // failure here must never affect the saved lead or the owner notification,
  // so it's isolated in its own try/catch and its result is not surfaced.
  //
  // SECURITY: the recipient address is attacker-controlled, so an unguarded
  // auto-reply is an email-reflection/bombing vector (submit repeatedly with a
  // victim's address, or rotate addresses to abuse our SMTP). Gate it on two
  // rate limits before sending:
  //   • per-recipient — at most one auto-reply per email address per hour, so a
  //     single victim can't be bombed by repeated submissions;
  //   • global cap — a ceiling on total auto-replies per hour to protect SMTP
  //     reputation/quota against distributed abuse.
  // (These are backed by Upstash when configured; CAPTCHA on the form is the
  // stronger defense and remains a recommended follow-up.)
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const [perRecipient, globalCap] = await Promise.all([
      rateLimit({ key: normalizedEmail, route: "lead-autoreply", limit: 1, windowSec: 3600 }),
      rateLimit({ key: "all", route: "lead-autoreply-global", limit: 60, windowSec: 3600 })
    ]);

    if (!perRecipient.allowed || !globalCap.allowed) {
      logger.warn("Lead auto-reply suppressed by rate limit", {
        leadId: data.id,
        reason: perRecipient.allowed ? "global-cap" : "per-recipient"
      });
    } else {
      const autoReply = leadAutoReplyTemplate({ name });
      const autoReplyResult = await sendEmail({
        to: email,
        replyTo: env.OWNER_NOTIFY_EMAIL || undefined,
        ...autoReply
      });
      if (!autoReplyResult.ok) {
        logger.warn("Lead auto-reply not delivered", {
          leadId: data.id,
          reason: autoReplyResult.error
        });
      }
    }
  } catch (err) {
    logger.error("Lead auto-reply failed", {
      leadId: data.id,
      error: err instanceof Error ? err.message : "unknown"
    });
  }

  return { id: data.id, notification };
}
