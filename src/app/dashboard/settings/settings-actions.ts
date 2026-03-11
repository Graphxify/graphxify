"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/requireRole";
import { verifySmtp, sendEmail } from "@/lib/email/provider";
import { testEmailTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

/* ── Helpers ── */

async function getWriteClient() {
  return createAdminClient() ?? createClient();
}

async function getSetting(key: string): Promise<Record<string, unknown>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("cms_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value as Record<string, unknown>) ?? {};
}

async function setSetting(key: string, value: Record<string, unknown>): Promise<void> {
  const client = await getWriteClient();
  const { error } = await client
    .from("cms_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

/* ── Load all settings ── */

export async function loadAllSettings() {
  await requireRole(["admin"]);
  const supabase = createClient();
  const { data } = await supabase.from("cms_settings").select("key,value");

  const map: Record<string, Record<string, unknown>> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value as Record<string, unknown>;
  }
  return map;
}

/* ── General settings ── */

export async function saveGeneralSettingsAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireRole(["admin"]);
    const value = {
      site_name: String(formData.get("site_name") || "").trim(),
      site_url: String(formData.get("site_url") || "").trim(),
      support_email: String(formData.get("support_email") || "").trim(),
      contact_email: String(formData.get("contact_email") || "").trim(),
      company_name: String(formData.get("company_name") || "").trim(),
      company_address: String(formData.get("company_address") || "").trim(),
      timezone: String(formData.get("timezone") || "").trim(),
      language: String(formData.get("language") || "").trim()
    };
    await setSetting("general", value);
    revalidatePath("/dashboard/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function saveSocialLinksAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireRole(["admin"]);
    const value = {
      instagram: String(formData.get("instagram") || "").trim(),
      linkedin: String(formData.get("linkedin") || "").trim(),
      twitter: String(formData.get("twitter") || "").trim(),
      behance: String(formData.get("behance") || "").trim(),
      dribbble: String(formData.get("dribbble") || "").trim(),
      tiktok: String(formData.get("tiktok") || "").trim(),
      facebook: String(formData.get("facebook") || "").trim()
    };
    await setSetting("social_links", value);
    revalidatePath("/dashboard/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

/* ── Email settings ── */

export async function saveEmailNotificationsAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireRole(["admin"]);
    const value = {
      contact_form: formData.get("contact_form") === "on",
      review_submission: formData.get("review_submission") === "on",
      new_lead: formData.get("new_lead") === "on",
      user_invitation: formData.get("user_invitation") === "on",
      password_reset: formData.get("password_reset") === "on"
    };
    await setSetting("email_notifications", value);
    revalidatePath("/dashboard/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function testSmtpAction(): Promise<{ ok: boolean; message: string }> {
  try {
    await requireRole(["admin"]);
    const verification = await verifySmtp();
    if (!verification.ok) return { ok: false, message: verification.message };

    const recipient = env.OWNER_NOTIFY_EMAIL || "info@graphxify.com";
    const template = testEmailTemplate();
    const result = await sendEmail({ to: recipient, ...template });
    if (!result.ok) return { ok: false, message: result.error || "Send failed" };
    return { ok: true, message: `Test email sent to ${recipient}` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Failed" };
  }
}

/* ── Security settings ── */

export async function saveSecuritySettingsAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireRole(["admin"]);
    const value = {
      require_strong_passwords: formData.get("require_strong_passwords") === "on",
      session_timeout_hours: Number(formData.get("session_timeout_hours") || 24),
      login_rate_limit: Number(formData.get("login_rate_limit") || 10),
      enable_2fa: formData.get("enable_2fa") === "on"
    };
    await setSetting("security", value);
    revalidatePath("/dashboard/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

/* ── Integration settings ── */

export async function saveIntegrationsAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireRole(["admin"]);
    const value = {
      google_analytics_id: String(formData.get("google_analytics_id") || "").trim(),
      google_tag_manager_id: String(formData.get("google_tag_manager_id") || "").trim(),
      meta_pixel_id: String(formData.get("meta_pixel_id") || "").trim(),
      hotjar_id: String(formData.get("hotjar_id") || "").trim()
    };
    await setSetting("integrations", value);
    revalidatePath("/dashboard/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

/* ── Danger zone ── */

export async function dangerDeletePendingReviewsAction(): Promise<{ ok: boolean; message: string }> {
  try {
    await requireRole(["admin"]);
    const client = await getWriteClient();
    const { count, error } = await client
      .from("testimonials")
      .delete({ count: "exact" })
      .eq("status", "pending");
    if (error) throw error;
    logger.info("Deleted pending reviews", { count });
    revalidatePath("/dashboard/settings");
    return { ok: true, message: `Deleted ${count ?? 0} pending reviews` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Failed" };
  }
}

export async function dangerResetSettingsAction(): Promise<{ ok: boolean; message: string }> {
  try {
    await requireRole(["admin"]);
    const client = await getWriteClient();
    await client.from("cms_settings").delete().neq("key", "__never__");
    // Re-seed defaults
    await client.from("cms_settings").upsert([
      { key: "general", value: { site_name: "Graphxify", site_url: "https://graphxify.com", support_email: "info@graphxify.com", contact_email: "info@graphxify.com", company_name: "Graphxify", company_address: "", timezone: "America/Toronto", language: "en" } },
      { key: "social_links", value: { instagram: "https://www.instagram.com/graphxify", linkedin: "", twitter: "", behance: "https://www.behance.net/graphxify", dribbble: "", tiktok: "https://www.tiktok.com/@graphxify", facebook: "https://www.facebook.com/Graphxify" } },
      { key: "email_notifications", value: { contact_form: true, review_submission: true, new_lead: true, user_invitation: true, password_reset: true } },
      { key: "security", value: { require_strong_passwords: true, session_timeout_hours: 24, login_rate_limit: 10, enable_2fa: false } },
      { key: "integrations", value: { google_analytics_id: "", google_tag_manager_id: "", meta_pixel_id: "", hotjar_id: "" } }
    ]);
    logger.info("CMS settings reset to defaults");
    revalidatePath("/dashboard/settings");
    return { ok: true, message: "All settings reset to defaults" };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Failed" };
  }
}
