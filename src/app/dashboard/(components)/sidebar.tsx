import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  role: "admin" | "mod";
};

const commonLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/posts", label: "Posts" },
  { href: "/dashboard/works", label: "Works" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/activity", label: "Activity" }
];

export function DashboardSidebar({ role }: SidebarProps): JSX.Element {
  return (
    <aside className="w-full border-b border-[rgba(242,240,235,0.12)] p-4 md:w-64 md:border-b-0 md:border-r">
      <p className="text-sm tracking-[0.14em]">GRAPHXIFY CMS</p>
      <p className="mt-2 text-xs text-[rgba(242,240,235,0.7)]">Role: {role.toUpperCase()}</p>
      <nav className="mt-6 flex flex-wrap gap-2 md:flex-col">
        {commonLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md border border-[rgba(242,240,235,0.14)] px-3 py-2 text-sm hover:border-[rgba(242,240,235,0.22)]"
          >
            {item.label}
          </Link>
        ))}
        {role === "admin" ? (
          <>
            <Link href="/dashboard/settings" className="rounded-md border border-[rgba(242,240,235,0.14)] px-3 py-2 text-sm hover:border-[rgba(242,240,235,0.22)]">
              Settings
            </Link>
            <Link href="/dashboard/users" className="rounded-md border border-[rgba(242,240,235,0.14)] px-3 py-2 text-sm hover:border-[rgba(242,240,235,0.22)]">
              Users
            </Link>
            <Link href="/dashboard/webhooks" className="rounded-md border border-[rgba(242,240,235,0.14)] px-3 py-2 text-sm hover:border-[rgba(242,240,235,0.22)]">
              Webhooks
            </Link>
          </>
        ) : null}
      </nav>
      <form action={logoutAction} className="mt-6">
        <Button type="submit" variant="secondary" className="w-full">
          Logout
        </Button>
      </form>
    </aside>
  );
}
