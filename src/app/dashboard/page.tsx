import Link from "next/link";
import { FileText, FolderKanban, Users, ArrowRight, MessageSquareQuote, AlertCircle, TrendingUp } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent } from "@/components/ui/card";
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
      color: "text-accentB",
      bg: "bg-accentA/10 border-accentA/20",
      dot: "bg-accentA"
    } : null,
    pending.pendingTestimonials > 0 ? {
      label: `${pending.pendingTestimonials} pending ${pending.pendingTestimonials === 1 ? "testimonial" : "testimonials"}`,
      href: "/dashboard/testimonials?status=pending",
      icon: <MessageSquareQuote className="h-4 w-4" />,
      color: "text-accentB",
      bg: "bg-accentA/10 border-accentA/20",
      dot: "bg-accentA"
    } : null,
    pending.postsInReview > 0 ? {
      label: `${pending.postsInReview} ${pending.postsInReview === 1 ? "blog" : "blogs"} in review`,
      href: "/dashboard/posts?status=review",
      icon: <FileText className="h-4 w-4" />,
      color: "text-fg",
      bg: "bg-fg/10 border-fg/20",
      dot: "bg-fg/10"
    } : null
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode; color: string; bg: string; dot: string }[];

  const stats = [
    {
      label: "Published blogs",
      value: summary.publishedPosts,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Published works",
      value: summary.publishedWorks,
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      label: "New leads (7d)",
      value: summary.leads7,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Leads (30d)",
      value: summary.leads30,
      icon: <Users className="h-5 w-5" />,
    }
  ];

  const quickLinks = [
    hasPermission(profile.role, "content.posts.edit_own") ? { href: "/dashboard/posts", label: "Manage blog" } : null,
    hasPermission(profile.role, "content.works.edit_any") ? { href: "/dashboard/works", label: "Manage works" } : null,
    hasPermission(profile.role, "leads.view") ? { href: "/dashboard/leads", label: "View leads" } : null
  ].filter((link): link is { href: string; label: string } => link !== null);
  const greetingName = profile.displayName?.trim() || (profile.email ? profile.email.split("@")[0] : "");

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="inline-flex items-center gap-2 rounded-full bg-white py-1 pl-2.5 pr-3 text-[0.8125rem] font-semibold text-fg"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-fg" />Dashboard</p>
          <h1 className="text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            Welcome back{greetingName ? `, ${greetingName}` : ""}
          </h1>
        </RevealItem>

        {/* ── Needs Attention ── */}
        {totalPending > 0 ? (
          <RevealItem>
            <Card className="rounded-[1.75rem] border-0 bg-white shadow-none">
              <CardContent className="p-5 md:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-accentB" />
                  <h2 className="text-[0.9375rem] font-bold text-fg">Needs your attention</h2>
                  <span className="ml-auto grid h-6 min-w-6 place-items-center rounded-full bg-accentB px-2 text-[0.75rem] font-bold tabular-nums text-white">{totalPending}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {attentionItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-3 rounded-full bg-bg px-4 py-3 transition-colors duration-200 hover:bg-fg hover:text-white"
                    >
                      <span className={`relative flex h-2 w-2 shrink-0`}>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accentA opacity-75 motion-reduce:hidden" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accentA" />
                      </span>
                      <span className="mr-1 text-fg/60 group-hover:text-white/80">{item.icon}</span>
                      <span className="text-sm font-semibold">{item.label}</span>
                      <ArrowRight className="ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </RevealItem>
        ) : (
          <RevealItem>
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-green" />
              <p className="text-sm font-semibold text-fg">All clear — nothing needs your attention right now.</p>
            </div>
          </RevealItem>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <div className="flex h-full flex-col justify-between gap-6 rounded-[1.75rem] bg-white p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <p className="text-[0.8125rem] font-semibold text-fg/60">{stat.label}</p>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-fg text-white [&>svg]:h-4 [&>svg]:w-4">{stat.icon}</span>
                </div>
                <p className="text-[clamp(2rem,3vw,2.75rem)] font-extrabold leading-none tracking-[-0.05em] tabular-nums">{stat.value}</p>
              </div>
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
                className="group flex items-center justify-between rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-fg hover:text-white"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
