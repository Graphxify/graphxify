"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    posts: "Blog",
    works: "Works",
    testimonials: "Testimonials",
    leads: "Leads",
    activity: "Activity",
    analytics: "Analytics",
    settings: "System Status",
    users: "Users",
    webhooks: "Webhooks",
    new: "New",
    metrics: "Metrics"
};

export function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    // Don't show breadcrumbs on the dashboard root
    if (segments.length <= 1) return null;

    const crumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label = labelMap[segment] || (segment.length > 20 ? "Edit" : segment);

        return { href, label, isLast };
    });

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-fg/52">
            {crumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                    {index > 0 && <ChevronRight className="h-3 w-3 text-fg/28" />}
                    {crumb.isLast ? (
                        <span className="font-medium text-fg/72">{crumb.label}</span>
                    ) : (
                        <Link href={crumb.href} className="transition-colors hover:text-fg">
                            {crumb.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
