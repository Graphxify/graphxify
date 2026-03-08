import { FileText, FolderKanban, Users, TrendingUp } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/db/queries/analytics";
import { requireRole } from "@/lib/auth/requireRole";
import AnalyticsClient from "./analytics-client";

export default async function DashboardAnalyticsPage() {
  await requireRole(["admin", "mod"]);
  const summary = await getAnalyticsSummary();

  const stats = [
    {
      label: "Published posts",
      value: summary.publishedPosts,
      icon: <FileText className="h-4 w-4" />,
      color: "text-sky-400",
      bg: "bg-sky-500/8"
    },
    {
      label: "Published works",
      value: summary.publishedWorks,
      icon: <FolderKanban className="h-4 w-4" />,
      color: "text-violet-400",
      bg: "bg-violet-500/8"
    },
    {
      label: "Leads (7d)",
      value: summary.leads7,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/8"
    },
    {
      label: "Leads (30d)",
      value: summary.leads30,
      icon: <Users className="h-4 w-4" />,
      color: "text-amber-400",
      bg: "bg-amber-500/8"
    }
  ];

  const { draft, review, published } = summary.statusBreakdown;
  const statusTotal = draft + review + published || 1;

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Dashboard</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Analytics</h1>
        </RevealItem>

        {/* ── Stat cards ── */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-wider text-fg/48">{stat.label}</p>
                    <p className="text-xl font-bold tabular-nums">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
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
                    className="bg-amber-500/70 transition-all duration-500"
                    style={{ width: `${(draft / statusTotal) * 100}%` }}
                  />
                )}
                {review > 0 && (
                  <div
                    className="bg-sky-500/70 transition-all duration-500"
                    style={{ width: `${(review / statusTotal) * 100}%` }}
                  />
                )}
                {published > 0 && (
                  <div
                    className="bg-emerald-500/70 transition-all duration-500"
                    style={{ width: `${(published / statusTotal) * 100}%` }}
                  />
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <span className="text-fg/62">Draft</span>
                  <span className="font-semibold tabular-nums">{draft}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500/70" />
                  <span className="text-fg/62">Review</span>
                  <span className="font-semibold tabular-nums">{review}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
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

        {/* ── Most viewed placeholder ── */}
        <RevealItem>
          <Card>
            <CardHeader>
              <CardTitle>Most viewed content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fg/48">
                Use the <code className="rounded bg-card/60 px-1.5 py-0.5 text-xs">page_views</code> table to render top paths and trend lines.
              </p>
            </CardContent>
          </Card>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
