import Link from "next/link";
import { DashboardSidebar } from "@/app/dashboard/(components)/sidebar";
import { PageTransition } from "@/components/motion/page-transition";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { requireAuth } from "@/lib/auth/requireRole";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAuth();

  return (
    <div className="relative min-h-screen md:flex noise-overlay">
      <ScrollProgress />
      <ContentRefreshListener pathPrefixes={["/dashboard/posts", "/dashboard/works"]} />
      <DashboardSidebar role={profile.role} />

      <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="section-shell flex flex-wrap items-center justify-between gap-3 border-border/18 bg-card/76 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-fg/58">Control Center</p>
              <p className="text-sm text-fg/72">Signed in as {profile.email}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-fg/72">
              <Link href="/" className="link-sweep">
                Marketing Site
              </Link>
              <Link href="/dashboard/posts/new" className="link-sweep">
                New Post
              </Link>
              <Link href="/dashboard/works/new" className="link-sweep">
                New Work
              </Link>
            </div>
          </div>

          <PageTransition>
            <div className="mx-auto max-w-6xl">{children}</div>
          </PageTransition>
        </div>
      </div>
    </div>
  );
}
