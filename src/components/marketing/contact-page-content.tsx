"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Copy, Loader2, Lock, Phone, Upload } from "lucide-react";
import { useState } from "react";
import { ArrowLink } from "@/components/site/arrow-link";
import { Badge } from "@/components/site/badge";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FaqList } from "@/components/site/faq-list";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { Button } from "@/components/ui/button";
import { FieldErrorText, FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { SubmissionModal } from "@/components/ui/submission-modal";
import { Textarea } from "@/components/ui/textarea";
import { fieldErrorsFromZod, submitJsonForm, type FormFieldErrors } from "@/lib/forms/shared";
import { trackConversion } from "@/lib/analytics-events";
import { companyContact } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { publicLeadSchema } from "@/lib/validation/schemas";
import { BotTrap } from "@/components/marketing/bot-trap";
import { withBotFields } from "@/lib/forms/bot-trap";

type ModalState = { open: boolean; type: "success" | "error"; title: string; message: string };
type NotificationState = { status: "sent" | "disabled" | "skipped" | "failed" };
type LeadSubmitResponse = { id: string; notification?: NotificationState };

const HELP_OPTIONS = [
  { key: "brand-systems", title: "Brand Systems" },
  { key: "web-design", title: "Web Design" },
  { key: "web-development", title: "Web Development" },
  { key: "cms-architecture", title: "CMS Architecture" },
  { key: "something-else", title: "Something Else" }
] as const;

const BUDGET_OPTIONS = ["Brand Identity", "Starter Website", "Professional Website", "Full Brand and Website", "Not sure yet"] as const;
const TIMELINE_OPTIONS = ["ASAP", "2 to 4 weeks", "1 to 2 months", "3+ months", "Flexible"] as const;

const FAQ_ITEMS = [
  { q: "Do you work with small businesses?", a: "Yes. We support focused teams that need a clear system and a practical launch path." },
  { q: "Can you work with an existing brand?", a: "Absolutely. We can refine or extend your current brand while keeping consistency." },
  { q: "Do you offer CMS editing training?", a: "Yes. We include concise handoff guidance so your team can publish confidently." },
  { q: "What do you need to get started?", a: "Your goals, timeline, and any existing brand or website context are enough to begin." },
  { q: "Do you take website redesign projects?", a: "Yes, if the redesign has clear business goals and a defined implementation scope." }
] as const;

const START_LINKS = [
  { label: "Brand Systems", href: "/services/brand-systems", desc: "Logo suite, typography, colour palette, and guidelines" },
  { label: "Web Design", href: "/services/web-design", desc: "Visual design, UX strategy, and responsive UI" },
  { label: "Web Development", href: "/services/web-development", desc: "Custom Next.js builds with full code ownership" },
  { label: "CMS Architecture", href: "/services/cms-architecture", desc: "Structured content systems your team can manage" }
] as const;

const NEXT_STEPS = ["We review your inquiry personally", "We reply within 24 hours with a clear recommendation", "We schedule a call or agree next steps"] as const;

/** Fields on the dark form card: charcoal-2 wells, white text, electric focus ring (blue that holds contrast on charcoal). */
const FIELD_CLASS =
  "h-[3.25rem] rounded-[14px] border border-white/10 bg-charcoal-2 px-4 text-[0.9375rem] text-white placeholder:text-white/50 transition-colors hover:border-white/20 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-accentA aria-[invalid=true]:border-accentA";
const SELECT_CLASS = cn(
  FIELD_CLASS,
  "w-full cursor-pointer appearance-none pr-11 [color-scheme:dark] focus-visible:outline-none [&:has(option[value='']:checked)]:text-white/50 [&>option]:text-white"
);

function errorId(id: string, message?: string): string | undefined {
  return message ? `${id}-error` : undefined;
}

function Field({
  id,
  label,
  optional = false,
  error,
  className,
  children
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    // Error text is blue by default; on charcoal it needs the electric tone to stay readable.
    <div className={cn("space-y-2 [&>p[role=alert]]:text-[0.8125rem] [&>p[role=alert]]:font-medium [&>p[role=alert]]:text-accentA", className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-white">
        {label}
        {optional ? <span className="ml-1.5 font-medium text-white/50">(optional)</span> : null}
      </label>
      {children}
      <FieldErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

function FormGroup({ num, title, first = false, children }: { num: string; title: string; first?: boolean; children: React.ReactNode }): JSX.Element {
  const id = `contact-group-${num}`;
  return (
    <div role="group" aria-labelledby={id} className={cn(!first && "border-t border-white/10 pt-8 md:pt-10")}>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-white text-[0.8125rem] font-extrabold text-fg">
          {Number(num)}
        </span>
        <h2 id={id} className="text-xl font-bold tracking-[-0.02em] text-white md:text-[1.375rem]">
          {title}
        </h2>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

function FacebookIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.2 6.2H16V3.8h-2.1c-2.3 0-3.7 1.5-3.7 3.8V10H8v2.5h2.2v5.7h2.6v-5.7h2.4l.4-2.5h-2.8V8.1c0-1 .35-1.9 1.8-1.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="0.95" fill="currentColor" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3.4 7.2h4.7a2.25 2.25 0 1 1 0 4.5H3.4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.4 11.7h5.2a2.7 2.7 0 1 1 0 5.4H3.4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.6 9.2h5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.1 14.8a2.85 2.85 0 0 1 2.8-2.45c1.8 0 2.95 1.15 2.95 2.95v.3h-5.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.3 16.7c.34 1.05 1.31 1.72 2.68 1.72.98 0 1.82-.32 2.42-.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M14.2 4.1v8.8a3.45 3.45 0 1 1-2.25-3.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2 4.1c.68 2.03 2.06 3.53 4.2 4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2 8.25c1.5 0 2.85-.32 4.2-.93" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/graphxify", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.facebook.com/Graphxify", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.tiktok.com/@graphxify", label: "TikTok", Icon: TikTokIcon },
  { href: "https://www.behance.net/graphxify", label: "Behance", Icon: BehanceIcon }
] as const;

const SOMETHING_ELSE_KEY = "something-else";

function getTextValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function ContactPageContent(): JSX.Element {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, type: "success", title: "", message: "" });
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [customNeed, setCustomNeed] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [attachmentNotice, setAttachmentNotice] = useState("");

  const somethingElseSelected = selectedNeeds.includes(SOMETHING_ELSE_KEY);

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

  function toggleNeed(key: string): void {
    clearFieldError("intakeNeeds");

    setSelectedNeeds((prev) => {
      if (prev.includes(key)) {
        if (key === SOMETHING_ELSE_KEY) {
          setCustomNeed("");
          clearFieldError("customRequest");
        }
        return prev.filter((item) => item !== key);
      }
      return [...prev, key];
    });
  }

  async function copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(companyContact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFieldErrors({});
    setSubmitError("");
    setAttachmentNotice("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = getTextValue(formData, "name");
    const email = getTextValue(formData, "email");
    const company = getTextValue(formData, "company");
    const website = getTextValue(formData, "website");
    const budget = getTextValue(formData, "budget");
    const timeline = getTextValue(formData, "timeline");
    const message = getTextValue(formData, "message");
    const payload = {
      source: "contact" as const,
      name,
      email,
      company,
      website,
      budgetRange: budget,
      timeline,
      message,
      intakeNeeds: selectedNeeds,
      customRequest: somethingElseSelected ? customNeed.trim() : "",
      attachments: [],
      consent: consentChecked
    };

    const parsed = publicLeadSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }

    setLoading(true);

    const attachmentFiles = formData
      .getAll("briefFiles")
      .filter((item): item is File => item instanceof File)
      .filter((file) => file.name.length > 0);

    const uploadPromises = attachmentFiles.map(async (file) => {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = await fetch("/api/uploads/public", { method: "POST", body: uploadData });
      if (res.ok) {
        const json = (await res.json()) as { url: string };
        return { ok: true as const, url: json.url };
      }
      return { ok: false as const };
    });

    const uploadResults = await Promise.allSettled(uploadPromises);
    const attachmentUrls = uploadResults.flatMap((result) => {
      if (result.status !== "fulfilled" || !result.value.ok || !result.value.url) {
        return [];
      }

      return [result.value.url];
    });

    const failedUploads = uploadResults.length - attachmentUrls.length;
    const uploadNotice =
      failedUploads === 0
        ? ""
        : failedUploads === 1
          ? "One attachment could not be uploaded. Your inquiry was sent without it."
          : `${failedUploads} attachments could not be uploaded. Your inquiry was sent without them.`;

    if (failedUploads > 0) {
      setAttachmentNotice(uploadNotice);
    }

    try {
      const result = await submitJsonForm<LeadSubmitResponse>("/api/leads", withBotFields(form, {
        ...parsed.data,
        attachments: attachmentUrls
      }));

      if (result.success) {
        trackConversion({ name: "contact_form_submit", properties: { form: "contact_page" } });
        const notificationStatus = result.data?.notification?.status;
        const hasWarning = notificationStatus === "failed" || notificationStatus === "skipped";
        form.reset();
        setSelectedNeeds([]);
        setCustomNeed("");
        setConsentChecked(false);
        setAttachmentNotice("");
        setModal({
          open: true,
          type: hasWarning ? "error" : "success",
          title: hasWarning ? "Inquiry Saved With Warning" : "Inquiry Sent Successfully",
          message: uploadNotice ? `${result.message} ${uploadNotice}` : result.message
        });
      } else if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        // Validation errors — show inline so the user can fix specific fields
        setFieldErrors(result.fieldErrors);
        setSubmitError(result.message);
      } else {
        // Server / network error — show error modal with a clear message
        setModal({
          open: true,
          type: "error",
          title: "Something Went Wrong",
          message: result.message || "We couldn't send your inquiry. Please try again in a moment."
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="container pb-12 pt-8 md:pb-16 md:pt-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <div className="mt-8 flex flex-col items-center gap-6 text-center md:mt-12">
          <Badge dot="green">Available for new projects</Badge>
          <h1 className="t-h1 max-w-[16ch] text-fg">
            Start a <span className="text-accentB">project</span>
          </h1>
          <p className="t-lead max-w-[52ch]">
            Tell us about your business and what you are working towards. We review every inquiry personally and respond with a clear recommendation.
          </p>
        </div>
      </header>

      <section aria-label="Project inquiry" className="container pb-20 md:pb-28">
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-8">
            <div className="relative isolate overflow-hidden rounded-[2rem] bg-charcoal p-6 text-white sm:p-10 md:rounded-[2.5rem] md:p-12">
              <div aria-hidden="true" className="absolute -right-32 -top-40 -z-10 h-[42rem] w-[42rem] -m-[8rem] bg-[radial-gradient(closest-side,rgba(0,163,255,0.24),transparent)]" />
              {/* noValidate: the schema below covers every native rule and shows its message under the field. */}
              <form onSubmit={onSubmit} noValidate className="relative space-y-8 md:space-y-10" aria-label="Project inquiry form">
                <BotTrap />
                {submitError || attachmentNotice ? (
                  <div className="space-y-3">
                    <FormAlert message={submitError} />
                    <FormAlert message={attachmentNotice} type="info" />
                  </div>
                ) : null}

                <FormGroup num="01" title="About you" first>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field id="contact-name" label="Full name" error={fieldErrors.name}>
                      <Input
                        id="contact-name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Your full name"
                        className={FIELD_CLASS}
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={errorId("contact-name", fieldErrors.name)}
                        onChange={() => clearFieldError("name")}
                      />
                    </Field>
                    <Field id="contact-email" label="Email" error={fieldErrors.email}>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        className={FIELD_CLASS}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={errorId("contact-email", fieldErrors.email)}
                        onChange={() => clearFieldError("email")}
                      />
                    </Field>
                    <Field id="contact-company" label="Company or brand" optional>
                      <Input id="contact-company" name="company" autoComplete="organization" placeholder="Company name" className={FIELD_CLASS} />
                    </Field>
                    <Field id="contact-website" label="Website or link" optional error={fieldErrors.website}>
                      <Input
                        id="contact-website"
                        name="website"
                        type="url"
                        inputMode="url"
                        placeholder="https://"
                        className={FIELD_CLASS}
                        aria-invalid={Boolean(fieldErrors.website)}
                        aria-describedby={errorId("contact-website", fieldErrors.website)}
                        onChange={() => clearFieldError("website")}
                      />
                    </Field>
                  </div>
                </FormGroup>

                <FormGroup num="02" title="Your project">
                  <fieldset className="space-y-3" aria-describedby="contact-help-description contact-help-error">
                    <legend className="text-sm font-semibold text-white">What can we help you build?</legend>
                    <p id="contact-help-description" className="text-sm text-white/60">
                      Select one or more options so we can route your project properly.
                    </p>

                    <div className="flex flex-wrap gap-2.5 pt-1" role="group" aria-label="Service options">
                      {HELP_OPTIONS.map((option) => {
                        const active = selectedNeeds.includes(option.key);

                        return (
                          <button
                            key={option.key}
                            type="button"
                            role="checkbox"
                            aria-checked={active}
                            onClick={() => toggleNeed(option.key)}
                            className={cn(
                              "inline-flex h-12 items-center gap-2.5 rounded-full pl-2 pr-5 text-[0.9375rem] font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98]",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
                              active
                                ? "bg-white text-fg"
                                : "bg-charcoal-2 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.32)]"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-200",
                                active ? "bg-green text-fg" : "text-transparent shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.24)]"
                              )}
                            >
                              <Check className="h-4 w-4" strokeWidth={3} />
                            </span>
                            {option.title}
                          </button>
                        );
                      })}
                    </div>

                    <p
                      id="contact-help-error"
                      aria-live="polite"
                      className={cn("text-[0.8125rem] font-medium text-accentA transition-opacity duration-200", fieldErrors.intakeNeeds ? "opacity-100" : "sr-only opacity-0")}
                    >
                      {fieldErrors.intakeNeeds || " "}
                    </p>

                    <AnimatePresence initial={false} mode="wait">
                      {somethingElseSelected ? (
                        <motion.div
                          key="custom-service"
                          initial={reducedMotion ? false : { opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reducedMotion ? {} : { opacity: 0, y: -4 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="pt-2"
                        >
                          <Field id="contact-custom-need" label="Custom request" error={fieldErrors.customRequest}>
                            <Input
                              id="contact-custom-need"
                              name="customNeed"
                              value={customNeed}
                              onChange={(event) => {
                                clearFieldError("customRequest");
                                setCustomNeed(event.target.value);
                              }}
                              placeholder="Tell us what you need"
                              className={FIELD_CLASS}
                              aria-invalid={Boolean(fieldErrors.customRequest)}
                              aria-describedby={errorId("contact-custom-need", fieldErrors.customRequest)}
                            />
                          </Field>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </fieldset>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field id="contact-budget" label="Project scope" optional>
                      <div className="relative">
                        <select id="contact-budget" name="budget" className={SELECT_CLASS} defaultValue="">
                          <option value="" disabled>
                            Select project type
                          </option>
                          {BUDGET_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
                      </div>
                    </Field>
                    <Field id="contact-timeline" label="Timeline" optional>
                      <div className="relative">
                        <select id="contact-timeline" name="timeline" className={SELECT_CLASS} defaultValue="">
                          <option value="" disabled>
                            Select timeline
                          </option>
                          {TIMELINE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
                      </div>
                    </Field>
                  </div>
                </FormGroup>

                <FormGroup num="03" title="Details">
                  <Field id="contact-message" label="Message" optional error={fieldErrors.message}>
                    <Textarea
                      id="contact-message"
                      name="message"
                      maxLength={1200}
                      placeholder="Share goals, scope, and timeline in a few lines."
                      className={cn(FIELD_CLASS, "h-auto min-h-[10rem] py-3.5")}
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={errorId("contact-message", fieldErrors.message)}
                      onChange={() => clearFieldError("message")}
                    />
                  </Field>

                  <Field id="contact-files" label="Attach a brief or brand guide" optional>
                    <div className="relative rounded-[14px] border border-dashed border-white/20 bg-charcoal-2 px-3 py-3 transition-colors focus-within:border-accentA focus-within:ring-2 focus-within:ring-accentA hover:border-white/35">
                      <Upload className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
                      <input
                        id="contact-files"
                        name="briefFiles"
                        type="file"
                        multiple
                        className="w-full cursor-pointer pr-8 text-sm text-white/60 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-[0.8125rem] file:font-semibold file:text-fg focus-visible:outline-none"
                        aria-label="Attach brief or brand guide"
                      />
                    </div>
                  </Field>

                  <div className="space-y-2 [&>p[role=alert]]:text-[0.8125rem] [&>p[role=alert]]:font-medium [&>p[role=alert]]:text-accentA">
                    <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] font-medium text-white/80">
                      <span className="relative mt-px grid h-5 w-5 shrink-0 place-items-center">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={consentChecked}
                          onChange={(event) => {
                            setConsentChecked(event.target.checked);
                            if (event.target.checked) clearFieldError("consent");
                          }}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/30 bg-charcoal-2 transition-colors checked:border-green checked:bg-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal aria-[invalid=true]:border-accentA"
                          aria-invalid={Boolean(fieldErrors.consent)}
                          aria-describedby={errorId("contact-consent", fieldErrors.consent)}
                          required
                        />
                        <Check aria-hidden="true" strokeWidth={3} className="pointer-events-none absolute h-3.5 w-3.5 text-fg opacity-0 peer-checked:opacity-100" />
                      </span>
                      <span>I agree to be contacted about my inquiry.</span>
                    </label>
                    <FieldErrorText id="contact-consent-error" message={fieldErrors.consent} />
                  </div>
                </FormGroup>

                <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:gap-6">
                  <Button
                    type="submit"
                    size="lg"
                    variant="inverse"
                    className="h-16 w-full shrink-0 px-10 text-base focus-visible:ring-accentA focus-visible:ring-offset-charcoal sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send inquiry
                        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                  <p className="text-sm leading-relaxed text-white/60">No sales pressure. Just a straightforward conversation about your project.</p>
                </div>
              </form>
            </div>
          </Reveal>

          <aside aria-label="Other ways to reach us" className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <Reveal delay={80} className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[2rem] bg-white p-6 md:p-7">
                <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-green text-fg">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <h2 className="mt-5 text-xl font-bold tracking-[-0.02em] text-fg">We reply within 24 hours</h2>
                <p className="t-small mt-2 leading-relaxed">You will hear back from a real person, not an automated reply. We review every inquiry and respond with a clear next step.</p>
              </div>

              <div className="rounded-[2rem] bg-white p-6 md:p-7">
                <h2 className="text-lg font-bold tracking-[-0.02em] text-fg">What happens next</h2>
                <ol className="mt-5 space-y-3.5">
                  {NEXT_STEPS.map((step, index) => (
                    <li key={step} className="flex items-start gap-3.5 text-[0.9375rem] font-semibold leading-snug text-fg">
                      <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-fg text-[0.75rem] font-extrabold text-white">
                        {index + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[2rem] bg-white p-6 md:p-7">
                <h2 className="text-lg font-bold tracking-[-0.02em] text-fg">Email us directly</h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <a href={`mailto:${companyContact.email}`} className="text-[1.0625rem] font-bold tracking-[-0.01em] text-fg underline-offset-4 hover:underline">
                    {companyContact.email}
                  </a>
                  <Button type="button" variant="secondary" size="sm" onClick={copyEmail} aria-live="polite" className="h-8 px-3">
                    {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Social profiles">
                  {SOCIAL_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-full bg-bg px-3.5 text-[0.8125rem] font-semibold text-fg/80 transition-colors hover:bg-fg hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentB"
                      >
                        <link.Icon className="h-4 w-4" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] bg-white p-6 md:p-7">
                <h2 className="text-lg font-bold tracking-[-0.02em] text-fg">Prefer to talk first?</h2>
                <p className="t-small mt-2 leading-relaxed">Happy to answer questions before you fill out the form. A quick call is always an option.</p>
                <Button asChild className="mt-5">
                  <a href={`tel:${companyContact.phoneHref}`}>
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {companyContact.phoneDisplay}
                  </a>
                </Button>
              </div>

              <p className="flex items-center gap-2.5 px-2 pt-1 text-sm font-medium text-fg/60 md:col-span-2 lg:col-span-1">
                <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                All inquiries are kept strictly confidential.
              </p>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="container section pt-0 md:pt-0">
        <Reveal>
          <SectionIntro badge="FAQ" title={<>Before you reach <span className="text-accentB">out</span></>} />
        </Reveal>
        <FaqList className="mx-auto mt-12 max-w-3xl md:mt-16" items={FAQ_ITEMS} />
      </section>

      {/* ── Not sure where to start ── */}
      <section className="container section pt-0 md:pt-0">
        <Reveal>
          <SectionIntro
            badge="Services"
            title={<>Not sure where to <span className="text-accentB">start</span>?</>}
            lead="Browse our services to find what fits your project, or reach out and we'll point you in the right direction."
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {START_LINKS.map((item, index) => (
            <Reveal as="li" key={item.href} delay={index * 60}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-[2rem] bg-white p-7 transition-shadow duration-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentB"
              >
                <span aria-hidden="true" className="grid h-10 w-10 place-items-center self-end rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="t-h3 mt-10 text-fg">{item.label}</span>
                <span className="t-body mt-2 !text-[0.9375rem]">{item.desc}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ArrowLink href="/services">See all services</ArrowLink>
        </div>
      </section>

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
