"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/site/badge";
import { Button } from "@/components/ui/button";
import { FieldErrorText, FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { SubmissionModal } from "@/components/ui/submission-modal";
import { fieldErrorsFromZod, submitJsonForm, type FormFieldErrors } from "@/lib/forms/shared";
import { trackConversion } from "@/lib/analytics-events";
import { newsletterSubscriptionSchema } from "@/lib/validation/schemas";

/**
 * Newsletter / checklist capture.
 *
 * Extracted from blog-page-content so the same form can appear on the blog,
 * the homepage, and the checklist resource page without three copies of the
 * submit logic drifting apart.
 *
 * `source` is persisted on the subscriber row so signups can be attributed to
 * the placement that produced them.
 *
 * Note this is intentionally NOT a content gate. The welcome email links back
 * to /resources/website-growth-checklist, and that page is in the sitemap and
 * ranks — hiding it behind an email wall would break the email flow and
 * de-index the page. Capture alongside the content, not in front of it.
 */

export type NewsletterSource = "blog" | "home" | "checklist";

const BENEFITS = [
  "Web design, branding, and SEO essentials",
  "Written specifically for business owners",
  "Practical steps you can act on right away"
] as const;

export function NewsletterSignup({
  source,
  idPrefix,
  heading = "Free Website Growth Checklist",
  blurb = "Subscribe to the Graphxify newsletter and receive a practical checklist covering the essential elements every business website needs to attract customers and convert visitors.",
  showBenefits = true
}: {
  source: NewsletterSource;
  /** Unique per placement so ids stay unique if two instances ever share a page. */
  idPrefix: string;
  heading?: string;
  blurb?: string;
  showBenefits?: boolean;
}): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState(
    "Check your inbox for the checklist. You will also receive practical insights on web design, branding, and digital strategy for modern businesses."
  );
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const parsed = newsletterSubscriptionSchema.safeParse({ email: email.trim() });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }

    setLoading(true);
    try {
      const result = await submitJsonForm("/api/newsletter", { ...parsed.data, source });
      if (result.success) {
        trackConversion({ name: "newsletter_subscribed", properties: { placement: source } });
        setEmail("");
        setMessage(result.message);
        setModalOpen(true);
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] bg-charcoal p-7 text-white sm:p-10 md:rounded-[2.5rem] md:p-14 lg:p-16">
      <div aria-hidden="true" className="absolute -right-24 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-accentA/25 blur-[120px]" />
      <div aria-hidden="true" className="absolute -bottom-40 -left-20 -z-10 h-[22rem] w-[22rem] rounded-full bg-green/10 blur-[120px]" />
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Value proposition */}
        <div className="lg:col-span-7">
          <Badge tone="dark" dot="blue">
            Free resource
          </Badge>

          <h2 className="t-h2 mt-6 max-w-[16ch] text-white">{heading}</h2>

          <p className="mt-5 max-w-[52ch] text-[1.0625rem] font-medium leading-relaxed text-white/64">{blurb}</p>

          {showBenefits ? (
            <ul className="mt-7 space-y-3" aria-label="Checklist includes">
              {BENEFITS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[0.9375rem] font-semibold text-white">
                  <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-fg">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Form */}
        <div className="rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-inset ring-white/10 md:p-8 lg:col-span-5">
          {/* Field errors default to blue; electric keeps them readable on charcoal. */}
          <form onSubmit={onSubmit} className="space-y-3 [&_p[role=alert]]:text-[0.8125rem] [&_p[role=alert]]:font-medium [&_p[role=alert]]:text-accentA" aria-label="Newsletter signup form">
            <label htmlFor={`${idPrefix}-subscribe-email`} className="block text-sm font-semibold text-white">
              Email address
            </label>
            <FormAlert message={error} />

            <Input
              id={`${idPrefix}-subscribe-email`}
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setFieldErrors((current) => {
                  if (!current.email) return current;
                  const next = { ...current };
                  delete next.email;
                  return next;
                });
              }}
              placeholder="you@company.com"
              className="h-[3.25rem] rounded-[14px] border border-white/10 bg-charcoal-2 px-4 text-[0.9375rem] text-white placeholder:text-white/50 transition-colors hover:border-white/20 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-accentA aria-[invalid=true]:border-accentA"
              aria-describedby={fieldErrors.email ? `${idPrefix}-subscribe-email-error` : undefined}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            <FieldErrorText id={`${idPrefix}-subscribe-email-error`} message={fieldErrors.email} />

            <Button type="submit" size="lg" variant="inverse" className="h-[3.25rem] w-full px-6 focus-visible:ring-accentA focus-visible:ring-offset-charcoal" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                <span>Get the checklist</span>
              )}
            </Button>
          </form>

          <p className="mt-4 text-[0.8125rem] leading-relaxed text-white/60">
            No spam. Only practical insights for business websites.{" "}
            <span>Unsubscribe anytime.</span>
          </p>
        </div>
      </div>

      <SubmissionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type="success"
        title="Checklist on its way!"
        message={message}
        autoDismiss={6000}
      />
    </div>
  );
}
