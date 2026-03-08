import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { DashboardSidebar } from "@/app/dashboard/(components)/sidebar";
import { PageTransition } from "@/components/motion/page-transition";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/requireRole";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAuth();

  return (
    <div className="relative min-h-screen md:flex noise-overlay">
      <ScrollProgress />
      <ContentRefreshListener pathPrefixes={["/dashboard/posts", "/dashboard/works", "/dashboard/testimonials"]} />
      <DashboardSidebar role={profile.role} />

      <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="section-shell flex flex-wrap items-center justify-between gap-3 border-border/18 bg-card/76 px-4 py-2.5">
            <p className="text-xs text-fg/56">
              <span className="font-medium text-fg/72">{profile.email}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="ghost" className="h-8 gap-1.5 px-2.5 text-xs text-fg/62 hover:text-fg">
                <Link href="/">
                  <ExternalLink className="h-3 w-3" />
                  Site
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="h-8 gap-1.5 px-2.5 text-xs text-fg/62 hover:text-fg">
                <Link href="/dashboard/posts/new">
                  <Plus className="h-3 w-3" />
                  Post
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="h-8 gap-1.5 px-2.5 text-xs text-fg/62 hover:text-fg">
                <Link href="/dashboard/works/new">
                  <Plus className="h-3 w-3" />
                  Work
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="h-8 gap-1.5 px-2.5 text-xs text-fg/62 hover:text-fg">
                <Link href="/dashboard/testimonials/new">
                  <Plus className="h-3 w-3" />
                  Testimonial
                </Link>
              </Button>
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
