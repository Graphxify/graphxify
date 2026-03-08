import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
};

export function EmptyState({
    icon,
    title = "No items yet",
    description = "Get started by creating your first item.",
    actionLabel,
    actionHref
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-2xl border border-border/14 bg-card/40 p-4">
                {icon ?? <Inbox className="h-8 w-8 text-fg/32" />}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-fg/72">{title}</p>
                <p className="text-xs text-fg/48">{description}</p>
            </div>
            {actionLabel && actionHref ? (
                <Button asChild size="sm" className="mt-2">
                    <Link href={actionHref}>{actionLabel}</Link>
                </Button>
            ) : null}
        </div>
    );
}
