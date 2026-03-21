import { Suspense } from "react";
import { logoutAction } from "@/app/admin/actions";
import { DashboardNav } from "@/app/dashboard/(components)/dashboard-nav";
import { MobileSidebarToggle } from "@/app/dashboard/(components)/mobile-sidebar-toggle";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  }

  if (hasPermission(role, "content.testimonials.view")) {
    links.push({ href: "/dashboard/testimonials", label: "Testimonials" });
  }

  if (hasPermission(role, "leads.view")) {
    links.push({ href: "/dashboard/leads", label: "Leads" });
  }

  if (hasPermission(role, "activity.view")) {
    links.push({ href: "/dashboard/activity", label: "Activity" });
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
      <aside className="h-full w-full border-b border-border/14 bg-card/72 p-4 backdrop-blur md:sticky md:top-0 md:h-screen md:w-80 md:border-b-0 md:border-r md:p-6 overflow-y-auto">
        {/* ── Premium logo header ── */}
        <div className="relative overflow-hidden rounded-2xl border border-accentA/20 bg-gradient-to-br from-accentA/8 via-card/60 to-accentB/8 p-4">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accentA/8 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-gradient text-sm font-bold text-ivory shadow-glow">
              G
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-fg">Graphxify</p>
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-fg/48">CMS</p>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accentA/20 bg-accentA/8 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-accentA">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {role}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <ThemeToggle />
        </div>

        {/* Sidebar nav: render instantly with plain links, then swap in badge-enriched version */}
        <Suspense fallback={<DashboardNav items={navLinks} />}>
          <NavWithBadges role={role} />
        </Suspense>

        {adminLinks.length > 0 ? (
          <>
            <div className="mx-3 my-2 border-t border-border/10" />
            <DashboardNav items={adminLinks} />
          </>
        ) : null}

        <form action={logoutAction} className="mt-8">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-2 rounded-xl border border-transparent text-fg/56 transition-[transform,border-color,background-color,color] duration-200 hover:-translate-y-0.5 hover:border-red-400/14 hover:bg-red-500/8 hover:text-red-400 active:translate-y-0 active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Logout
          </Button>
        </form>
      </aside>
    </MobileSidebarToggle>
  );
}
