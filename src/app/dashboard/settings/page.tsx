import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { requireRole } from "@/lib/auth/requireRole";
import { env } from "@/lib/env";

export default async function DashboardSettingsPage() {
  await requireRole(["admin"]);

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Admin</p>
          <h1 className="text-3xl font-semibold">Settings</h1>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-5 text-sm text-fg/72">
            <p>Owner notify email: {env.OWNER_NOTIFY_EMAIL ? "Configured" : "Missing"}</p>
            <p className="mt-2">Resend API key: {env.RESEND_API_KEY ? "Configured" : "Missing"}</p>
            <p className="mt-2">SMTP: {env.SMTP_HOST && env.SMTP_USER ? "Configured" : "Missing"}</p>
            <p className="mt-2">Rate limiting (Upstash): {env.UPSTASH_REDIS_REST_URL ? "Configured" : "Fallback memory mode"}</p>
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
