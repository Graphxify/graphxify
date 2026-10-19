import { FileText, FolderKanban, Users, TrendingUp } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/db/queries/analytics";
import { requirePermission } from "@/lib/auth/requireRole";
import AnalyticsClient from "./analytics-client";

export default async function DashboardAnalyticsPage() {
  const [, summary] = await Promise.all([
    requirePermission("analytics.view"),
    getAnalyticsSummary()
  ]);

  const stats = [
    {
      label: "Published blogs",
      value: summary.publishedPosts,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: "Published works",
      value: summary.publishedWorks,
      icon: <FolderKanban className="h-4 w-4" />,
    },
    {
      label: "Leads (7d)",
      value: summary.leads7,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: "Leads (30d)",
      value: summary.leads30,
      icon: <Users className="h-4 w-4" />,
    }
  ];

  const { draft, review, published } = summary.statusBreakdown;
  const statusTotal = draft + review + published || 1;

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-white py-1 pl-2.5 pr-3 text-[0.8125rem] font-semibold text-fg"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-fg" />Dashboard</p>
          <h1 className="text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">Analytics</h1>
        </RevealItem>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <div className="flex h-full flex-col justify-between gap-6 rounded-[1.75rem] bg-white p-5 md:p-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[0.8125rem] font-semibold text-fg/60">{stat.label}</p>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg text-white">{stat.icon}</span>
                </div>
                <p className="text-[clamp(2rem,3vw,2.75rem)] font-extrabold leading-none tracking-[-0.05em] tabular-nums">{stat.value}</p>
              </div>
            </RevealItem>
          ))}
        </div>

        {/* ── Status breakdown ── */}
        <RevealItem>
          <Card>
            <CardHeader>
              <CardTitle>Content Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual bar */}
              <div className="flex h-3 overflow-hidden rounded-full bg-card/40">
                {draft > 0 && (
                  <div
                    className="bg-accentA/70 transition-all duration-500"
                    style={{ width: `${(draft / statusTotal) * 100}%` }}
                  />
                )}
                {review > 0 && (
                  <div
                    className="bg-accentA/70 transition-all duration-500"
                    style={{ width: `${(review / statusTotal) * 100}%` }}
                  />
                )}
                {published > 0 && (
                  <div
                    className="bg-green/70 transition-all duration-500"
                    style={{ width: `${(published / statusTotal) * 100}%` }}
                  />
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accentA/70" />
                  <span className="text-fg/62">Draft</span>
                  <span className="font-semibold tabular-nums">{draft}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accentA/70" />
                  <span className="text-fg/62">Review</span>
                  <span className="font-semibold tabular-nums">{review}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green/70" />
                  <span className="text-fg/62">Published</span>
                  <span className="font-semibold tabular-nums">{published}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </RevealItem>

        {/* ── Activity chart ── */}
        <RevealItem>
          <Card>
            <CardHeader>
              <CardTitle>Activity in last 14 days</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsClient data={summary.activity} />
            </CardContent>
          </Card>
        </RevealItem>


      </RevealStagger>
    </section>
  );
}
