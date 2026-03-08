import Link from "next/link";
import { FileText, FolderKanban, Users, ArrowRight } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/db/queries/analytics";
import { requireAuth } from "@/lib/auth/requireRole";

export default async function DashboardHomePage() {
  const profile = await requireAuth();
  const summary = await getAnalyticsSummary();

  const stats = [
    {
      label: "Published posts",
      value: summary.publishedPosts,
      icon: <FileText className="h-5 w-5" />,
      color: "text-sky-400",
      border: "border-l-sky-500/50",
      bg: "bg-sky-500/8"
    },
    {
      label: "Published works",
      value: summary.publishedWorks,
      icon: <FolderKanban className="h-5 w-5" />,
      color: "text-violet-400",
      border: "border-l-violet-500/50",
      bg: "bg-violet-500/8"
    },
    {
      label: "Leads (30d)",
      value: summary.leads30,
      icon: <Users className="h-5 w-5" />,
      color: "text-emerald-400",
      border: "border-l-emerald-500/50",
      bg: "bg-emerald-500/8"
    }
  ];

  const quickLinks = [
    { href: "/dashboard/posts", label: "Manage posts" },
    { href: "/dashboard/works", label: "Manage works" },
    { href: "/dashboard/leads", label: "View leads" },
    { href: "/dashboard/activity", label: "Activity logs" }
  ];

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Dashboard</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Overview</h1>
        </RevealItem>

        {/* ── Stat cards ── */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <Card className={`border-l-[3px] ${stat.border}`}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-fg/56">{stat.label}</p>
                    <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </div>

        {/* ── Quick links ── */}
        <RevealItem>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between rounded-xl border border-border/14 bg-card/50 px-4 py-3 text-sm text-fg/72 transition-all duration-200 hover:border-accentA/30 hover:bg-card/70 hover:text-fg"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-fg/32 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accentA" />
              </Link>
            ))}
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
