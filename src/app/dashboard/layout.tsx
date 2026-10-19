import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};
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
    <div className="relative min-h-screen bg-bg md:flex">
      <NavigationProgress />
      <ContentRefreshListener pathPrefixes={["/dashboard/posts", "/dashboard/works", "/dashboard/testimonials", "/dashboard/marquee"]} />
      <DashboardSidebar role={profile.role} />

      <div className="min-w-0 flex-1 px-4 py-4 md:px-6 md:py-4 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] bg-white py-2 pl-5 pr-16 md:rounded-full shadow-[0_1px_2px_rgba(10,10,10,0.04)] md:pr-2">
            <p className="truncate text-[0.8125rem] text-fg/60">
              <span className="font-semibold text-fg">{identityLabel}</span>
              {profile.displayName ? <span className="ml-2 text-fg/42">{profile.email}</span> : null}
            </p>
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-9 gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-semibold text-fg/70 transition-colors duration-200 hover:bg-bg hover:text-fg"
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
                  className="h-9 gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-semibold text-fg/70 transition-colors duration-200 hover:bg-bg hover:text-fg"
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
                  className="h-9 gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-semibold text-fg/70 transition-colors duration-200 hover:bg-bg hover:text-fg"
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
