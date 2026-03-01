import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/db/queries/analytics";
import { requireAuth } from "@/lib/auth/requireRole";

export default async function DashboardHomePage() {
  const profile = await requireAuth();
  const summary = await getAnalyticsSummary();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-sm text-[rgba(242,240,235,0.75)]">Signed in as {profile.email} ({profile.role.toUpperCase()})</p>
      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle>Leads (30d)</CardTitle>
          </CardHeader>
          <CardContent>{summary.leads30}</CardContent>
        </Card>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/posts" className="text-accentA">Manage posts</Link>
        <Link href="/dashboard/works" className="text-accentA">Manage works</Link>
        <Link href="/dashboard/activity" className="text-accentA">View activity logs</Link>
      </div>
    </section>
  );
}
