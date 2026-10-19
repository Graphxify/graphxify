/* ── Graphxify branded email templates ── */

/* v4 "Studio" system, mirrored from the site: light canvas, white card, ink type, black pill CTA. */
const BRAND_COLOR = "#0052CC"; // links (electric blue, readable on white)
const BRAND_BG = "#F2F2F2";
const CARD_BG = "#FFFFFF";
const TEXT_COLOR = "#0A0A0A";
const MUTED_COLOR = "#5C5C63";
const BORDER_COLOR = "#E6E6E9";
const GREEN = "#34D36A";
const SITE = "https://www.graphxify.com";
// PNG, not SVG: Gmail and Outlook do not render SVG images.
const LOGO_URL = `${SITE}/images/branding/graphxify-logo-email.png`;
const FONT = "'Plus Jakarta Sans','Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function baseLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${BRAND_BG};font-family:${FONT};color:${TEXT_COLOR};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_BG};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <a href="${SITE}" style="text-decoration:none;"><img src="${LOGO_URL}" width="141" height="31" alt="Graphxify" style="display:block;border:0;width:141px;height:31px;" /></a>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:${CARD_BG};border-radius:28px;padding:40px 36px;font-family:${FONT};">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 12px 0;font-family:${FONT};">
              <p style="margin:0 0 10px;font-size:13px;font-weight:600;">
                <a href="${SITE}/works" style="color:${TEXT_COLOR};text-decoration:none;">Work</a>
                <span style="color:${BORDER_COLOR};">&nbsp;&middot;&nbsp;</span>
                <a href="${SITE}/services" style="color:${TEXT_COLOR};text-decoration:none;">Services</a>
                <span style="color:${BORDER_COLOR};">&nbsp;&middot;&nbsp;</span>
                <a href="${SITE}/contact" style="color:${TEXT_COLOR};text-decoration:none;">Contact</a>
              </p>
              <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED_COLOR};">
                &copy; ${new Date().getFullYear()} Graphxify &middot; Based in Canada &middot; Working worldwide<br />
                <a href="mailto:info@graphxify.com" style="color:${MUTED_COLOR};text-decoration:none;">info@graphxify.com</a>
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

/** White-pill badge with a dot, as above section titles on the site. */
function badge(text: string, dot: string = GREEN): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr><td style="background:${BRAND_BG};border-radius:999px;padding:7px 14px 7px 12px;font-size:12px;font-weight:700;color:${TEXT_COLOR};font-family:${FONT};"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dot};margin-right:8px;vertical-align:1px;"></span>${text}</td></tr></table>`;
}

function h2(text: string): string {
  return `<h2 style="margin:0 0 18px;font-size:28px;line-height:1.1;font-weight:800;letter-spacing:-0.03em;color:${TEXT_COLOR};font-family:${FONT};">${text}</h2>`;
}

function field(label: string, value: string): string {
  return `<p style="margin:0 0 10px;font-size:15px;color:${TEXT_COLOR};"><span style="display:inline-block;min-width:64px;color:${MUTED_COLOR};font-weight:600;">${label}</span> ${escapeHtml(value)}</p>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${BORDER_COLOR};margin:24px 0;" />`;
}

function ctaButton(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0;">
    <tr>
      <td style="background:${TEXT_COLOR};border-radius:999px;">
        <a href="${href}" style="display:inline-block;padding:15px 30px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;font-family:${FONT};">${text} &nbsp;&#8599;</a>
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
            <img src="${escapeHtml(url)}" alt="${escapeHtml(fileName)}" style="max-width:200px;max-height:140px;border-radius:14px;border:1px solid ${BORDER_COLOR};" />
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
         <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${TEXT_COLOR};">Attachments</p>
         ${attachmentLinks}`
      : "";

  const body = `
    ${badge("New inquiry", "#00A3FF")}
    ${h2("New contact inquiry")}
    ${field("Name", input.name)}
    ${field("Email", input.email)}
    ${divider()}
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${TEXT_COLOR};">Message</p>
    <p style="margin:0;font-size:15px;color:${TEXT_COLOR};line-height:1.65;white-space:pre-wrap;">${escapeHtml(input.message)}</p>
    ${attachmentSection}
    ${ctaButton(`Reply to ${escapeHtml(input.name.trim().split(/\s+/)[0] || "them")}`, `mailto:${encodeURIComponent(input.email)}?subject=${encodeURIComponent("Re: your Graphxify inquiry")}`)}
    ${divider()}
    <p style="margin:0;font-size:13px;color:${MUTED_COLOR};">Submitted ${formatDate(input.createdAt)} &middot; <a href="${SITE}/dashboard/leads" style="color:${BRAND_COLOR};text-decoration:none;font-weight:600;">View all leads</a></p>
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

/* ── Contact Form Auto-Reply (sent to the person who submitted) ── */

export function leadAutoReplyTemplate(input: { name: string }) {
  const firstName = input.name.trim().split(/\s+/)[0] || "there";

  const body = `
    ${badge("Message received")}
    ${h2('Thanks for <span style="color:#0052CC;">reaching out</span>.')}
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      Hi <strong>${escapeHtml(firstName)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      Thanks for getting in touch with Graphxify. We've received your message, and a real person on our team is reviewing it now. We'll get back to you as soon as possible.
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      In the meantime, feel free to explore some of our recent work:
    </p>
    ${ctaButton("View Our Work", "https://www.graphxify.com/works")}
    ${divider()}
    <p style="margin:0 0 12px;font-size:13px;color:${MUTED_COLOR};line-height:1.6;">
      This is an automated confirmation that your message was received. If you'd like to add anything, just reply to this email and it'll reach our team directly.
    </p>
    <p style="margin:0;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">— The Graphxify Team</p>
  `;

  return {
    subject: "We received your message — Graphxify",
    text:
      `Hi ${firstName},\n\n` +
      `Thanks for getting in touch with Graphxify. We've received your message, and a real person on our team is reviewing it now. We'll get back to you as soon as possible.\n\n` +
      `In the meantime, feel free to explore our recent work: https://www.graphxify.com/works\n\n` +
      `If you'd like to add anything, just reply to this email and it'll reach our team directly.\n\n` +
      `— The Graphxify Team`,
    html: baseLayout("Thanks for reaching out", body)
  };
}

/* ── Newsletter Welcome / Checklist Delivery ── */

export function newsletterWelcomeTemplate(input: {
  checklistUrl: string;
  unsubscribeUrl: string;
}) {
  const body = `
    ${badge("Checklist ready")}
    ${h2('Your website growth <span style="color:#0052CC;">checklist</span> is ready.')}
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      Thanks for subscribing to the Graphxify newsletter. Your checklist is ready below, and we'll also send occasional practical insights on web design, branding, local SEO, and digital strategy.
    </p>
    ${ctaButton("Open the Checklist", escapeHtml(input.checklistUrl))}
    ${divider()}
    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:${TEXT_COLOR};">What you'll get</p>
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
    ${badge("New review", "#00A3FF")}
    ${h2("New review submitted")}
    <p style="margin:0 0 12px;font-size:13px;color:${MUTED_COLOR};">A new client review is pending approval in your CMS.</p>
    ${field("Name", input.name)}
    ${field("Role", input.role)}
    ${field("Rating", `${stars} (${input.rating}/5)`)}
    ${divider()}
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${TEXT_COLOR};">Review</p>
    <p style="margin:0;font-size:15px;color:${TEXT_COLOR};line-height:1.65;font-style:italic;">"${escapeHtml(input.quote)}"</p>
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
    ${badge("CMS invitation", "#0A0A0A")}
    ${h2("You're invited to the Graphxify CMS")}
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      Hi <strong>${escapeHtml(input.inviteeName)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      <strong>${escapeHtml(input.invitedBy)}</strong> has invited you to join the Graphxify CMS as <strong>${escapeHtml(input.role)}</strong>.
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
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
    ${badge("Account security", "#0A0A0A")}
    ${h2("Password reset requested")}
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      A password reset was requested for <strong>${escapeHtml(input.recipientEmail)}</strong>.
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
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
    ${badge("Sign in", "#0A0A0A")}
    ${h2("Your Graphxify sign-in link")}
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      Hi <strong>${escapeHtml(name)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
      An administrator generated a secure sign-in link for your Graphxify CMS account.
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
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
    ${badge("Now live")}
    ${h2(`${label} published`)}
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
    ${badge("Email is working")}
    ${h2("SMTP test email")}
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.65;">
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
