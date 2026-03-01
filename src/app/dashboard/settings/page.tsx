import { requireRole } from "@/lib/auth/requireRole";
import { env } from "@/lib/env";

export default async function DashboardSettingsPage() {
  await requireRole(["admin"]);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="rounded-xl border border-[rgba(242,240,235,0.15)] p-4 text-sm">
        <p>Owner notify email: {env.OWNER_NOTIFY_EMAIL ? "Configured" : "Missing"}</p>
        <p>Resend API key: {env.RESEND_API_KEY ? "Configured" : "Missing"}</p>
        <p>SMTP: {env.SMTP_HOST && env.SMTP_USER ? "Configured" : "Missing"}</p>
        <p>Rate limiting (Upstash): {env.UPSTASH_REDIS_REST_URL ? "Configured" : "Fallback memory mode"}</p>
      </div>
    </section>
  );
}
