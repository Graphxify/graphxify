import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServerPaginationProps = {
    currentPage: number;
    total: number;
    pageSize: number;
    basePath: string;
    /** Extra search params to preserve across pages */
    searchParams?: Record<string, string>;
};

export function ServerPagination({
    currentPage,
    total,
    pageSize,
    basePath,
    searchParams = {}
}: ServerPaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (totalPages <= 1) return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);

    function pageHref(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(page));
        return `${basePath}?${params.toString()}`;
    }

    return (
        <div className="flex items-center justify-between border-t border-border/14 pt-4">
            <p className="text-xs text-fg/56">
                Showing {start}–{end} of {total}
            </p>

            <div className="flex items-center gap-1.5">
                {currentPage > 1 ? (
                    <Button asChild size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Link href={pageHref(currentPage - 1)} aria-label="Previous page">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button size="sm" variant="secondary" disabled className="h-8 w-8 p-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                    page === currentPage ? (
                        <Button key={page} size="sm" variant="default" className="h-8 w-8 p-0 text-xs">
                            {page}
                        </Button>
                    ) : (
                        <Button key={page} asChild size="sm" variant="secondary" className="h-8 w-8 p-0 text-xs">
                            <Link href={pageHref(page)}>{page}</Link>
                        </Button>
                    )
                )}

                {currentPage < totalPages ? (
                    <Button asChild size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Link href={pageHref(currentPage + 1)} aria-label="Next page">
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button size="sm" variant="secondary" disabled className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
