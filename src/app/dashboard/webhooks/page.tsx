import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { requireRole } from "@/lib/auth/requireRole";

export default async function DashboardWebhooksPage() {
  await requireRole(["admin"]);

  return (
    <section className="space-y-4">
      <RevealStagger className="space-y-4">
        <RevealItem>
          <p className="inline-flex items-center gap-2 rounded-full bg-white py-1 pl-2.5 pr-3 text-[0.8125rem] font-semibold text-fg"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-fg" />Admin</p>
        </RevealItem>
        <RevealItem>
          <h1 className="text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">Webhooks</h1>
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
