import { CheckCircle, XCircle } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/requireRole";
import { env } from "@/lib/env";

export default async function DashboardSettingsPage() {
  await requireRole(["admin"]);

  const checks = [
    { label: "Owner notify email", ok: Boolean(env.OWNER_NOTIFY_EMAIL) },
    { label: "Resend API key", ok: Boolean(env.RESEND_API_KEY) },
    { label: "SMTP (host + user)", ok: Boolean(env.SMTP_HOST && env.SMTP_USER) },
    { label: "Rate limiting (Upstash)", ok: Boolean(env.UPSTASH_REDIS_REST_URL) }
  ];

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Admin</p>
          <h1 className="text-3xl font-semibold">System Status</h1>
        </RevealItem>

        <RevealItem>
          <div className="grid gap-3 sm:grid-cols-2">
            {checks.map((check) => (
              <Card key={check.label}>
                <CardContent className="flex items-center gap-3 p-4">
                  {check.ok ? (
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{check.label}</p>
                    <p className="text-xs text-fg/48">{check.ok ? "Configured" : "Not configured"}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
