"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  FileText,
  GalleryHorizontal,
  LayoutDashboard,
  Mail,
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
  Marquee: GalleryHorizontal,
  Testimonials: MessageSquareQuote,
  Subscriptions: Mail,
  Leads: Users,
  Activity: Activity,
  Profile: User,
  Settings: Settings,
  Users: Shield
};

export function DashboardNav({ items }: { items: NavItem[] }): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="mt-4 flex flex-col gap-1">
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
              "group relative isolate flex items-center gap-3 rounded-full px-4 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentB focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              active ? "text-white" : "text-fg/64 hover:bg-bg hover:text-fg"
            )}
          >
            {active ? (
              <motion.span
                layoutId="dashboard-nav-active"
                className="absolute inset-0 -z-10 rounded-full bg-fg"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : null}
            <Icon aria-hidden="true" className="h-[1.125rem] w-[1.125rem] shrink-0" />
            <span>{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span
                className={cn(
                  "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.6875rem] font-bold tabular-nums",
                  active ? "bg-white text-fg" : "bg-accentB text-white"
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
