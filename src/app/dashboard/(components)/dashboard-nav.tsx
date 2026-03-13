"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  FileText,
  LayoutDashboard,
  MessageSquareQuote,
  Settings,
  Shield,
  Users,
  Workflow,
  User,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  badge?: number;
};

const iconByLabel: Record<string, LucideIcon> = {
  Overview: LayoutDashboard,
  Analytics: BarChart3,
  Blog: FileText,
  Works: Workflow,
  Testimonials: MessageSquareQuote,
  Leads: Users,
  Activity: Activity,
  Profile: User,
  Settings: Settings,
  Users: Shield
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
        const Icon = iconByLabel[item.label] ?? LayoutDashboard;

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative isolate flex items-center gap-2.5 overflow-hidden rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-[transform,border-color,background-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:translate-y-0 active:scale-[0.985]",
              active
                ? "border-accentA/40 bg-card/84 text-fg shadow-[0_16px_36px_rgba(9,18,37,0.18)]"
                : "border-border/16 bg-card/45 text-fg/72 hover:-translate-y-0.5 hover:border-accentA/24 hover:bg-card/82 hover:text-fg hover:shadow-[0_12px_26px_rgba(9,18,37,0.14)]"
            )}
          >
            {active ? (
              <>
                <motion.span
                  layoutId="dashboard-nav-active"
                  className="absolute inset-[1px] rounded-[11px] bg-accentA/12"
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  layoutId="dashboard-nav-indicator"
                  className="absolute bottom-2 left-1.5 top-2 w-1 rounded-full bg-accentA/70"
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                />
              </>
            ) : null}
            <span
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-px bg-white/12 opacity-0 transition-opacity duration-200",
                active ? "opacity-100" : "group-hover:opacity-100"
              )}
            />
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-lg border transition-[background-color,border-color,color] duration-200",
                active
                  ? "border-accentA/24 bg-accentA/16 text-accentA"
                  : "border-border/12 bg-bg/52 text-fg/58 group-hover:border-accentA/16 group-hover:bg-accentA/10 group-hover:text-fg/82"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="relative z-10">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span
                className={cn(
                  "relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.6rem] font-semibold tabular-nums transition-colors duration-200",
                  active
                    ? "bg-fg/10 text-fg"
                    : "bg-accentA/16 text-accentA group-hover:bg-accentA/22 group-hover:text-accentA"
                )}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
