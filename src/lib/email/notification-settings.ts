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
      .eq("key", type)
      .maybeSingle();

    if (!data) return true; // default: enabled
    // value is stored as jsonb — could be true/false or "true"/"false"
    const val = data.value;
    if (typeof val === "boolean") return val;
    if (typeof val === "string") return val !== "false";
    return true;
  } catch {
    // If table doesn't exist or query fails, default to enabled
    return true;
  }
}
