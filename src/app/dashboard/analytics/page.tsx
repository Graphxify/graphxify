import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/db/queries/analytics";
import { requireRole } from "@/lib/auth/requireRole";

const AnalyticsChart = dynamic(
  () => import("@/app/dashboard/(components)/analytics-chart").then((mod) => mod.AnalyticsChart),
  { ssr: false }
);

export default async function DashboardAnalyticsPage() {
  await requireRole(["admin", "mod"]);
  const summary = await getAnalyticsSummary();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Published posts</CardTitle>
          </CardHeader>
          <CardContent>{summary.publishedPosts}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Published works</CardTitle>
          </CardHeader>
          <CardContent>{summary.publishedWorks}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leads (7d)</CardTitle>
          </CardHeader>
          <CardContent>{summary.leads7}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leads (30d)</CardTitle>
          </CardHeader>
          <CardContent>{summary.leads30}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draft vs Review vs Published (posts)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <p>Draft: {summary.statusBreakdown.draft}</p>
          <p>Review: {summary.statusBreakdown.review}</p>
          <p>Published: {summary.statusBreakdown.published}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity (last 14 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={summary.activity} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most viewed content hook</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[rgba(242,240,235,0.76)]">
            Table `page_views` can be integrated here for top pages and trend lines. Query stub intentionally kept lightweight.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
