import { logoutAction } from "@/app/login/actions";
import { DashboardNav } from "@/app/dashboard/(components)/dashboard-nav";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type SidebarProps = {
  role: "admin" | "mod";
};

const commonLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/posts", label: "Posts" },
  { href: "/dashboard/works", label: "Works" },
  { href: "/dashboard/testimonials", label: "Testimonials" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/activity", label: "Activity" }
];

const adminLinks = [
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/webhooks", label: "Webhooks" }
];

export function DashboardSidebar({ role }: SidebarProps): JSX.Element {
  return (
    <aside className="w-full border-b border-border/14 bg-card/72 p-4 backdrop-blur md:sticky md:top-0 md:h-screen md:w-80 md:border-b-0 md:border-r md:p-6">
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

      <DashboardNav items={commonLinks} />

      {role === "admin" ? (
        <>
          <div className="mx-3 my-2 border-t border-border/10" />
          <DashboardNav items={adminLinks} />
        </>
      ) : null}

      <form action={logoutAction} className="mt-8">
        <Button type="submit" variant="ghost" className="w-full justify-start gap-2 text-fg/56 hover:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Logout
        </Button>
      </form>
    </aside>
  );
}
