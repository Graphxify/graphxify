"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Send, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = { type: "success" | "error"; message: string } | null;

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
  const [status, setStatus] = useState<Status>(null);
  const [charCount, setCharCount] = useState(0);
  const [rating, setRating] = useState(5);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          role: formData.get("role"),
          quote: formData.get("quote"),
          company: formData.get("company"),
          rating
        })
      });

      const payload = (await response.json()) as { message?: string };

      if (response.ok) {
        form.reset();
        setCharCount(0);
        setRating(5);
        setStatus({
          type: "success",
          message: payload.message || "Thank you! Your review has been submitted and is pending approval."
        });
      } else {
        setStatus({
          type: "error",
          message: payload.message || "Something went wrong. Please try again."
        });
      }
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="review-form space-y-4" aria-label="Submit a review">
      <AnimatePresence initial={false}>
        {status ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 rounded-xl border border-border/16 bg-card/72 px-4 py-3 text-sm backdrop-blur-sm"
          >
            {status.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            )}
            <span className="text-fg/82">{status.message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
          />
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
          />
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
        />
      </div>

      {/* Star rating */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-[0.14em] text-fg/56">
          Rating <span className="text-fg/36">*</span>
        </label>
        <StarRating value={rating} onChange={setRating} />
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
          onChange={(e) => setCharCount(e.target.value.length)}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl border border-accentA/45 bg-accent-gradient px-6 text-ivory shadow-[0_10px_22px_rgba(0,82,204,0.22)] hover:border-accentA/55 hover:brightness-105 focus-visible:border-accentA/55 focus-visible:text-ivory focus-visible:ring-accentA/70 sm:w-auto"
      >
        <Send className="mr-2 h-4 w-4" />
        {loading ? "Submitting..." : "Submit Review"}
      </Button>

      <p className="text-[11px] leading-relaxed text-fg/32">
        Your review will be reviewed before being published. By submitting, you agree to have your name and review displayed on our website.
      </p>
    </form>
  );
}
