import Link from "next/link";
import { TestimonialMetricsForm } from "@/app/dashboard/(components)/testimonial-metrics-form";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonialMetrics } from "@/db/queries/testimonial-metrics";
import { testimonialMetricsDefault } from "@/lib/constants";
import { requireRole } from "@/lib/auth/requireRole";

export const dynamic = "force-dynamic";

export default async function DashboardTestimonialMetricsPage() {
  await requireRole(["admin", "mod"]);

  const { rows, warning } = await getTestimonialMetrics();
  const initialRows =
    rows.length > 0
      ? rows.map((row) => ({
          id: row.id,
          value: row.value,
          label: row.label,
          sort_order: row.sort_order
        }))
      : testimonialMetricsDefault.map((row) => ({
          id: row.id,
          value: row.value,
          label: row.label,
          sort_order: row.sort_order
        }));

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Testimonials</p>
          <h1 className="text-3xl font-semibold">Metrics Card</h1>
        </RevealItem>

        <RevealItem>
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-fg/72">Edit the left stats card in the testimonials section.</p>
                <Link href="/dashboard/testimonials" className="link-sweep text-sm">
                  Back to testimonials
                </Link>
              </div>

              {warning ? <p className="text-sm text-fg/70">{warning}</p> : null}

              <TestimonialMetricsForm initialRows={initialRows} />
            </CardContent>
          </Card>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

