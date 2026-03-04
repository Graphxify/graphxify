"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Compass,
  Copy,
  Database,
  FileText,
  Mail,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  Upload,
  AlertTriangle,
  type LucideIcon
} from "lucide-react";
import { useMemo, useState } from "react";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { companyContact } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Status = { type: "success" | "error"; message: string } | null;

type HelpOption = {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const HELP_OPTIONS: HelpOption[] = [
  {
    key: "brand-systems",
    title: "Brand Systems",
    description: "Identity foundations that scale.",
    icon: Compass
  },
  {
    key: "web-design",
    title: "Web Design",
    description: "Structured UI and layouts.",
    icon: Palette
  },
  {
    key: "web-development",
    title: "Web Development",
    description: "Custom-coded builds.",
    icon: Code2
  },
  {
    key: "cms-architecture",
    title: "CMS Architecture",
    description: "Structured content systems.",
    icon: Database
  },
  {
    key: "something-else",
    title: "Something Else",
    description: "Custom request.",
    icon: Sparkles
  }
];

const BUDGET_OPTIONS = ["Under $2k", "$2k-$5k", "$5k-$10k", "$10k-$25k", "$25k+", "Not sure yet"] as const;
const TIMELINE_OPTIONS = ["ASAP", "2-4 weeks", "1-2 months", "3+ months", "Flexible"] as const;

const FAQ_ITEMS = [
  {
    id: "faq-small-business",
    question: "Do you work with small businesses?",
    answer: "Yes. We support focused teams that need a clear system and a practical launch path."
  },
  {
    id: "faq-existing-brand",
    question: "Can you work with an existing brand?",
    answer: "Absolutely. We can refine or extend your current brand while keeping consistency."
  },
  {
    id: "faq-cms-training",
    question: "Do you offer CMS editing training?",
    answer: "Yes. We include concise handoff guidance so your team can publish confidently."
  },
  {
    id: "faq-started",
    question: "What do you need to get started?",
    answer: "Your goals, timeline, and any existing brand or website context are enough to begin."
  },
  {
    id: "faq-redesign-only",
    question: "Do you take redesign-only projects?",
    answer: "Yes, if the redesign has clear business goals and a defined implementation scope."
  }
] as const;

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
const FIELD_CLASS = "h-12 rounded-xl border-border/22 bg-card/75 px-4 text-sm";

function getTextValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formatOptional(value: string, fallback = "Not provided"): string {
  return value.length > 0 ? value : fallback;
}

export function ContactPageContent(): JSX.Element {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [customNeed, setCustomNeed] = useState("");
  const [needError, setNeedError] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedTitles = useMemo(
    () => HELP_OPTIONS.filter((option) => selectedNeeds.includes(option.key)).map((option) => option.title),
    [selectedNeeds]
  );

  const somethingElseSelected = selectedNeeds.includes(SOMETHING_ELSE_KEY);

  function toggleNeed(key: string): void {
    setNeedError("");
    setStatus(null);

    setSelectedNeeds((prev) => {
      if (prev.includes(key)) {
        if (key === SOMETHING_ELSE_KEY) {
          setCustomNeed("");
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
    setStatus(null);

    let hasError = false;

    if (selectedNeeds.length === 0) {
      setNeedError("Select at least one option.");
      hasError = true;
    }

    if (somethingElseSelected && customNeed.trim().length < 3) {
      setNeedError("Add a short custom request.");
      hasError = true;
    }

    if (!consentChecked) {
      setConsentError("Consent is required before sending.");
      hasError = true;
    } else {
      setConsentError("");
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = getTextValue(formData, "name");
    const email = getTextValue(formData, "email");
    const company = getTextValue(formData, "company");
    const website = getTextValue(formData, "website");
    const budget = getTextValue(formData, "budget");
    const timeline = getTextValue(formData, "timeline");
    const message = getTextValue(formData, "message");

    const attachmentNames = formData
      .getAll("briefFiles")
      .filter((item): item is File => item instanceof File)
      .filter((file) => file.name.length > 0)
      .map((file) => file.name);

    const compiledMessage = [
      "Contact Inquiry",
      "",
      `Services: ${selectedTitles.join(", ")}`,
      somethingElseSelected ? `Custom request: ${customNeed.trim()}` : null,
      `Company / Brand: ${formatOptional(company)}`,
      `Website / Link: ${formatOptional(website)}`,
      `Budget range: ${formatOptional(budget, "Not selected")}`,
      `Timeline: ${formatOptional(timeline, "Not selected")}`,
      `Attachments: ${attachmentNames.length > 0 ? attachmentNames.join(", ") : "None"}`,
      "",
      "Message:",
      message
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n")
      .slice(0, 1950);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: compiledMessage,
          intakeNeeds: selectedNeeds,
          customRequest: somethingElseSelected ? customNeed.trim() : undefined,
          company,
          website,
          budgetRange: budget,
          timeline,
          attachments: attachmentNames
        })
      });

      const payload = (await response.json()) as { message?: string };

      if (response.ok) {
        form.reset();
        setSelectedNeeds([]);
        setCustomNeed("");
        setNeedError("");
        setConsentChecked(false);
        setConsentError("");
        setStatus({ type: "success", message: "Inquiry sent. We will reply within 24-48 hours." });
      } else {
        setStatus({ type: "error", message: payload.message || "Unable to submit your inquiry right now." });
      }
    } catch {
      setStatus({ type: "error", message: "Unable to submit your inquiry right now." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <SectionReveal className="container" effect="up">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/56">
            <span className="h-1.5 w-1.5 rounded-full bg-accentA" />
            Contact
          </p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.96] tracking-tight">Start a Project</h1>
          <span className="mt-3 block h-px w-20 bg-accent-gradient" />
          <p className="mt-4 max-w-2xl text-base text-fg/68 md:text-[1.04rem]">
            Tell us what you&apos;re building. We&apos;ll reply with next steps.
          </p>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell border-border/18 bg-card/76 p-5 md:p-7">
            <form onSubmit={onSubmit} className="lead-form-premium space-y-5" aria-label="Project inquiry form">
              <AnimatePresence initial={false}>
                {status ? (
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? {} : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm",
                      status.type === "success" ? "border-accentA/32 bg-accentA/8 text-fg/86" : "border-accentB/30 bg-accentB/10 text-fg/86"
                    )}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accentA" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accentB" />
                    )}
                    <span>{status.message}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                    Full Name
                  </label>
                  <Input id="contact-name" name="name" required autoComplete="name" placeholder="Your full name" className={FIELD_CLASS} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                    Email
                  </label>
                  <Input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={FIELD_CLASS} />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="contact-company" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                    Company / Brand
                  </label>
                  <Input id="contact-company" name="company" autoComplete="organization" placeholder="Optional" className={FIELD_CLASS} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-website" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                    Website / Link
                  </label>
                  <Input id="contact-website" name="website" type="url" inputMode="url" placeholder="Optional" className={FIELD_CLASS} />
                </div>
              </div>

              <fieldset className="space-y-3" aria-describedby="contact-help-description contact-help-error">
                <legend className="text-base font-semibold text-fg">What can we help you build?</legend>
                <p id="contact-help-description" className="text-sm text-fg/62">
                  Select one or more options so we can route your project properly.
                </p>

                <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Service options">
                  {HELP_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const active = selectedNeeds.includes(option.key);

                    return (
                      <button
                        key={option.key}
                        type="button"
                        role="checkbox"
                        aria-checked={active}
                        onClick={() => toggleNeed(option.key)}
                        className={cn(
                          "relative flex min-h-[7rem] flex-col rounded-xl border bg-card/76 p-4 text-left transition-all duration-200 ease-out",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/72 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                          active
                            ? "border-accentA/55 shadow-[0_0_0_1px_rgba(0,163,255,0.3),0_14px_30px_rgba(0,82,204,0.12)]"
                            : "border-border/20 hover:-translate-y-[1px] hover:border-border/35"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="inline-flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-fg/72" aria-hidden="true" />
                            <span className="text-sm font-semibold leading-tight text-fg">{option.title}</span>
                          </div>
                          <span
                            className={cn(
                              "inline-flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                              active ? "border-accentA/90 bg-accent-gradient text-ivory" : "border-border/28 text-transparent"
                            )}
                            aria-hidden="true"
                          >
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        </div>
                        <div className="mt-auto pt-3">
                          <p className="border-t border-border/14 pt-2 text-xs leading-[1.25rem] text-fg/62">{option.description}</p>
                        </div>
                        {active ? <span className="pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accentA" /> : null}
                      </button>
                    );
                  })}
                </div>

                <p
                  id="contact-help-error"
                  aria-live="polite"
                  className={cn("text-xs text-accentB transition-opacity duration-200", needError ? "opacity-100" : "opacity-0")}
                >
                  {needError || " "}
                </p>

                <AnimatePresence initial={false} mode="wait">
                  {somethingElseSelected ? (
                    <motion.div
                      key="custom-service"
                      initial={reducedMotion ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducedMotion ? {} : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-1.5"
                    >
                      <label htmlFor="contact-custom-need" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                        Custom Request
                      </label>
                      <Input
                        id="contact-custom-need"
                        name="customNeed"
                        value={customNeed}
                        onChange={(event) => {
                          setNeedError("");
                          setCustomNeed(event.target.value);
                        }}
                        placeholder="Tell us what you need"
                        className={FIELD_CLASS}
                        aria-invalid={Boolean(needError)}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </fieldset>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="contact-budget" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                    Budget Range
                  </label>
                  <div className="relative">
                    <select id="contact-budget" name="budget" className={cn(FIELD_CLASS, "w-full appearance-none pr-10")} defaultValue="">
                      <option value="">Select budget range</option>
                      {BUDGET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/48" aria-hidden="true" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-timeline" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                    Timeline
                  </label>
                  <div className="relative">
                    <select id="contact-timeline" name="timeline" className={cn(FIELD_CLASS, "w-full appearance-none pr-10")} defaultValue="">
                      <option value="">Select timeline</option>
                      {TIMELINE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/48" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={1200}
                  placeholder="Share goals, scope, and timeline in a few lines."
                  className="min-h-[9.5rem] rounded-xl border-border/22 bg-card/75 px-4 py-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-files" className="text-xs font-medium uppercase tracking-[0.14em] text-fg/58">
                  Attach Brief / Brand Guide
                </label>
                <div className="relative rounded-xl border border-dashed border-border/26 bg-card/62 px-4 py-3">
                  <Upload className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/45" aria-hidden="true" />
                  <input
                    id="contact-files"
                    name="briefFiles"
                    type="file"
                    multiple
                    className="w-full cursor-pointer text-sm text-fg/68 file:mr-3 file:rounded-md file:border-0 file:bg-accent-gradient file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ivory"
                    aria-label="Attach brief or brand guide"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 rounded-xl border border-border/18 bg-card/62 px-3.5 py-3 text-sm text-fg/76">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={consentChecked}
                    onChange={(event) => {
                      setConsentChecked(event.target.checked);
                      if (event.target.checked) {
                        setConsentError("");
                      }
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-border/30 text-accentA focus:ring-accentA/70"
                    aria-invalid={Boolean(consentError)}
                    required
                  />
                  <span>I agree to be contacted about my inquiry.</span>
                </label>
                <p className={cn("mt-1 text-xs text-accentB transition-opacity duration-200", consentError ? "opacity-100" : "opacity-0")} aria-live="polite">
                  {consentError || " "}
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </div>

          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <article className="section-shell border-border/18 bg-card/76 p-5 md:p-6">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-accentA" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Response time</h2>
              </div>
              <p className="mt-2 text-sm text-fg/66">Typically within 24-48 hours.</p>
            </article>

            <article className="section-shell border-border/18 bg-card/76 p-5 md:p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accentA" aria-hidden="true" />
                <h2 className="text-lg font-semibold">What happens next</h2>
              </div>
              <ol className="mt-4 space-y-3">
                <li className="flex items-start gap-3 border-b border-border/14 pb-3 text-sm text-fg/72">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/24 text-[0.66rem] text-accentA">
                    1
                  </span>
                  <span>We review your request</span>
                </li>
                <li className="flex items-start gap-3 border-b border-border/14 pb-3 text-sm text-fg/72">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/24 text-[0.66rem] text-accentA">
                    2
                  </span>
                  <span>We reply with questions or a call link</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-fg/72">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border/24 text-[0.66rem] text-accentA">
                    3
                  </span>
                  <span>We send a scope + next steps</span>
                </li>
              </ol>
            </article>

            <article className="section-shell border-border/18 bg-card/76 p-5 md:p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-fg/78">
                  <Mail className="h-4 w-4 text-accentA" aria-hidden="true" />
                  <a href={`mailto:${companyContact.email}`} className="link-sweep">
                    {companyContact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-fg/74">
                  <Phone className="h-4 w-4 text-accentA" aria-hidden="true" />
                  <a href={`tel:${companyContact.phoneHref}`} className="link-sweep">
                    {companyContact.phoneDisplay}
                  </a>
                </div>
                <div className="border-t border-border/14 pt-3 text-sm text-fg/72">
                  <div className="flex flex-wrap items-center gap-3">
                    {SOCIAL_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 text-fg/72 transition-colors hover:text-fg"
                      >
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black bg-transparent text-fg/74 transition group-hover:-translate-y-0.5 group-hover:border-transparent group-hover:bg-accent-gradient group-hover:text-ivory">
                          <link.Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="section-shell border-border/18 bg-card/76 p-5 md:p-6">
              <div className="flex items-center gap-2 text-sm text-fg/74">
                <ShieldCheck className="h-4 w-4 text-accentA" aria-hidden="true" />
                <span>We keep inquiries confidential and scoped.</span>
              </div>
            </article>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-10 md:mt-12" effect="up">
        <div className="section-shell border-border/18 bg-card/76 p-5 md:p-7">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <Accordion type="single" collapsible className="mt-3">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-border/14 transition-colors data-[state=open]:border-accentA/60">
                <AccordionTrigger icon="plusminus" className="text-base font-medium text-fg hover:text-fg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-fg/68">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-8 md:mt-10" effect="zoom">
        <div className="section-shell border-border/18 bg-card/76 px-5 py-5 md:px-7 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-fg/58">Prefer email?</p>
              <a href={`mailto:${companyContact.email}`} className="mt-1 inline-flex items-center gap-2 text-lg font-medium text-fg">
                <Mail className="h-4 w-4 text-accentA" aria-hidden="true" />
                {companyContact.email}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="secondary" className="px-4" onClick={copyEmail}>
                {copied ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </span>
                )}
              </Button>
              <Button asChild className="px-5">
                <a href={`mailto:${companyContact.email}`}>Email Us</a>
              </Button>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
