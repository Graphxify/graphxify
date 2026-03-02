"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, FileText, LayoutDashboard, MessageSquareQuote, Settings, Shield, Users, Workflow } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

const iconByLabel: Record<string, JSX.Element> = {
  Overview: <LayoutDashboard className="h-4 w-4" />,
  Analytics: <BarChart3 className="h-4 w-4" />,
  Posts: <FileText className="h-4 w-4" />,
  Works: <Workflow className="h-4 w-4" />,
  Testimonials: <MessageSquareQuote className="h-4 w-4" />,
  Leads: <Users className="h-4 w-4" />,
  Activity: <Activity className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
  Users: <Shield className="h-4 w-4" />,
  Webhooks: <BarChart3 className="h-4 w-4" />
};

export function DashboardNav({ items }: { items: NavItem[] }): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-wrap gap-2 md:flex-col">
      {items.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all",
              active
                ? "border-accentA/45 bg-accentA/12 text-fg"
                : "border-border/16 bg-card/45 text-fg/72 hover:border-border/30 hover:bg-card/70 hover:text-fg"
            )}
          >
            {active ? (
              <motion.span
                layoutId="dashboard-nav-active"
                className="absolute inset-0 -z-10 rounded-xl bg-accent-gradient opacity-20"
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : null}
            <span className="text-fg/72">{iconByLabel[item.label] ?? <LayoutDashboard className="h-4 w-4" />}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
