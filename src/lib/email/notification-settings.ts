import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Notification toggle keys stored in cms_settings.
 * These correspond to the toggles on the Settings → Email tab.
 */
export type NotificationType =
  | "notify_contact_form"
  | "notify_review_submissions"
  | "notify_leads"
  | "notify_user_invites"
  | "notify_password_resets";

const NOTIFICATION_KEY_MAP: Record<NotificationType, string> = {
  notify_contact_form: "contact_form",
  notify_review_submissions: "review_submission",
  notify_leads: "new_lead",
  notify_user_invites: "user_invitation",
  notify_password_resets: "password_reset"
};

/**
 * Check whether a specific notification type is enabled.
 * Returns true by default if the setting does not exist in the database
 * (fail-open so existing email flows keep working).
 */
export async function isNotificationEnabled(type: NotificationType): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("cms_settings")
      .select("value")
      .eq("key", "email_notifications")
      .maybeSingle();

    if (!data) return true; // default: enabled
    // value is stored as jsonb — could be true/false or "true"/"false"
    const settings = data.value as Record<string, unknown> | null;
    const val = settings?.[NOTIFICATION_KEY_MAP[type]];
    if (typeof val === "boolean") return val;
    if (typeof val === "string") return val !== "false";
    return true;
  } catch {
    // If table doesn't exist or query fails, default to enabled
    return true;
  }
}
