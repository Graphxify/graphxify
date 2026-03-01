import { requireRole } from "@/lib/auth/requireRole";

export default async function DashboardWebhooksPage() {
  await requireRole(["admin"]);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Webhooks</h1>
      <p className="text-sm text-[rgba(242,240,235,0.78)]">
        Optional webhook management surface. Endpoint signatures and retry rules can be configured in a future iteration.
      </p>
    </section>
  );
}
