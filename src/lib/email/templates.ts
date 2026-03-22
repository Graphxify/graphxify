/* ── Graphxify branded email templates ── */

const BRAND_COLOR = "#00A3FF";
const BRAND_BG = "#0d0d0f";
const CARD_BG = "#151518";
const TEXT_COLOR = "#f2f0eb";
const MUTED_COLOR = "#a0a0a0";
const BORDER_COLOR = "#2a2a2e";
const LOGO_TEXT = "Graphxify";

function baseLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND_BG};font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:26px;font-weight:700;color:${TEXT_COLOR};letter-spacing:-0.02em;">${LOGO_TEXT}</span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:${CARD_BG};border:1px solid ${BORDER_COLOR};border-radius:12px;padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:${MUTED_COLOR};">
                © ${new Date().getFullYear()} Graphxify · <a href="https://graphxify.com" style="color:${BRAND_COLOR};text-decoration:none;">graphxify.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function h2(text: string): string {
  return `<h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:${TEXT_COLOR};">${text}</h2>`;
}

function field(label: string, value: string): string {
  return `<p style="margin:0 0 8px;font-size:14px;color:${TEXT_COLOR};"><strong style="color:${MUTED_COLOR};">${label}:</strong> ${escapeHtml(value)}</p>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${BORDER_COLOR};margin:20px 0;" />`;
}

function ctaButton(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="background:${BRAND_COLOR};border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${text}</a>
      </td>
    </tr>
  </table>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
}

/* ── Contact Form / Lead Notification ── */

export function leadNotificationTemplate(input: {
  name: string;
  email: string;
  message: string;
  createdAt: string;
  attachments?: string[];
}) {
  const attachmentLinks = (input.attachments ?? [])
    .map((url) => {
      const fileName = decodeURIComponent(url.split("/").pop()?.replace(/^\d+-[a-z0-9]+-/, "") ?? "file");
      const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(url);

      if (isImage) {
        return `<div style="margin:6px 0;">
          <a href="${escapeHtml(url)}" target="_blank" style="text-decoration:none;">
            <img src="${escapeHtml(url)}" alt="${escapeHtml(fileName)}" style="max-width:200px;max-height:140px;border-radius:8px;border:1px solid ${BORDER_COLOR};" />
          </a>
          <br/><a href="${escapeHtml(url)}" target="_blank" style="font-size:12px;color:${BRAND_COLOR};text-decoration:none;">${escapeHtml(fileName)}</a>
        </div>`;
      }

      return `<p style="margin:4px 0;font-size:13px;">
        📎 <a href="${escapeHtml(url)}" target="_blank" style="color:${BRAND_COLOR};text-decoration:none;">${escapeHtml(fileName)}</a>
      </p>`;
    })
    .join("");

  const attachmentSection =
    attachmentLinks.length > 0
      ? `${divider()}
         <p style="margin:0 0 8px;font-size:12px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:0.05em;">Attachments</p>
         ${attachmentLinks}`
      : "";

  const body = `
    ${h2("New Contact Inquiry")}
    ${field("Name", input.name)}
    ${field("Email", input.email)}
    ${divider()}
    <p style="margin:0 0 4px;font-size:12px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:0.05em;">Message</p>
    <p style="margin:0;font-size:14px;color:${TEXT_COLOR};line-height:1.6;white-space:pre-wrap;">${escapeHtml(input.message)}</p>
    ${attachmentSection}
    ${divider()}
    <p style="margin:0;font-size:12px;color:${MUTED_COLOR};">Submitted ${formatDate(input.createdAt)}</p>
  `;

  const attachmentText = (input.attachments ?? []).length > 0
    ? `\nAttachments:\n${(input.attachments ?? []).join("\n")}`
    : "";

  return {
    subject: `New inquiry from ${input.name}`,
    text: `New contact inquiry\nName: ${input.name}\nEmail: ${input.email}\nMessage: ${input.message}${attachmentText}\nCreated: ${input.createdAt}`,
    html: baseLayout("New Contact Inquiry", body)
  };
}

/* ── Newsletter Welcome / Checklist Delivery ── */

export function newsletterWelcomeTemplate(input: {
  checklistUrl: string;
  unsubscribeUrl: string;
}) {
  const body = `
    ${h2("Your Website Growth Checklist Is Ready")}
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      Thanks for subscribing to the Graphxify newsletter. Your checklist is ready below, and we'll also send occasional practical insights on web design, branding, local SEO, and digital strategy.
    </p>
    ${ctaButton("Open the Checklist", escapeHtml(input.checklistUrl))}
    ${divider()}
    <p style="margin:0 0 12px;font-size:12px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:0.05em;">What you'll get</p>
    <ul style="margin:0 0 18px;padding-left:18px;color:${TEXT_COLOR};font-size:14px;line-height:1.7;">
      <li>Website conversion essentials</li>
      <li>Brand and messaging checks for service businesses</li>
      <li>Local SEO and trust signals that help convert visitors</li>
    </ul>
    <p style="margin:0;font-size:12px;color:${MUTED_COLOR};line-height:1.6;">
      If you ever want to stop hearing from us, you can <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:${BRAND_COLOR};text-decoration:none;">unsubscribe here</a>.
    </p>
  `;

  return {
    subject: "Your Graphxify website growth checklist",
    text:
      `Thanks for subscribing to the Graphxify newsletter.\n\n` +
      `Open your checklist here: ${input.checklistUrl}\n\n` +
      `Unsubscribe: ${input.unsubscribeUrl}`,
    html: baseLayout("Your Website Growth Checklist", body)
  };
}

/* ── Review Submission Notification ── */

export function reviewSubmissionTemplate(input: {
  name: string;
  role: string;
  quote: string;
  rating: number;
}) {
  const stars = "★".repeat(input.rating) + "☆".repeat(5 - input.rating);

  const body = `
    ${h2("New Review Submitted")}
    <p style="margin:0 0 12px;font-size:13px;color:${MUTED_COLOR};">A new client review is pending approval in your CMS.</p>
    ${field("Name", input.name)}
    ${field("Role", input.role)}
    ${field("Rating", `${stars} (${input.rating}/5)`)}
    ${divider()}
    <p style="margin:0 0 4px;font-size:12px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:0.05em;">Review</p>
    <p style="margin:0;font-size:14px;color:${TEXT_COLOR};line-height:1.6;font-style:italic;">"${escapeHtml(input.quote)}"</p>
    ${ctaButton("Review in CMS", "https://graphxify.com/dashboard/testimonials")}
  `;

  return {
    subject: `New review from ${input.name}`,
    text: `New review submitted\nName: ${input.name}\nRole: ${input.role}\nRating: ${input.rating}/5\nReview: ${input.quote}`,
    html: baseLayout("New Review Submitted", body)
  };
}

/* ── User Invitation ── */

export function userInvitationTemplate(input: {
  inviteeName: string;
  inviteeEmail: string;
  role: string;
  invitedBy: string;
}) {
  const body = `
    ${h2("You're Invited to Graphxify CMS")}
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      Hi <strong>${escapeHtml(input.inviteeName)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      <strong>${escapeHtml(input.invitedBy)}</strong> has invited you to join the Graphxify CMS as <strong>${escapeHtml(input.role)}</strong>.
    </p>
    <p style="margin:0 0 8px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      Check your inbox for a separate email with your login link, or go to:
    </p>
    ${ctaButton("Open CMS Dashboard", "https://graphxify.com/dashboard")}
    <p style="margin:0;font-size:12px;color:${MUTED_COLOR};">
      If you did not expect this invitation, you can safely ignore this email.
    </p>
  `;

  return {
    subject: `You're invited to Graphxify CMS`,
    text: `Hi ${input.inviteeName},\n\n${input.invitedBy} has invited you to join the Graphxify CMS as ${input.role}.\n\nLogin at: https://graphxify.com/dashboard`,
    html: baseLayout("CMS Invitation", body)
  };
}

/* ── Password Reset ── */

export function passwordResetTemplate(input: {
  recipientEmail: string;
}) {
  const body = `
    ${h2("Password Reset Requested")}
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      A password reset was requested for <strong>${escapeHtml(input.recipientEmail)}</strong>.
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      If you requested this, check your inbox for the reset link from Supabase Auth.
    </p>
    <p style="margin:0;font-size:12px;color:${MUTED_COLOR};">
      If you did not request a password reset, please ignore this email or contact your administrator.
    </p>
  `;

  return {
    subject: `Password reset requested — Graphxify CMS`,
    text: `A password reset was requested for ${input.recipientEmail}. Check your inbox for the reset link.`,
    html: baseLayout("Password Reset", body)
  };
}

/* ── Magic Link ── */

export function magicLinkTemplate(input: {
  recipientName: string | null;
  recipientEmail: string;
  magicLink: string;
}) {
  const name = input.recipientName?.trim() || input.recipientEmail.split("@")[0];
  const body = `
    ${h2("Your Graphxify Magic Link")}
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      Hi <strong>${escapeHtml(name)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      An administrator generated a secure sign-in link for your Graphxify CMS account.
    </p>
    <p style="margin:0 0 8px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      Use the button below to continue:
    </p>
    ${ctaButton("Log In to Graphxify", escapeHtml(input.magicLink))}
    <p style="margin:0;font-size:12px;color:${MUTED_COLOR};">
      If you did not expect this email, you can safely ignore it.
    </p>
  `;

  return {
    subject: "Your Graphxify magic link",
    text: `Hi ${name},\n\nAn administrator generated a secure sign-in link for your Graphxify CMS account.\n\nLog in here: ${input.magicLink}`,
    html: baseLayout("Magic Link", body)
  };
}

/* ── Content Publish Notification ── */

export function publishNotificationTemplate(input: {
  type: "post" | "work";
  title: string;
  slug: string;
  publishedAt: string;
}) {
  const label = input.type === "post" ? "Blog Post" : "Project";
  const url = input.type === "post"
    ? `https://graphxify.com/blog/${input.slug}`
    : `https://graphxify.com/works/${input.slug}`;

  const body = `
    ${h2(`${label} Published`)}
    ${field("Title", input.title)}
    ${field("Published", formatDate(input.publishedAt))}
    ${ctaButton(`View ${label}`, url)}
  `;

  return {
    subject: `${label} published: ${input.title}`,
    text: `${label} published\nTitle: ${input.title}\nSlug: ${input.slug}\nPublished: ${input.publishedAt}`,
    html: baseLayout(`${label} Published`, body)
  };
}

/* ── SMTP Test Email ── */

export function testEmailTemplate() {
  const now = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  const body = `
    ${h2("SMTP Test Email")}
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_COLOR};line-height:1.6;">
      ✅ Your Hostinger SMTP connection is working correctly.
    </p>
    ${field("Sent at", now)}
    ${field("Provider", "Hostinger SMTP (smtp.hostinger.com:465)")}
    ${divider()}
    <p style="margin:0;font-size:12px;color:${MUTED_COLOR};">
      This is an automated test email from the Graphxify email system.
    </p>
  `;

  return {
    subject: `✅ SMTP Test — Graphxify`,
    text: `SMTP test email sent successfully at ${now}. Your Hostinger SMTP connection is working.`,
    html: baseLayout("SMTP Test", body)
  };
}
