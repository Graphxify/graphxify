import { requireAuth } from "@/lib/auth/requireRole";
import { DashboardSidebar } from "@/app/dashboard/(components)/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAuth();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar role={profile.role} />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
