import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { DashboardSidebar } from "@/app/dashboard/(components)/sidebar";
import { Breadcrumbs } from "@/app/dashboard/(components)/breadcrumbs";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/requireRole";
import { hasPermission } from "@/lib/auth/roles";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAuth();
  const identityLabel = profile.displayName?.trim() || profile.email;

  return (
    <div className="relative min-h-screen md:flex noise-overlay">
      <NavigationProgress />
      <ContentRefreshListener pathPrefixes={["/dashboard/posts", "/dashboard/works", "/dashboard/testimonials", "/dashboard/marquee"]} />
      <DashboardSidebar role={profile.role} />

      <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="section-shell flex flex-wrap items-center justify-between gap-3 border-border/18 bg-card/76 pl-4 pr-14 py-2.5 md:px-4">
            <p className="text-xs text-fg/56">
              <span className="font-medium text-fg/72">{identityLabel}</span>
              {profile.displayName ? <span className="ml-2 text-fg/42">{profile.email}</span> : null}
            </p>
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5 rounded-lg border border-transparent px-2.5 text-xs text-fg/62 transition-[border-color,background-color,color] duration-200 hover:border-border/18 hover:bg-card/82 hover:text-fg"
              >
                <Link href="/">
                  <ExternalLink className="h-3 w-3" />
                  Site
                </Link>
              </Button>
              {hasPermission(profile.role, "content.posts.create") ? (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1.5 rounded-lg border border-transparent px-2.5 text-xs text-fg/62 transition-[border-color,background-color,color] duration-200 hover:border-border/18 hover:bg-card/82 hover:text-fg"
                >
                  <Link href="/dashboard/posts/new">
                    <Plus className="h-3 w-3" />
                    Blog
                  </Link>
                </Button>
              ) : null}
              {hasPermission(profile.role, "content.works.create") ? (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1.5 rounded-lg border border-transparent px-2.5 text-xs text-fg/62 transition-[border-color,background-color,color] duration-200 hover:border-border/18 hover:bg-card/82 hover:text-fg"
                >
                  <Link href="/dashboard/works/new">
                    <Plus className="h-3 w-3" />
                    Work
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <Breadcrumbs />

          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
