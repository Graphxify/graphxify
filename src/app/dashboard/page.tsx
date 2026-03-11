import Link from "next/link";
import { FileText, FolderKanban, Users, ArrowRight, MessageSquareQuote, AlertCircle, TrendingUp } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAnalyticsSummary, getPendingCounts } from "@/db/queries/analytics";
import { requireAuth } from "@/lib/auth/requireRole";
import { hasPermission } from "@/lib/auth/roles";

export default async function DashboardHomePage() {
  const profile = await requireAuth();
  const [summary, pending] = await Promise.all([
    getAnalyticsSummary(),
    getPendingCounts()
  ]);

  const totalPending = pending.newLeads + pending.pendingTestimonials + pending.postsInReview;

  const attentionItems = [
    pending.newLeads > 0 ? {
      label: `${pending.newLeads} new ${pending.newLeads === 1 ? "lead" : "leads"}`,
      href: "/dashboard/leads?status=new",
      icon: <Users className="h-4 w-4" />,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
      dot: "bg-sky-400"
    } : null,
    pending.pendingTestimonials > 0 ? {
      label: `${pending.pendingTestimonials} pending ${pending.pendingTestimonials === 1 ? "testimonial" : "testimonials"}`,
      href: "/dashboard/testimonials?status=pending",
      icon: <MessageSquareQuote className="h-4 w-4" />,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-400"
    } : null,
    pending.postsInReview > 0 ? {
      label: `${pending.postsInReview} ${pending.postsInReview === 1 ? "post" : "posts"} in review`,
      href: "/dashboard/posts?status=review",
      icon: <FileText className="h-4 w-4" />,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
      dot: "bg-violet-400"
    } : null
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode; color: string; bg: string; dot: string }[];

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
      label: "New leads (7d)",
      value: summary.leads7,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-emerald-400",
      border: "border-l-emerald-500/50",
      bg: "bg-emerald-500/8"
    },
    {
      label: "Leads (30d)",
      value: summary.leads30,
      icon: <Users className="h-5 w-5" />,
      color: "text-amber-400",
      border: "border-l-amber-500/50",
      bg: "bg-amber-500/8"
    }
  ];

  const quickLinks = [
    hasPermission(profile.role, "content.posts.edit_own") ? { href: "/dashboard/posts", label: "Manage posts" } : null,
    hasPermission(profile.role, "content.works.edit_any") ? { href: "/dashboard/works", label: "Manage works" } : null,
    hasPermission(profile.role, "leads.view") ? { href: "/dashboard/leads", label: "View leads" } : null,
    hasPermission(profile.role, "activity.view") ? { href: "/dashboard/activity", label: "Activity logs" } : null
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Dashboard</p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Welcome back{profile.email ? `, ${profile.email.split("@")[0]}` : ""}
          </h1>
        </RevealItem>

        {/* ── Needs Attention ── */}
        {totalPending > 0 ? (
          <RevealItem>
            <Card className="border-border/18 bg-card/72">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-fg/80">Needs your attention</h2>
                  <Badge variant="warning" className="ml-auto text-[0.6rem]">{totalPending}</Badge>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {attentionItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:scale-[1.02] hover:shadow-md ${item.bg}`}
                    >
                      <span className={`relative flex h-2 w-2 shrink-0`}>
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${item.dot} opacity-75`} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${item.dot}`} />
                      </span>
                      <span className={`${item.color} mr-1`}>{item.icon}</span>
                      <span className="text-sm font-medium text-fg/80 group-hover:text-fg">{item.label}</span>
                      <ArrowRight className="ml-auto h-3.5 w-3.5 text-fg/24 transition-transform group-hover:translate-x-0.5 group-hover:text-fg/56" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </RevealItem>
        ) : (
          <RevealItem>
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-sm text-emerald-400/80">All clear — nothing needs your attention right now.</p>
            </div>
          </RevealItem>
        )}

        {/* ── Stat cards ── */}
        <div className="grid gap-4 md:grid-cols-4">
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
