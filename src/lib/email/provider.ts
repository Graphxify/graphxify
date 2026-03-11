import "server-only";

import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const DEFAULT_FROM = "Graphxify <info@graphxify.com>";

function getFrom(): string {
  return env.SMTP_FROM || DEFAULT_FROM;
}

function createTransport(): nodemailer.Transporter | null {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
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
  const transport = getTransport();
  if (!transport) {
    return { ok: false, message: "SMTP not configured (missing SMTP_HOST/PORT/USER/PASS)" };
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
  const transport = getTransport();

  if (!transport) {
    logger.info("[Email fallback] SMTP not configured → console", {
      to: input.to,
      subject: input.subject,
      preview: input.text.slice(0, 120)
    });
    return { ok: true };
  }

  try {
    await transport.sendMail({
      from: getFrom(),
      to: input.to,
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
