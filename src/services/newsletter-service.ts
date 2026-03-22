import "server-only";

import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/provider";
import { newsletterWelcomeTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

type NewsletterInput = {
  email: string;
  source?: string;
};

type StoredSubscriber = {
  id: string;
  email: string;
  status: string | null;
  source: string | null;
  unsubscribe_token: string | null;
};

export type NewsletterEmailResult =
  | { status: "sent" }
  | { status: "failed"; reason: string };

export type NewsletterSubscribeResult = {
  state: "subscribed" | "resubscribed" | "already_subscribed";
  welcomeEmail: NewsletterEmailResult | null;
};

export type NewsletterUnsubscribeResult =
  | { status: "unsubscribed"; email: string }
  | { status: "already_unsubscribed"; email: string }
  | { status: "invalid" };

function getWriteClient() {
  return createAdminClient() ?? createClient();
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function createUnsubscribeToken(): string {
  return randomBytes(24).toString("hex");
}

function getBaseSiteUrl(): string {
  return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
}

function getChecklistUrl(): string {
  return env.NEWSLETTER_CHECKLIST_URL?.trim() || `${getBaseSiteUrl()}/resources/website-growth-checklist`;
}

function getUnsubscribeUrl(token: string): string {
  return `${getBaseSiteUrl()}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

async function sendWelcomeEmail(email: string, unsubscribeToken: string): Promise<NewsletterEmailResult> {
  const template = newsletterWelcomeTemplate({
    checklistUrl: getChecklistUrl(),
    unsubscribeUrl: getUnsubscribeUrl(unsubscribeToken)
  });
  const result = await sendEmail({
    to: email,
    ...template
  });

  if (result.ok) {
    return { status: "sent" };
  }

  return { status: "failed", reason: result.error || "SMTP delivery failed." };
}

async function markWelcomeEmailSent(subscriberId: string): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    return;
  }

  await admin
    .from("newsletter_subscribers")
    .update({
      welcome_email_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", subscriberId);
}

async function subscribeWithAdmin(input: NewsletterInput): Promise<NewsletterSubscribeResult> {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Admin Supabase client is unavailable.");
  }

  const email = input.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const source = input.source ?? "blog";

  const { data: existing, error: existingError } = await admin
    .from("newsletter_subscribers")
    .select("id,email,status,source,unsubscribe_token")
    .eq("email", email)
    .maybeSingle<StoredSubscriber>();

  if (existingError) {
    logger.error("Newsletter subscriber lookup failed", {
      route: "newsletter.subscribe.lookup",
      error: existingError.message,
      code: existingError.code ?? null
    });
    throw existingError;
  }

  if (existing && existing.status !== "unsubscribed") {
    return { state: "already_subscribed", welcomeEmail: null };
  }

  const unsubscribeToken = createUnsubscribeToken();
  let subscriberId = existing?.id ?? "";
  let state: NewsletterSubscribeResult["state"] = "subscribed";

  if (existing?.id) {
    state = "resubscribed";
    const { error } = await admin
      .from("newsletter_subscribers")
      .update({
        status: "subscribed",
        source,
        unsubscribe_token: unsubscribeToken,
        subscribed_at: now,
        unsubscribed_at: null,
        updated_at: now
      })
      .eq("id", existing.id);

    if (error) {
      logger.error("Newsletter resubscribe failed", {
        route: "newsletter.subscribe.update",
        error: error.message,
        code: error.code ?? null
      });
      throw error;
    }

    subscriberId = existing.id;
  } else {
    const { data, error } = await admin
      .from("newsletter_subscribers")
      .insert({
        email,
        source,
        status: "subscribed",
        unsubscribe_token: unsubscribeToken,
        subscribed_at: now,
        created_at: now,
        updated_at: now
      })
      .select("id")
      .single();

    if (error) {
      logger.error("Newsletter subscribe insert failed", {
        route: "newsletter.subscribe.insert",
        error: error.message,
        code: error.code ?? null
      });
      throw error;
    }

    subscriberId = String(data.id);
  }

  const welcomeEmail = await sendWelcomeEmail(email, unsubscribeToken);
  if (welcomeEmail.status === "sent") {
    await markWelcomeEmailSent(subscriberId);
  } else {
    logger.warn("Newsletter welcome email failed", {
      route: "newsletter.welcome",
      email,
      reason: welcomeEmail.reason
    });
  }

  return { state, welcomeEmail };
}

async function subscribeWithoutAdmin(input: NewsletterInput): Promise<NewsletterSubscribeResult> {
  const client = getWriteClient();
  const email = normalizeEmail(input.email);
  const unsubscribeToken = createUnsubscribeToken();
  const now = new Date().toISOString();

  const { error } = await client.from("newsletter_subscribers").insert({
    email,
    source: input.source ?? "blog",
    status: "subscribed",
    unsubscribe_token: unsubscribeToken,
    subscribed_at: now,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  if (!error) {
    const welcomeEmail = await sendWelcomeEmail(email, unsubscribeToken);
    if (welcomeEmail.status === "failed") {
      logger.warn("Newsletter welcome email failed", {
        route: "newsletter.welcome",
        email,
        reason: welcomeEmail.reason
      });
    }
    return { state: "subscribed", welcomeEmail };
  }

  if (error.code === "23505") {
    return { state: "already_subscribed", welcomeEmail: null };
  }

  logger.error("Newsletter subscription failed", {
    route: "newsletter.subscribe",
    error: error.message,
    code: error.code ?? null
  });
  throw error;
}

export async function subscribeToNewsletter(input: NewsletterInput): Promise<NewsletterSubscribeResult> {
  const admin = createAdminClient();
  if (admin) {
    return subscribeWithAdmin(input);
  }

  return subscribeWithoutAdmin(input);
}

export async function unsubscribeFromNewsletter(token: string): Promise<NewsletterUnsubscribeResult> {
  const unsubscribeToken = token.trim();
  if (!unsubscribeToken) {
    return { status: "invalid" };
  }

  const admin = createAdminClient();
  if (!admin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for newsletter unsubscribe.");
  }

  const { data, error } = await admin
    .from("newsletter_subscribers")
    .select("id,email,status")
    .eq("unsubscribe_token", unsubscribeToken)
    .maybeSingle();

  if (error) {
    logger.error("Newsletter unsubscribe lookup failed", {
      route: "newsletter.unsubscribe.lookup",
      error: error.message,
      code: error.code ?? null
    });
    throw error;
  }

  if (!data) {
    return { status: "invalid" };
  }

  const email = String(data.email ?? "");
  if (String(data.status ?? "subscribed") === "unsubscribed") {
    return { status: "already_unsubscribed", email };
  }

  const { error: updateError } = await admin
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", data.id);

  if (updateError) {
    logger.error("Newsletter unsubscribe update failed", {
      route: "newsletter.unsubscribe.update",
      error: updateError.message,
      code: updateError.code ?? null
    });
    throw updateError;
  }

  return { status: "unsubscribed", email };
}
