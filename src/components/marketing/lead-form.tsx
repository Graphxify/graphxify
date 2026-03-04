"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Status = { type: "success" | "error"; message: string } | null;

const SERVICE_OPTIONS = [
  { key: "brand-systems", label: "Brand Systems" },
  { key: "web-design", label: "Web Design" },
  { key: "web-development", label: "Web Development" },
  { key: "cms-architecture", label: "CMS Architecture" },
  { key: "something-else", label: "Something Else" }
] as const;

const QUICK_FIELD_CLASS = "h-12 rounded-xl border-border/18 bg-bg/62 px-4 text-sm placeholder:text-fg/45 placeholder:opacity-100";

type ServiceKey = (typeof SERVICE_OPTIONS)[number]["key"];

export function LeadForm(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [selectedService, setSelectedService] = useState<ServiceKey | "">("");
  const [serviceError, setServiceError] = useState("");
  const [messageError, setMessageError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setServiceError("");
    setMessageError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = String(formData.get("message") || "").trim();

    let hasError = false;

    if (!selectedService) {
      setServiceError("Select a service.");
      hasError = true;
    }

    if (message.length < 8) {
      setMessageError("Add a short project summary (at least 8 characters).");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const selectedServiceLabel = SERVICE_OPTIONS.find((item) => item.key === selectedService)?.label ?? "Not specified";
    const builtMessage = ["Quick Start Inquiry", `Service: ${selectedServiceLabel}`, "", message].join("\n");

    setLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: builtMessage,
          intakeNeeds: selectedService ? [selectedService] : []
        })
      });

      const payload = (await response.json()) as { message?: string };

      if (response.ok) {
        form.reset();
        setSelectedService("");
        setStatus({ type: "success", message: "Inquiry sent. We'll reply with next steps shortly." });
      } else {
        setStatus({ type: "error", message: payload.message || "Could not submit your request." });
      }
    } catch {
      setStatus({ type: "error", message: "Could not submit your request." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="lead-form-premium space-y-3" aria-label="Quick start lead form">
      <AnimatePresence initial={false}>
        {status ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2 rounded-lg border border-border/20 bg-card/72 px-3 py-2 text-sm"
          >
            {status.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accentA" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accentB" />
            )}
            <span className="text-fg/78">{status.message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <label htmlFor="quick-lead-name" className="sr-only">
            Full Name
          </label>
          <Input id="quick-lead-name" name="name" autoComplete="name" required placeholder="Full Name" className={QUICK_FIELD_CLASS} />
        </div>

        <div className="space-y-1">
          <label htmlFor="quick-lead-email" className="sr-only">
            Email
          </label>
          <Input id="quick-lead-email" name="email" type="email" autoComplete="email" required placeholder="Email" className={QUICK_FIELD_CLASS} />
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
                setServiceError("");
                setSelectedService(event.target.value as ServiceKey | "");
              }}
              aria-required="true"
              aria-invalid={Boolean(serviceError)}
              className={cn(
                QUICK_FIELD_CLASS,
                "quick-service-select w-full appearance-none border pr-10 !border-accentA/45 focus-visible:!border-accentA/55",
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
          {serviceError ? <p className="text-xs text-accentB">{serviceError}</p> : null}
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
            required
            maxLength={320}
            placeholder="Short message (1-2 lines)"
            className={cn(QUICK_FIELD_CLASS, "h-12 min-h-[3rem] resize-none py-3")}
          />
          {messageError ? <p className="text-xs text-accentB">{messageError}</p> : null}
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          disabled={loading}
          className="h-12 w-full rounded-xl border border-accentA/45 bg-accent-gradient px-6 text-ivory shadow-[0_10px_22px_rgba(0,82,204,0.22)] hover:border-accentA/55 hover:brightness-105 focus-visible:border-accentA/55 focus-visible:text-ivory focus-visible:ring-accentA/70"
        >
          {loading ? "Sending..." : "Send Inquiry"}
        </Button>
      </div>
    </form>
  );
}
