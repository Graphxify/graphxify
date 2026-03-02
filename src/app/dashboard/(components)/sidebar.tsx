import { logoutAction } from "@/app/login/actions";
import { DashboardNav } from "@/app/dashboard/(components)/dashboard-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

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
      <div className="section-shell border-border/18 bg-bg/58 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-fg/62">Graphxify CMS</p>
        <p className="mt-2 text-sm text-fg/72">Role: {role.toUpperCase()}</p>
      </div>

      <div className="mt-4">
        <ThemeToggle className="w-full" />
      </div>

      <DashboardNav items={commonLinks} />
      {role === "admin" ? <DashboardNav items={adminLinks} /> : null}

      <form action={logoutAction} className="mt-8">
        <Button type="submit" variant="secondary" className="w-full">
          Logout
        </Button>
      </form>
    </aside>
  );
}
