import "server-only";

import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { withTimeout } from "@/lib/utils";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type Provider = {
  send: (input: SendEmailInput) => Promise<void>;
};

function createResendProvider(): Provider | null {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  return {
    async send(input) {
      await resend.emails.send({
        from: "Graphxify <no-reply@graphxify.local>",
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html
      });
    }
  };
}

function createSmtpProvider(): Provider | null {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  return {
    async send(input) {
      await transport.sendMail({
        from: "Graphxify <no-reply@graphxify.local>",
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html
      });
    }
  };
}

function createConsoleProvider(): Provider {
  return {
    async send(input) {
      logger.info("Email fallback provider", {
        to: input.to,
        subject: input.subject,
        preview: input.text.slice(0, 120)
      });
    }
  };
}

const provider = createResendProvider() ?? createSmtpProvider() ?? createConsoleProvider();

export async function sendEmail(input: SendEmailInput): Promise<void> {
  try {
    await withTimeout(provider.send(input), 2500);
  } catch (error) {
    logger.error("Email send failed", {
      error: error instanceof Error ? error.message : "unknown",
      to: input.to,
      subject: input.subject
    });
  }
}
