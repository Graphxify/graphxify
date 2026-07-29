"use client";

import { useState } from "react";
import { Check, ListChecks, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldErrorText, FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { SubmissionModal } from "@/components/ui/submission-modal";
import { fieldErrorsFromZod, submitJsonForm, type FormFieldErrors } from "@/lib/forms/shared";
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
    <div className="section-shell relative overflow-hidden border-accentA/16 bg-card/82 p-7 md:p-10 lg:p-12">
      {/* Ambient glows */}
      <span className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-accentA/9 blur-[80px]" />
      <span className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accentB/7 blur-[70px]" />
      <span className="absolute inset-x-0 top-0 h-px bg-accent-gradient opacity-50" />

      <div className="relative z-10 grid items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Value proposition */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accentA/26 bg-accentA/10 px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-accentA">
            <ListChecks className="h-3 w-3" />
            Free Resource
          </div>

          <h2 className="mt-4 text-2xl font-semibold leading-[1.1] md:text-[1.8rem]">{heading}</h2>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg/60">{blurb}</p>

          {showBenefits ? (
            <ul className="mt-5 space-y-2.5" aria-label="Checklist includes">
              {BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-fg/62">
                  <span className="mt-[0.2rem] flex h-4 w-4 shrink-0 items-center justify-center rounded border border-accentA/30 bg-accentA/10 text-accentA">
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Form */}
        <div className="lg:pt-2">
          <form onSubmit={onSubmit} className="space-y-3" aria-label="Newsletter signup form">
            <FormAlert message={error} />

            <Input
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
              placeholder="Your email address"
              className="h-12 rounded-xl border-border/22 bg-bg/64 px-4 text-sm placeholder:text-fg/40 placeholder:opacity-100 focus:border-accentA/40"
              aria-label="Email address"
              aria-describedby={fieldErrors.email ? `${idPrefix}-subscribe-email-error` : undefined}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            <FieldErrorText id={`${idPrefix}-subscribe-email-error`} message={fieldErrors.email} />

            <Button type="submit" size="lg" className="h-12 w-full px-6" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Get the Checklist
                </span>
              )}
            </Button>
          </form>

          <p className="mt-4 text-[0.7rem] leading-relaxed text-fg/40">
            No spam. Only practical insights for business websites.{" "}
            <span className="text-fg/28">Unsubscribe anytime.</span>
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
