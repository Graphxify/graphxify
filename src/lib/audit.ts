import "server-only";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export type AuditAction =
  | "post.create"
  | "post.update"
  | "post.delete"
  | "post.publish"
  | "work.create"
  | "work.update"
  | "work.delete"
  | "work.publish"
  | "lead.create"
  | "auth.login"
  | "user.role_change"
  | "post.restore"
  | "work.restore";

export type AuditEntity = "post" | "work" | "lead" | "profile" | "system";

export async function logAuditEvent(params: {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: AuditAction;
  entityType: AuditEntity;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    logger.warn("Audit insert skipped because service role key is missing", { action: params.action });
    return;
  }

  const headerStore = headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip") ?? "unknown";
  const userAgent = headerStore.get("user-agent") ?? "unknown";

  const { error } = await admin.from("audit_logs").insert({
    actor_id: params.actorId ?? null,
    actor_email: params.actorEmail ?? null,
    actor_role: params.actorRole ?? null,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    metadata: {
      ...(params.metadata ?? {}),
      server_time: new Date().toISOString()
    },
    ip,
    user_agent: userAgent
  });

  if (error) {
    logger.error("Failed to write audit log", { error: error.message, action: params.action });
  }
}
