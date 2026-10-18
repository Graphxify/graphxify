"use client";

import { Loader2, Send, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldErrorText, FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { SubmissionModal } from "@/components/ui/submission-modal";
import { Textarea } from "@/components/ui/textarea";
import { fieldErrorsFromZod, submitJsonForm, type FormFieldErrors } from "@/lib/forms/shared";
import { trackConversion } from "@/lib/analytics-events";
import { publicReviewSchema } from "@/lib/validation/schemas";

type ModalState = { open: boolean; type: "success" | "error"; title: string; message: string };
type NotificationState = { status: "sent" | "disabled" | "skipped" | "failed" };
type ReviewSubmitResponse = { notification?: NotificationState };

/** Grey wells on the white card; blue edge when invalid, blue ring on focus. */
const FIELD_CLASS =
  "h-[3.25rem] rounded-[14px] border border-transparent bg-bg px-4 text-[0.9375rem] text-fg placeholder:text-fg/50 transition-colors hover:border-fg/15 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-accentB aria-[invalid=true]:border-accentB";
const LABEL_CLASS = "block text-sm font-semibold text-fg";

function errorId(id: string, message?: string): string | undefined {
  return message ? `${id}-error` : undefined;
}

/* ── Interactive star rating ── */
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}): JSX.Element {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1.5" role="radiogroup" aria-labelledby="review-rating-label">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="group grid h-12 w-12 place-items-center rounded-full bg-bg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentB"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                filled
                  ? "fill-fg text-fg"
                  : "fill-transparent text-fg/30 group-hover:text-fg/60"
              }`}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ReviewForm(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, type: "success", title: "", message: "" });
  const [charCount, setCharCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});
  const [submitError, setSubmitError] = useState("");

  function clearFieldError(field: keyof FormFieldErrors): void {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setSubmitError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      role: String(formData.get("role") || "").trim(),
      quote: String(formData.get("quote") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      rating
    };

    const parsed = publicReviewSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }

    setLoading(true);

    try {
      const result = await submitJsonForm<ReviewSubmitResponse>("/api/reviews", parsed.data);

      if (result.success) {
        trackConversion({ name: "review_submitted" });
        const notificationStatus = result.data?.notification?.status;
        const hasWarning = notificationStatus === "failed" || notificationStatus === "skipped";
        form.reset();
        setCharCount(0);
        setRating(5);
        setModal({
          open: true,
          type: hasWarning ? "error" : "success",
          title: hasWarning ? "Review Saved With Warning" : "Review Submitted",
          message: result.message
        });
      } else if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        // Validation errors — show inline
        setFieldErrors(result.fieldErrors);
        setSubmitError(result.message);
      } else {
        // Server / network error — show error modal
        setModal({
          open: true,
          type: "error",
          title: "Something Went Wrong",
          message: result.message || "We couldn't submit your review. Please try again in a moment."
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* noValidate: the schema covers every native rule and shows its message under the field. */}
      <form onSubmit={onSubmit} noValidate className="review-form space-y-6" aria-label="Submit a review">
        <FormAlert message={submitError} className="border-amber-500/30 bg-amber-50 text-amber-800" />

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
          <div className="space-y-2">
            <label htmlFor="review-name" className={LABEL_CLASS}>
              Name
            </label>
            <Input
              id="review-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              placeholder="Your full name"
              className={FIELD_CLASS}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={errorId("review-name", fieldErrors.name)}
              onChange={() => clearFieldError("name")}
            />
            <FieldErrorText id="review-name-error" message={fieldErrors.name} />
          </div>

          <div className="space-y-2">
            <label htmlFor="review-role" className={LABEL_CLASS}>
              Role or title
            </label>
            <Input
              id="review-role"
              name="role"
              required
              minLength={2}
              maxLength={160}
              placeholder="e.g. CEO, Founder, Manager"
              className={FIELD_CLASS}
              aria-invalid={Boolean(fieldErrors.role)}
              aria-describedby={errorId("review-role", fieldErrors.role)}
              onChange={() => clearFieldError("role")}
            />
            <FieldErrorText id="review-role-error" message={fieldErrors.role} />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="review-company" className={LABEL_CLASS}>
            Company <span className="ml-1 font-medium text-fg/50">(optional)</span>
          </label>
          <Input
            id="review-company"
            name="company"
            autoComplete="organization"
            maxLength={120}
            placeholder="Company name"
            className={FIELD_CLASS}
            aria-invalid={Boolean(fieldErrors.company)}
            aria-describedby={errorId("review-company", fieldErrors.company)}
            onChange={() => clearFieldError("company")}
          />
          <FieldErrorText id="review-company-error" message={fieldErrors.company} />
        </div>

        {/* Star rating */}
        <div className="space-y-2">
          <p id="review-rating-label" className={LABEL_CLASS}>
            Rating
          </p>
          <StarRating value={rating} onChange={(value) => {
            clearFieldError("rating");
            setRating(value);
          }} />
          <FieldErrorText id="review-rating-error" message={fieldErrors.rating} />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor="review-quote" className={LABEL_CLASS}>
              Your review
            </label>
            <span className="text-[0.8125rem] font-semibold tabular-nums text-fg/60">{charCount}/600</span>
          </div>
          <Textarea
            id="review-quote"
            name="quote"
            required
            minLength={10}
            maxLength={600}
            rows={4}
            placeholder="Share your experience working with Graphxify..."
            className={`${FIELD_CLASS} h-auto min-h-[9rem] resize-y py-3.5`}
            aria-invalid={Boolean(fieldErrors.quote)}
            aria-describedby={errorId("review-quote", fieldErrors.quote)}
            onChange={(e) => {
              clearFieldError("quote");
              setCharCount(e.target.value.length);
            }}
          />
          <FieldErrorText id="review-quote-error" message={fieldErrors.quote} />
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="h-14 w-full px-9 text-base sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Submit review
            </>
          )}
        </Button>

        <p className="max-w-[60ch] text-sm font-medium leading-relaxed text-fg/60">
          Your review will be reviewed before being published. By submitting, you agree to have your name and review displayed on our website.
        </p>
      </form>

      <SubmissionModal
        open={modal.open}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </>
  );
}
