import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { requireRole } from "@/lib/auth/requireRole";

export default async function DashboardWebhooksPage() {
  await requireRole(["admin"]);

  return (
    <section className="space-y-4">
      <RevealStagger className="space-y-4">
        <RevealItem>
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Admin</p>
        </RevealItem>
        <RevealItem>
          <h1 className="text-3xl font-semibold">Webhooks</h1>
        </RevealItem>
        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-5 text-sm text-fg/72">
            Optional webhook management area. Add endpoint signing secrets and retry strategy controls in this section when needed.
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
