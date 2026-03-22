import "server-only";

import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

const DEFAULT_FROM = "Graphxify Website <info@graphxify.com>";

function getFrom(): string {
  return env.SMTP_FROM || DEFAULT_FROM;
}

function getPrimaryEmailAddress(value: string | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  const match = trimmed.match(/<([^>]+)>/);
  const email = match?.[1] ?? trimmed;
  return email.trim().toLowerCase() || null;
}

function isHostingerHost(host: string | undefined): boolean {
  return typeof host === "string" && host.toLowerCase().includes("hostinger.com");
}

export function diagnoseEmailConfiguration(recipient?: string): { ok: boolean; message?: string } {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
    return { ok: false, message: "SMTP not configured (missing SMTP_HOST/PORT/USER/PASS)" };
  }

  const port = Number(env.SMTP_PORT);
  if (!Number.isInteger(port) || port <= 0) {
    return { ok: false, message: "SMTP_PORT must be a valid positive integer." };
  }

  if (!recipient) {
    return { ok: true };
  }

  const normalizedRecipient = getPrimaryEmailAddress(recipient);
  const normalizedFrom = getPrimaryEmailAddress(getFrom());
  const normalizedUser = getPrimaryEmailAddress(env.SMTP_USER);

  if (
    isHostingerHost(env.SMTP_HOST) &&
    normalizedRecipient &&
    (normalizedRecipient === normalizedFrom || normalizedRecipient === normalizedUser)
  ) {
    return {
      ok: false,
      message:
        "Hostinger SMTP is configured to send notifications to the same mailbox used as the sender. Set OWNER_NOTIFY_EMAIL to a different mailbox or use a different SMTP_FROM mailbox."
    };
  }

  return { ok: true };
}

function createTransport(): nodemailer.Transporter | null {
  const diagnosis = diagnoseEmailConfiguration();
  if (!diagnosis.ok) {
    return null;
  }

  const port = Number(env.SMTP_PORT);

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000
  });
}

let cachedTransport: nodemailer.Transporter | null | undefined;

function getTransport(): nodemailer.Transporter | null {
  if (cachedTransport === undefined) {
    cachedTransport = createTransport();
  }
  return cachedTransport;
}

/**
 * Verify SMTP connection. Returns { ok, message }.
 */
export async function verifySmtp(): Promise<{ ok: boolean; message: string }> {
  const diagnosis = diagnoseEmailConfiguration();
  if (!diagnosis.ok) {
    return { ok: false, message: diagnosis.message || "SMTP configuration is invalid." };
  }

  const transport = getTransport();
  if (!transport) {
    return { ok: false, message: "SMTP transport could not be created." };
  }

  try {
    await transport.verify();
    return { ok: true, message: "SMTP connection verified" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logger.error("SMTP verification failed", { error: msg });
    return { ok: false, message: `SMTP verification failed: ${msg}` };
  }
}

/**
 * Send an email via Hostinger SMTP and fall back to console logging
 * in development if SMTP is not configured.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; error?: string }> {
  const diagnosis = diagnoseEmailConfiguration(input.to);
  if (!diagnosis.ok) {
    logger.error("Email send blocked by configuration", {
      to: input.to,
      subject: input.subject,
      reason: diagnosis.message
    });
    return { ok: false, error: diagnosis.message || "Email configuration is invalid." };
  }

  const transport = getTransport();

  if (!transport) {
    const error = "SMTP transport is unavailable.";
    logger.info("[Email fallback] SMTP not configured → console", {
      to: input.to,
      subject: input.subject,
      preview: input.text.slice(0, 120)
    });
    return { ok: false, error };
  }

  try {
    await transport.sendMail({
      from: getFrom(),
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html
    });
    logger.info("Email sent", { to: input.to, subject: input.subject });
    return { ok: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    logger.error("Email send failed", {
      error: msg,
      to: input.to,
      subject: input.subject
    });
    return { ok: false, error: msg };
  }
}
