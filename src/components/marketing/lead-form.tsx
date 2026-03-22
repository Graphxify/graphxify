"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldErrorText, FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { SubmissionModal } from "@/components/ui/submission-modal";
import { Textarea } from "@/components/ui/textarea";
import { fieldErrorsFromZod, submitJsonForm, type FormFieldErrors } from "@/lib/forms/shared";
import { cn } from "@/lib/utils";
import { publicLeadSchema } from "@/lib/validation/schemas";

type ModalState = { open: boolean; type: "success" | "error"; title: string; message: string };
type NotificationState = { status: "sent" | "disabled" | "skipped" | "failed" };
type LeadSubmitResponse = { id: string; notification?: NotificationState };

const SERVICE_OPTIONS = [
  { key: "brand-systems", label: "Brand Systems" },
  { key: "web-design", label: "Web Design" },
  { key: "web-development", label: "Web Development" },
  { key: "cms-architecture", label: "CMS Architecture" },
  { key: "something-else", label: "Something Else" }
] as const;

const QUICK_FIELD_CLASS = "h-12 rounded-xl border-border/18 bg-bg/62 px-4 text-sm placeholder:text-fg/32 placeholder:opacity-100";

type ServiceKey = (typeof SERVICE_OPTIONS)[number]["key"];

export function LeadForm(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, type: "success", title: "", message: "" });
  const [selectedService, setSelectedService] = useState<ServiceKey | "">("");
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
      source: "quick_start" as const,
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      intakeNeeds: selectedService ? [selectedService] : [],
      attachments: []
    };

    const parsed = publicLeadSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }

    setLoading(true);

    try {
      const result = await submitJsonForm<LeadSubmitResponse>("/api/leads", parsed.data);

      if (result.success) {
        const notificationStatus = result.data?.notification?.status;
        const hasWarning = notificationStatus === "failed" || notificationStatus === "skipped";
        form.reset();
        setSelectedService("");
        setModal({
          open: true,
          type: hasWarning ? "error" : "success",
          title: hasWarning ? "Inquiry Saved With Warning" : "Message Sent Successfully",
          message: result.message
        });
      } else if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        // Validation errors — show inline so the user can fix specific fields
        setFieldErrors(result.fieldErrors);
        setSubmitError(result.message);
      } else {
        // Server / network error — show error modal
        setModal({
          open: true,
          type: "error",
          title: "Something Went Wrong",
          message: result.message || "We couldn't send your message. Please try again in a moment."
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="lead-form-premium space-y-3" aria-label="Quick start lead form">
        <FormAlert message={submitError} />

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="quick-lead-name" className="sr-only">
              Full Name
            </label>
            <Input
              id="quick-lead-name"
              name="name"
              autoComplete="name"
              required
              placeholder="Full Name"
              className={QUICK_FIELD_CLASS}
              aria-invalid={Boolean(fieldErrors.name)}
              onChange={() => clearFieldError("name")}
            />
            <FieldErrorText id="quick-lead-name-error" message={fieldErrors.name} />
          </div>

          <div className="space-y-1">
            <label htmlFor="quick-lead-email" className="sr-only">
              Email
            </label>
            <Input
              id="quick-lead-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              className={QUICK_FIELD_CLASS}
              aria-invalid={Boolean(fieldErrors.email)}
              onChange={() => clearFieldError("email")}
            />
            <FieldErrorText id="quick-lead-email-error" message={fieldErrors.email} />
          </div>

          <div className="space-y-1 md:col-span-2 lg:col-span-1">
            <label htmlFor="quick-lead-service" className="sr-only">
              Service
            </label>
            <div className="relative">
              <select
                id="quick-lead-service"
                name="service"
                value={selectedService}
                data-empty={selectedService ? "false" : "true"}
                onChange={(event) => {
                  clearFieldError("intakeNeeds");
                  setSelectedService(event.target.value as ServiceKey | "");
                }}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.intakeNeeds)}
                className={cn(
                  QUICK_FIELD_CLASS,
                  "quick-service-select w-full appearance-none border pr-10 border-border/22 focus-visible:border-fg/30",
                  selectedService ? "!text-fg/88 dark:!text-ivory" : "!text-fg/45 dark:!text-ivory/72"
                )}
              >
                <option value="">Select service</option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/48" aria-hidden="true" />
            </div>
            <FieldErrorText id="quick-lead-service-error" message={fieldErrors.intakeNeeds} />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:items-start">
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="quick-lead-message" className="sr-only">
              Short Message
            </label>
            <Textarea
              id="quick-lead-message"
              name="message"
              maxLength={320}
              placeholder="Short message (1-2 lines)"
              className={cn(QUICK_FIELD_CLASS, "h-12 min-h-[3rem] resize-none py-3")}
              aria-invalid={Boolean(fieldErrors.message)}
              onChange={() => clearFieldError("message")}
            />
            <FieldErrorText id="quick-lead-message-error" message={fieldErrors.message} />
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-accentA/45 bg-accent-gradient px-6 text-ivory shadow-[0_10px_22px_rgba(0,82,204,0.22)] hover:border-accentA/55 hover:brightness-105 focus-visible:border-accentA/55 focus-visible:text-ivory focus-visible:ring-accentA/70"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : "Send Inquiry"}
          </Button>
        </div>
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
