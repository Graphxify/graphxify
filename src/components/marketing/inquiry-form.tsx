"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type InquiryFormProps = {
  source: "homepage" | "contact";
};

type SubmissionState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | { type: "info"; message: string }
  | null;

const serviceOptions = ["Brand Systems", "Web Design (UX/UI)", "Web Development", "CMS Architecture"] as const;
const timelineOptions = ["ASAP", "2-4 weeks", "1-2 months", "3+ months"] as const;
const budgetOptions = ["$5k-$10k", "$10k-$25k", "$25k-$50k", "$50k+"] as const;

export function InquiryForm({ source }: InquiryFormProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SubmissionState>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const services = formData.getAll("services").map((entry) => String(entry));

    if (services.length === 0) {
      setStatus({ type: "error", message: "Please select at least one service." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          company: String(formData.get("company") || ""),
          website: String(formData.get("website") || ""),
          services,
          timeline: String(formData.get("timeline") || ""),
          budget: String(formData.get("budget") || ""),
          details: String(formData.get("details") || ""),
          source
        })
      });

      const payload = (await response.json()) as {
        message?: string;
        mode?: "stored" | "mailto";
        mailtoUrl?: string;
      };

      if (!response.ok) {
        setStatus({ type: "error", message: payload.message || "Unable to send inquiry. Please try again." });
        return;
      }

      if (payload.mode === "mailto" && payload.mailtoUrl) {
        setStatus({
          type: "info",
          message: "Opening your email app to finish sending your inquiry."
        });
        window.location.href = payload.mailtoUrl;
        return;
      }

      form.reset();
      setStatus({
        type: "success",
        message:
          "Received — thanks. We'll reply within one business day. If it's a fit, you'll get a short call invite and a delivery plan."
      });
    } catch {
      setStatus({ type: "error", message: "Unable to send inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label="Project inquiry form">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`name-${source}`}>Name</Label>
          <Input id={`name-${source}`} name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`email-${source}`}>Email</Label>
          <Input id={`email-${source}`} name="email" type="email" required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`company-${source}`}>Company / Team</Label>
          <Input id={`company-${source}`} name="company" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`website-${source}`}>Website URL (optional)</Label>
          <Input id={`website-${source}`} name="website" type="url" placeholder="https://" />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">What do you need?</legend>
        <div className="grid gap-2 md:grid-cols-2">
          {serviceOptions.map((service) => (
            <label key={service} className="flex items-center gap-2 rounded-lg border border-border/22 px-3 py-2 text-sm">
              <input
                type="checkbox"
                name="services"
                value={service}
                className="h-4 w-4 rounded border-border/30 accent-black dark:accent-white"
              />
              <span>{service}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`timeline-${source}`}>Timeline</Label>
          <select
            id={`timeline-${source}`}
            name="timeline"
            required
            className="h-11 w-full rounded-lg border border-border/22 bg-card px-3 text-sm text-fg"
            defaultValue=""
          >
            <option value="" disabled>
              Select timeline
            </option>
            {timelineOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`budget-${source}`}>Budget range</Label>
          <select
            id={`budget-${source}`}
            name="budget"
            required
            className="h-11 w-full rounded-lg border border-border/22 bg-card px-3 text-sm text-fg"
            defaultValue=""
          >
            <option value="" disabled>
              Select budget
            </option>
            {budgetOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`details-${source}`}>Project details</Label>
        <Textarea
          id={`details-${source}`}
          name="details"
          required
          minLength={80}
          placeholder="Share goals, constraints, pages needed, and what success looks like."
        />
        <p className="text-xs text-fg/65">Include 3-6 sentences so we can respond with a clear next step.</p>
      </div>

      <AnimatePresence>
        {status ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-lg border border-border/24 bg-card/72 px-3 py-2 text-sm"
            aria-live="polite"
          >
            {status.message}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Sending..." : "Send inquiry"}
      </Button>

      <p className="text-xs text-fg/62">No spam. Your details are used only to respond to your inquiry.</p>
    </form>
  );
}
