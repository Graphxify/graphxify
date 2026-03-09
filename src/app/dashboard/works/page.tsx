import Link from "next/link";
import { FolderKanban, Search } from "lucide-react";
import { EmptyState } from "@/app/dashboard/(components)/empty-state";
import { ServerPagination } from "@/app/dashboard/(components)/server-pagination";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardWorks } from "@/db/queries/works";
import { requireRole } from "@/lib/auth/requireRole";

export const dynamic = "force-dynamic";

function statusVariant(status: string) {
  if (status === "published") return "success" as const;
  if (status === "draft" || status === "review") return "warning" as const;
  return "secondary" as const;
}

export default async function DashboardWorksPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["admin", "mod"]);
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const search = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const result = await getDashboardWorks(page, 10, search);

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Content</p>
              <h1 className="text-3xl font-semibold">Works</h1>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/works/new">New work</Link>
            </Button>
          </div>
        </RevealItem>

        {/* Search */}
        <RevealItem>
          <form className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/36" />
              <Input
                name="q"
                defaultValue={search}
                placeholder="Search works by title..."
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Search
            </Button>
            {search && (
              <Button asChild variant="ghost" size="sm" className="text-fg/56">
                <Link href="/dashboard/works">Clear</Link>
              </Button>
            )}
          </form>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            {result.rows.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-8 w-8 text-fg/32" />}
                title={search ? "No works match your search" : "No works yet"}
                description={search ? "Try a different search term." : "Add your first project to showcase your work."}
                actionLabel={search ? undefined : "New work"}
                actionHref={search ? undefined : "/dashboard/works/new"}
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.rows.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell className="font-medium">{work.title}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(work.status)}>{work.status}</Badge>
                        </TableCell>
                        <TableCell className="text-fg/56">{work.year}</TableCell>
                        <TableCell>
                          <Link href={`/dashboard/works/${work.id}`} className="link-sweep text-sm">
                            Edit
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ServerPagination
                  currentPage={result.page}
                  total={result.total}
                  pageSize={10}
                  basePath="/dashboard/works"
                  searchParams={search ? { q: search } : {}}
                />
              </>
            )}
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
