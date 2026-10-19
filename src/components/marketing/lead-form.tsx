"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldErrorText, FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { SubmissionModal } from "@/components/ui/submission-modal";
import { Textarea } from "@/components/ui/textarea";
import { fieldErrorsFromZod, submitJsonForm, type FormFieldErrors } from "@/lib/forms/shared";
import { trackConversion } from "@/lib/analytics-events";
import { cn } from "@/lib/utils";
import { publicLeadSchema } from "@/lib/validation/schemas";
import { BotTrap } from "@/components/marketing/bot-trap";
import { withBotFields } from "@/lib/forms/bot-trap";

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

const QUICK_FIELD_CLASS =
  "h-12 rounded-[14px] border border-transparent bg-bg px-4 text-[0.9375rem] text-fg placeholder:text-fg/50 transition-colors hover:border-fg/15 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-accentB aria-[invalid=true]:border-accentB";
/** Small visible labels above each field. */
const QUICK_LABEL_CLASS = "block text-[0.8125rem] font-semibold leading-5 text-fg";

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
      const result = await submitJsonForm<LeadSubmitResponse>("/api/leads", withBotFields(form, parsed.data));

      if (result.success) {
        trackConversion({ name: "contact_form_submit", properties: { form: "quick_form" } });
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
      <form onSubmit={onSubmit} className="lead-form-premium relative space-y-4" aria-label="Quick start lead form">
        <BotTrap />
        <FormAlert message={submitError} className="border-amber-500/30 bg-amber-50 text-amber-800" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="quick-lead-name" className={QUICK_LABEL_CLASS}>
              Full name
            </label>
            <Input
              id="quick-lead-name"
              name="name"
              autoComplete="name"
              required
              placeholder="Your full name"
              className={QUICK_FIELD_CLASS}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "quick-lead-name-error" : undefined}
              onChange={() => clearFieldError("name")}
            />
            <FieldErrorText id="quick-lead-name-error" message={fieldErrors.name} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="quick-lead-email" className={QUICK_LABEL_CLASS}>
              Email
            </label>
            <Input
              id="quick-lead-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              className={QUICK_FIELD_CLASS}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "quick-lead-email-error" : undefined}
              onChange={() => clearFieldError("email")}
            />
            <FieldErrorText id="quick-lead-email-error" message={fieldErrors.email} />
          </div>

          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <label htmlFor="quick-lead-service" className={QUICK_LABEL_CLASS}>
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
                aria-describedby={fieldErrors.intakeNeeds ? "quick-lead-service-error" : undefined}
                className={cn(QUICK_FIELD_CLASS, "quick-service-select w-full cursor-pointer appearance-none pr-10 focus-visible:outline-none")}
              >
                <option value="">Select service</option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/60" aria-hidden="true" />
            </div>
            <FieldErrorText id="quick-lead-service-error" message={fieldErrors.intakeNeeds} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:items-start">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="quick-lead-message" className={QUICK_LABEL_CLASS}>
              Short message
            </label>
            <Textarea
              id="quick-lead-message"
              name="message"
              maxLength={320}
              placeholder="A line or two about the project"
              className={cn(QUICK_FIELD_CLASS, "h-12 min-h-[3rem] resize-none py-3")}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? "quick-lead-message-error" : undefined}
              onChange={() => clearFieldError("message")}
            />
            <FieldErrorText id="quick-lead-message-error" message={fieldErrors.message} />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="h-12 w-full px-6 md:mt-[1.625rem]"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : "Send inquiry"}
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
