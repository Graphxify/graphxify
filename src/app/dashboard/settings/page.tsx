import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { requireRole } from "@/lib/auth/requireRole";
import { env } from "@/lib/env";
import { SettingsClient } from "./settings-client";
import { loadAllSettings } from "./settings-actions";

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  await requireRole(["admin"]);

  const settings = await loadAllSettings();

  const systemChecks = [
    { label: "Supabase", ok: Boolean(env.NEXT_PUBLIC_SUPABASE_URL) },
    { label: "SMTP Connection", ok: Boolean(env.SMTP_HOST && env.SMTP_USER) },
    { label: "SMTP Sender", ok: Boolean(env.SMTP_FROM) },
    { label: "Owner Email", ok: Boolean(env.OWNER_NOTIFY_EMAIL) },
    { label: "Rate Limiting", ok: Boolean(env.UPSTASH_REDIS_REST_URL) },
    { label: "Service Role Key", ok: Boolean(env.SUPABASE_SERVICE_ROLE_KEY) }
  ];

  const smtpDisplay = {
    host: env.SMTP_HOST || "",
    port: env.SMTP_PORT || "",
    from: env.SMTP_FROM || "",
    owner: env.OWNER_NOTIFY_EMAIL || ""
  };

  const environmentInfo = {
    env: process.env.NODE_ENV === "production" ? "Production" : "Development",
    version: "1.0.0",
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL?.replace(/https?:\/\//, "").split(".")[0] || "–"
  };

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Admin</p>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="text-sm text-fg/48">Manage your CMS configuration, email, security, and integrations.</p>
        </RevealItem>

        <RevealItem>
          <SettingsClient
            settings={settings}
            systemChecks={systemChecks}
            smtpDisplay={smtpDisplay}
            environmentInfo={environmentInfo}
          />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
