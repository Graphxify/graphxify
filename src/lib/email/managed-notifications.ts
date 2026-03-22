import "server-only";

import { sendEmail } from "@/lib/email/provider";
import { isNotificationEnabled } from "@/lib/email/notification-settings";
import { passwordResetTemplate, userInvitationTemplate } from "@/lib/email/templates";
import { logger } from "@/lib/logger";

export async function sendBrandedUserInvitationEmail(input: {
  inviteeName: string;
  inviteeEmail: string;
  role: string;
  invitedBy: string;
}): Promise<void> {
  const enabled = await isNotificationEnabled("notify_user_invites");
  if (!enabled) {
    return;
  }

  const template = userInvitationTemplate(input);
  const result = await sendEmail({ to: input.inviteeEmail, ...template });
  if (!result.ok) {
    logger.error("Branded user invitation email failed", {
      recipient: input.inviteeEmail,
      reason: result.error || "SMTP delivery failed."
    });
  }
}

export async function sendBrandedPasswordResetEmail(recipientEmail: string): Promise<void> {
  const enabled = await isNotificationEnabled("notify_password_resets");
  if (!enabled) {
    return;
  }

  const template = passwordResetTemplate({ recipientEmail });
  const result = await sendEmail({ to: recipientEmail, ...template });
  if (!result.ok) {
    logger.error("Branded password reset email failed", {
      recipient: recipientEmail,
      reason: result.error || "SMTP delivery failed."
    });
  }
}
