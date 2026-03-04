import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/db/queries/analytics";
import { requireRole } from "@/lib/auth/requireRole";
import AnalyticsClient from "./analytics-client";

export default async function DashboardAnalyticsPage() {
  await requireRole(["admin", "mod"]);
  const summary = await getAnalyticsSummary();

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Dashboard</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Analytics</h1>
        </RevealItem>

        <div className="grid gap-4 md:grid-cols-4">
          <RevealItem>
            <Card>
              <CardHeader>
                <CardTitle>Published posts</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{summary.publishedPosts}</CardContent>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <CardHeader>
                <CardTitle>Published works</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{summary.publishedWorks}</CardContent>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <CardHeader>
                <CardTitle>Leads (7d)</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{summary.leads7}</CardContent>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <CardHeader>
                <CardTitle>Leads (30d)</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{summary.leads30}</CardContent>
            </Card>
          </RevealItem>
        </div>

        <RevealItem>
          <Card>
            <CardHeader>
              <CardTitle>Draft / Review / Published</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-fg/72 md:grid-cols-3">
              <p>Draft: {summary.statusBreakdown.draft}</p>
              <p>Review: {summary.statusBreakdown.review}</p>
              <p>Published: {summary.statusBreakdown.published}</p>
            </CardContent>
          </Card>
        </RevealItem>

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

        <RevealItem>
          <Card>
            <CardHeader>
              <CardTitle>Most viewed content hook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fg/66">Use `page_views` table to render top paths and trend lines in this area.</p>
            </CardContent>
          </Card>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
