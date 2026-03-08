"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type VersionRow = {
    id: string;
    version: number;
    title: string;
    status: string;
    created_at: string;
};

type VersionHistoryTableProps = {
    versions: VersionRow[];
    itemId: string;
    itemIdField: string;
    restoreAction: (formData: FormData) => void;
    pageSize?: number;
};

export function VersionHistoryTable({
    versions,
    itemId,
    itemIdField,
    restoreAction,
    pageSize = 5
}: VersionHistoryTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(versions.length / pageSize));

    const pagedVersions = useMemo(
        () => versions.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        [versions, currentPage, pageSize]
    );

    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Version</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Edited At</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pagedVersions.map((version) => (
                        <TableRow key={version.id}>
                            <TableCell>#{version.version}</TableCell>
                            <TableCell>{version.title}</TableCell>
                            <TableCell>{version.status}</TableCell>
                            <TableCell>{new Date(version.created_at).toLocaleString()}</TableCell>
                            <TableCell>
                                <form action={restoreAction}>
                                    <input type="hidden" name={itemIdField} value={itemId} />
                                    <input type="hidden" name="versionId" value={version.id} />
                                    <Button size="sm" variant="secondary" type="submit">
                                        Restore
                                    </Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border/14 pt-4">
                    <p className="text-xs text-fg/56">
                        Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, versions.length)} of{" "}
                        {versions.length} versions
                    </p>

                    <div className="flex items-center gap-1.5">
                        <Button
                            size="sm"
                            variant="secondary"
                            disabled={!canGoPrev}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            aria-label="Previous page"
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                size="sm"
                                variant={page === currentPage ? "default" : "secondary"}
                                onClick={() => setCurrentPage(page)}
                                className="h-8 w-8 p-0 text-xs"
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            size="sm"
                            variant="secondary"
                            disabled={!canGoNext}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            aria-label="Next page"
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
