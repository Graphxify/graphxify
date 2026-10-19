import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { DashboardNav } from "@/app/dashboard/(components)/dashboard-nav";
import { MobileSidebarToggle } from "@/app/dashboard/(components)/mobile-sidebar-toggle";
import { Button } from "@/components/ui/button";
import { GraphxifyLogo } from "@/components/marketing/graphxify-logo";
import { Badge } from "@/components/site/badge";
import { hasPermission, type AppRole } from "@/lib/auth/roles";
import { getPendingCounts } from "@/db/queries/analytics";

type SidebarProps = {
  role: AppRole;
};

/* ── Build nav links WITHOUT awaiting badge counts ── */
function buildNavLinks(role: AppRole) {
  const links: { href: string; label: string; badge?: number }[] = [
    { href: "/dashboard", label: "Overview" }
  ];

  if (hasPermission(role, "analytics.view")) {
    links.push({ href: "/dashboard/analytics", label: "Analytics" });
  }

  if (hasPermission(role, "content.posts.edit_own")) {
    links.push({ href: "/dashboard/posts", label: "Blog" });
  }

  if (hasPermission(role, "content.works.edit_any")) {
    links.push({ href: "/dashboard/works", label: "Works" });
    links.push({ href: "/dashboard/marquee", label: "Marquee" });
  }

  if (hasPermission(role, "content.testimonials.view")) {
    links.push({ href: "/dashboard/testimonials", label: "Testimonials" });
  }

  if (hasPermission(role, "leads.view")) {
    links.push({ href: "/dashboard/subscriptions", label: "Subscriptions" });
  }

  if (hasPermission(role, "leads.view")) {
    links.push({ href: "/dashboard/leads", label: "Leads" });
  }

  links.push({ href: "/dashboard/profile", label: "Profile" });
  return links;
}

function buildAdminLinks(role: AppRole) {
  const links: { href: string; label: string }[] = [];

  if (hasPermission(role, "settings.manage")) {
    links.push({ href: "/dashboard/settings", label: "Settings" });
  }

  if (hasPermission(role, "users.manage")) {
    links.push({ href: "/dashboard/users", label: "Users" });
  }

  return links;
}

/* ── Async badge-enriched nav — loaded via Suspense ── */
async function NavWithBadges({ role }: { role: AppRole }) {
  const links = buildNavLinks(role);

  try {
    const pending = await getPendingCounts();
    for (const link of links) {
      if (link.href === "/dashboard/leads" && pending.newLeads > 0) {
        link.badge = pending.newLeads;
      }
      if (link.href === "/dashboard/testimonials" && pending.pendingTestimonials > 0) {
        link.badge = pending.pendingTestimonials;
      }
      if (link.href === "/dashboard/posts" && pending.postsInReview > 0) {
        link.badge = pending.postsInReview;
      }
    }
  } catch {
    // Non-critical — badges just won't show
  }

  return <DashboardNav items={links} />;
}

export function DashboardSidebar({ role }: SidebarProps) {
  const navLinks = buildNavLinks(role);
  const adminLinks = buildAdminLinks(role);

  return (
    <MobileSidebarToggle>
      <aside className="h-full w-full overflow-y-auto p-3 md:sticky md:top-0 md:h-screen md:w-72 md:shrink-0 md:p-4">
        <div className="flex min-h-full flex-col rounded-[2rem] bg-white p-4 shadow-[0_1px_2px_rgba(10,10,10,0.04)] md:p-5">
        <div className="flex items-center justify-between gap-3 px-2 pt-1">
          <GraphxifyLogo className="h-7 w-auto" width={120} height={33} sizes="120px" />
          <Badge dot="green" className="bg-bg capitalize shadow-none">{role}</Badge>
        </div>

        {/* Sidebar nav: render instantly with plain links, then swap in badge-enriched version */}
        <Suspense fallback={<DashboardNav items={navLinks} />}>
          <NavWithBadges role={role} />
        </Suspense>

        {adminLinks.length > 0 ? (
          <>
            <div className="mx-4 my-3 border-t border-fg/[0.08]" />
            <DashboardNav items={adminLinks} />
          </>
        ) : null}

        <form action={logoutAction} className="mt-auto pt-6">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 rounded-full px-4 text-[0.9375rem] font-semibold text-fg/64 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" />
            Log out
          </Button>
        </form>
        </div>
      </aside>
    </MobileSidebarToggle>
  );
}
