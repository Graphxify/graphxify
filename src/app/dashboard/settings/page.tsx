import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { requireRole } from "@/lib/auth/requireRole";
import { env } from "@/lib/env";
import { SettingsClient } from "./settings-client";
import { loadAllSettings } from "./settings-actions";



export default async function DashboardSettingsPage() {
  await requireRole(["admin"]);

  const settings = await loadAllSettings();

  const smtpDisplay = {
    host: env.SMTP_HOST || "",
    port: env.SMTP_PORT || "",
    from: env.SMTP_FROM || "",
    owner: env.OWNER_NOTIFY_EMAIL || ""
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
            smtpDisplay={smtpDisplay}
          />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
