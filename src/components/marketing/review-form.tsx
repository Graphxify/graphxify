"use client";

import { Loader2, Send, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldErrorText, FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { SubmissionModal } from "@/components/ui/submission-modal";
import { Textarea } from "@/components/ui/textarea";
import { fieldErrorsFromZod, submitJsonForm, type FormFieldErrors } from "@/lib/forms/shared";
import { publicReviewSchema } from "@/lib/validation/schemas";

type ModalState = { open: boolean; type: "success" | "error"; title: string; message: string };
type NotificationState = { status: "sent" | "disabled" | "skipped" | "failed" };
type ReviewSubmitResponse = { notification?: NotificationState };

const FIELD_CLASS =
  "h-12 rounded-xl border-border/18 bg-bg/62 px-4 text-sm placeholder:text-fg/32 placeholder:opacity-100";

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
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
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
            className="group p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/50 rounded"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                filled
                  ? "fill-[#e8732a] text-[#e8732a]"
                  : "fill-transparent text-border/40 group-hover:text-[#e8732a]/40"
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
      <form onSubmit={onSubmit} className="review-form space-y-4" aria-label="Submit a review">
        <FormAlert message={submitError} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="review-name" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/56">
              Name <span className="text-fg/36">*</span>
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
              onChange={() => clearFieldError("name")}
            />
            <FieldErrorText id="review-name-error" message={fieldErrors.name} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="review-role" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/56">
              Role / Title <span className="text-fg/36">*</span>
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
              onChange={() => clearFieldError("role")}
            />
            <FieldErrorText id="review-role-error" message={fieldErrors.role} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="review-company" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/56">
            Company <span className="text-xs font-normal normal-case tracking-normal text-fg/32">(optional)</span>
          </label>
          <Input
            id="review-company"
            name="company"
            autoComplete="organization"
            maxLength={120}
            placeholder="Company name"
            className={FIELD_CLASS}
            onChange={() => clearFieldError("company")}
          />
          <FieldErrorText id="review-company-error" message={fieldErrors.company} />
        </div>

        {/* Star rating */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-fg/56">
            Rating <span className="text-fg/36">*</span>
          </label>
          <StarRating value={rating} onChange={(value) => {
            clearFieldError("rating");
            setRating(value);
          }} />
          <FieldErrorText id="review-rating-error" message={fieldErrors.rating} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="review-quote" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/56">
              Your Review <span className="text-fg/36">*</span>
            </label>
            <span className="text-[11px] tabular-nums text-fg/32">{charCount}/600</span>
          </div>
          <Textarea
            id="review-quote"
            name="quote"
            required
            minLength={10}
            maxLength={600}
            rows={4}
            placeholder="Share your experience working with Graphxify..."
            className={`${FIELD_CLASS} min-h-[7rem] resize-none py-3`}
            aria-invalid={Boolean(fieldErrors.quote)}
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
          className="h-12 w-full rounded-xl border border-accentA/45 bg-accent-gradient px-6 text-ivory shadow-[0_10px_22px_rgba(0,82,204,0.22)] hover:border-accentA/55 hover:brightness-105 focus-visible:border-accentA/55 focus-visible:text-ivory focus-visible:ring-accentA/70 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Review
            </>
          )}
        </Button>

        <p className="text-[11px] leading-relaxed text-fg/32">
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
