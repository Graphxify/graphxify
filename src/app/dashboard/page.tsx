import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/db/queries/analytics";
import { requireAuth } from "@/lib/auth/requireRole";

export default async function DashboardHomePage() {
  const profile = await requireAuth();
  const summary = await getAnalyticsSummary();

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Dashboard</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Overview</h1>
          <p className="text-sm text-fg/62">
            Signed in as {profile.email} ({profile.role.toUpperCase()})
          </p>
        </RevealItem>

        <div className="grid gap-4 md:grid-cols-3">
          <RevealItem>
            <Card>
              <CardHeader>
                <CardTitle>Published posts</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">{summary.publishedPosts}</CardContent>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <CardHeader>
                <CardTitle>Published works</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">{summary.publishedWorks}</CardContent>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <CardHeader>
                <CardTitle>Leads (30d)</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">{summary.leads30}</CardContent>
            </Card>
          </RevealItem>
        </div>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-5 text-sm text-fg/72">
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard/posts" className="link-sweep">
                Manage posts
              </Link>
              <Link href="/dashboard/works" className="link-sweep">
                Manage works
              </Link>
              <Link href="/dashboard/activity" className="link-sweep">
                View activity logs
              </Link>
            </div>
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
