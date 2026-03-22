"use client";

import { useState, useTransition } from "react";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  Globe,
  Key,
  Loader2,
  Mail,
  Settings2,
  Shield,
  Trash2,
  XCircle
} from "lucide-react";
import {
  dangerDeletePendingReviewsAction,
  dangerResetSettingsAction,
  saveEmailNotificationsAction,
  saveGeneralSettingsAction,
  saveSecuritySettingsAction,
  saveSocialLinksAction,
  testSmtpAction
} from "./settings-actions";

/* ── Types ── */

type Props = {
  settings: Record<string, Record<string, unknown>>;
  smtpDisplay: { host: string; port: string; from: string; owner: string };
  smtpStatus: { ok: boolean; message?: string };
};

type Tab = "general" | "email" | "security" | "danger";

const TABS: { key: Tab; label: string; icon: typeof Settings2 }[] = [
  { key: "general", label: "General", icon: Settings2 },
  { key: "email", label: "Email", icon: Mail },
  { key: "security", label: "Security", icon: Shield },
  { key: "danger", label: "Danger Zone", icon: AlertTriangle }
];

/* ── Shared UI ── */

function SectionCard({ title, description, icon: Icon, children }: {
  title: string;
  description?: string;
  icon?: typeof Settings2;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/14 bg-card/60 p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        {Icon && <Icon className="h-4.5 w-4.5 text-accentA" />}
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      {description && <p className="mb-5 -mt-2 text-sm text-fg/56">{description}</p>}
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 md:grid-cols-[200px_1fr] md:items-center md:gap-4">
      <label className="text-xs font-medium uppercase tracking-[0.1em] text-fg/56">{label}</label>
      {children}
    </div>
  );
}

function FieldInput({ name, defaultValue, placeholder, type = "text", disabled }: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      className="h-10 rounded-lg border border-border/18 bg-bg/50 px-3 text-sm text-fg transition-colors placeholder:text-fg/28 focus:border-accentA/40 focus:outline-none focus:ring-1 focus:ring-accentA/20 disabled:opacity-50"
    />
  );
}

function ToggleRow({ name, label, defaultChecked, description }: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  description?: string;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <label className="flex items-start justify-between gap-4 rounded-lg border border-border/10 px-4 py-3 transition-colors hover:bg-card/40 cursor-pointer">
      <div>
        <p className="text-sm font-medium text-fg">{label}</p>
        {description && <p className="mt-0.5 text-xs text-fg/48">{description}</p>}
      </div>
      <input type="hidden" name={name} value="off" />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-accentA" : "bg-border/30"}`}
      >
        <input type="checkbox" name={name} checked={checked} readOnly className="sr-only" />
        <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </label>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
  ) : (
    <XCircle className="h-4 w-4 shrink-0 text-red-400" />
  );
}

function SaveButton({ pending, label = "Save changes" }: { pending: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-lg bg-accentA px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {pending ? "Saving..." : label}
    </button>
  );
}

function DangerButton({ onClick, loading, label, description }: {
  onClick: () => void;
  loading: boolean;
  label: string;
  description: string;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-red-500/15 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-fg">{label}</p>
        <p className="mt-0.5 text-xs text-fg/48">{description}</p>
      </div>
      {confirming ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setConfirming(false); onClick(); }}
            disabled={loading}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-600 px-3 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            Confirm
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="h-8 rounded-md border border-border/20 px-3 text-xs text-fg/60 hover:text-fg">
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="h-8 rounded-md border border-red-500/20 px-3 text-xs text-red-400 transition-colors hover:bg-red-500/8"
        >
          {label}
        </button>
      )}
    </div>
  );
}

/* ── Tab Components ── */

function GeneralTab({ settings }: { settings: Record<string, Record<string, unknown>> }) {
  const [pending, startTransition] = useTransition();
  const [socialPending, startSocialTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const [socialMsg, setSocialMsg] = useState("");

  const g = settings.general ?? {};
  const s = settings.social_links ?? {};

  return (
    <div className="space-y-5">
      <SectionCard title="Site Information" icon={Globe}>
        <form
          action={(fd) => startTransition(async () => {
            const r = await saveGeneralSettingsAction(fd);
            setMsg(r.ok ? "Saved" : r.error || "Error");
            setTimeout(() => setMsg(""), 3000);
          })}
          className="space-y-4"
        >
          <FieldRow label="Site Name"><FieldInput name="site_name" defaultValue={String(g.site_name ?? "Graphxify")} /></FieldRow>
          <FieldRow label="Site URL"><FieldInput name="site_url" defaultValue={String(g.site_url ?? "")} placeholder="https://graphxify.com" /></FieldRow>
          <FieldRow label="Support Email"><FieldInput name="support_email" type="email" defaultValue={String(g.support_email ?? "")} /></FieldRow>
          <FieldRow label="Contact Email"><FieldInput name="contact_email" type="email" defaultValue={String(g.contact_email ?? "")} /></FieldRow>
          <FieldRow label="Company Name"><FieldInput name="company_name" defaultValue={String(g.company_name ?? "")} /></FieldRow>
          <FieldRow label="Company Address"><FieldInput name="company_address" defaultValue={String(g.company_address ?? "")} placeholder="City, Country" /></FieldRow>
          <FieldRow label="Timezone">
            <select name="timezone" defaultValue={String(g.timezone ?? "America/Toronto")} className="h-10 rounded-lg border border-border/18 bg-bg/50 px-3 text-sm text-fg">
              <option value="America/Toronto">America/Toronto (EST)</option>
              <option value="America/New_York">America/New York (EST)</option>
              <option value="America/Chicago">America/Chicago (CST)</option>
              <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Berlin">Europe/Berlin (CET)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="UTC">UTC</option>
            </select>
          </FieldRow>
          <FieldRow label="Language">
            <select name="language" defaultValue={String(g.language ?? "en")} className="h-10 rounded-lg border border-border/18 bg-bg/50 px-3 text-sm text-fg">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="ar">Arabic</option>
            </select>
          </FieldRow>
          <div className="flex items-center gap-3 pt-2">
            <SaveButton pending={pending} />
            {msg && <span className="text-xs text-emerald-400">{msg}</span>}
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Social Links" description="Add your social media profile URLs.">
        <form
          action={(fd) => startSocialTransition(async () => {
            const r = await saveSocialLinksAction(fd);
            setSocialMsg(r.ok ? "Saved" : r.error || "Error");
            setTimeout(() => setSocialMsg(""), 3000);
          })}
          className="space-y-4"
        >
          {(["instagram","linkedin","twitter","behance","dribbble","tiktok","facebook"] as const).map((key) => (
            <FieldRow key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <FieldInput name={key} defaultValue={String(s[key] ?? "")} placeholder={`https://${key}.com/...`} />
            </FieldRow>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <SaveButton pending={socialPending} />
            {socialMsg && <span className="text-xs text-emerald-400">{socialMsg}</span>}
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

function EmailTab({
  settings,
  smtpDisplay,
  smtpStatus
}: {
  settings: Record<string, Record<string, unknown>>;
  smtpDisplay: Props["smtpDisplay"];
  smtpStatus: Props["smtpStatus"];
}) {
  const [pending, startTransition] = useTransition();
  const [testPending, startTestTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const n = settings.email_notifications ?? {};

  return (
    <div className="space-y-5">
      <SectionCard title="SMTP Configuration" icon={Mail} description="Email sending is configured via environment variables.">
        <div className="space-y-3">
          {!smtpStatus.ok && (
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-sm text-amber-200">
              {smtpStatus.message}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ["SMTP Host", smtpDisplay.host],
              ["SMTP Port", smtpDisplay.port],
              ["Sender Email", smtpDisplay.from],
              ["Owner Email", smtpDisplay.owner]
            ] as const).map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border/10 px-4 py-3">
                <p className="text-xs text-fg/48">{label}</p>
                <p className="mt-0.5 text-sm font-medium">{value || <span className="text-red-400">Not set</span>}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={testPending}
              onClick={() => startTestTransition(async () => {
                const r = await testSmtpAction();
                setTestMsg({ ok: r.ok, text: r.message });
                setTimeout(() => setTestMsg(null), 6000);
              })}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-accentA/30 bg-accentA/8 px-4 text-sm font-medium text-accentA transition-colors hover:bg-accentA/14 disabled:opacity-50"
            >
              {testPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
              Send Test Email
            </button>
            {testMsg && (
              <span className={`text-xs ${testMsg.ok ? "text-emerald-400" : "text-red-400"}`}>{testMsg.text}</span>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Notification Preferences" description="Control which events trigger email notifications.">
        <form
          action={(fd) => startTransition(async () => {
            const r = await saveEmailNotificationsAction(fd);
            setMsg(r.ok ? "Saved" : r.error || "Error");
            setTimeout(() => setMsg(""), 3000);
          })}
          className="space-y-3"
        >
          <ToggleRow name="contact_form" label="Contact form notifications" description="Notify owner when a contact form is submitted" defaultChecked={n.contact_form !== false} />
          <ToggleRow name="review_submission" label="Review submission notifications" description="Notify owner when a new review is submitted" defaultChecked={n.review_submission !== false} />
          <ToggleRow name="new_lead" label="New lead notifications" description="Notify owner when a new lead is created" defaultChecked={n.new_lead !== false} />
          <ToggleRow name="user_invitation" label="User invitation emails" description="Send branded invite emails when inviting CMS users" defaultChecked={n.user_invitation !== false} />
          <ToggleRow name="password_reset" label="Password reset emails" description="Send branded notification when resetting passwords" defaultChecked={n.password_reset !== false} />
          <div className="flex items-center gap-3 pt-2">
            <SaveButton pending={pending} />
            {msg && <span className="text-xs text-emerald-400">{msg}</span>}
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

function SecurityTab({ settings }: { settings: Record<string, Record<string, unknown>> }) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const sec = settings.security ?? {};

  return (
    <div className="space-y-5">
      <SectionCard title="Security Policies" icon={Shield}>
        <form
          action={(fd) => startTransition(async () => {
            const r = await saveSecuritySettingsAction(fd);
            setMsg(r.ok ? "Saved" : r.error || "Error");
            setTimeout(() => setMsg(""), 3000);
          })}
          className="space-y-4"
        >
          <ToggleRow name="require_strong_passwords" label="Require strong passwords" description="Enforce minimum 8 characters with uppercase, lowercase, and numbers" defaultChecked={sec.require_strong_passwords !== false} />
          <FieldRow label="Session Timeout">
            <div className="flex items-center gap-2">
              <FieldInput name="session_timeout_hours" type="number" defaultValue={String(sec.session_timeout_hours ?? 24)} />
              <span className="text-xs text-fg/48">hours</span>
            </div>
          </FieldRow>
          <FieldRow label="Login Rate Limit">
            <div className="flex items-center gap-2">
              <FieldInput name="login_rate_limit" type="number" defaultValue={String(sec.login_rate_limit ?? 10)} />
              <span className="text-xs text-fg/48">attempts / minute</span>
            </div>
          </FieldRow>
          <ToggleRow name="enable_2fa" label="Enable Two-Factor Authentication" description="Coming soon — this toggle is reserved for future 2FA support" defaultChecked={Boolean(sec.enable_2fa)} />
          <div className="flex items-center gap-3 pt-2">
            <SaveButton pending={pending} />
            {msg && <span className="text-xs text-emerald-400">{msg}</span>}
          </div>
        </form>
      </SectionCard>
    </div>
  );
}


function DangerZoneTab() {
  const [deletePending, startDeleteTransition] = useTransition();
  const [resetPending, startResetTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <div className="space-y-5">
      <SectionCard title="Danger Zone" icon={AlertTriangle} description="Destructive actions that cannot be undone. Use with caution.">
        <div className="space-y-3">
          <DangerButton
            label="Delete pending reviews"
            description="Remove all testimonials with 'pending' status from the database."
            loading={deletePending}
            onClick={() => startDeleteTransition(async () => {
              const r = await dangerDeletePendingReviewsAction();
              setMsg({ ok: r.ok, text: r.message });
              setTimeout(() => setMsg(null), 5000);
            })}
          />
          <DangerButton
            label="Reset CMS settings"
            description="Reset all CMS settings to factory defaults. This will not affect environment variables."
            loading={resetPending}
            onClick={() => startResetTransition(async () => {
              const r = await dangerResetSettingsAction();
              setMsg({ ok: r.ok, text: r.message });
              setTimeout(() => setMsg(null), 5000);
            })}
          />
        </div>
        {msg && (
          <p className={`mt-3 text-xs ${msg.ok ? "text-emerald-400" : "text-red-400"}`}>{msg.text}</p>
        )}
      </SectionCard>
    </div>
  );
}

/* ── Main Component ── */

export function SettingsClient({ settings, smtpDisplay, smtpStatus }: Props) {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Sidebar tabs */}
      <nav className="flex flex-row gap-1 overflow-x-auto lg:w-52 lg:shrink-0 lg:flex-col lg:overflow-visible" aria-label="Settings tabs">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? t.key === "danger"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-accentA/10 text-accentA"
                  : "text-fg/56 hover:bg-card/50 hover:text-fg/80"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {tab === "general" && <GeneralTab settings={settings} />}
        {tab === "email" && <EmailTab settings={settings} smtpDisplay={smtpDisplay} smtpStatus={smtpStatus} />}
        {tab === "security" && <SecurityTab settings={settings} />}
        {tab === "danger" && <DangerZoneTab />}
      </div>
    </div>
  );
}
