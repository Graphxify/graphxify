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
import { requirePermission } from "@/lib/auth/requireRole";



function statusVariant(status: string) {
  if (status === "published") return "success" as const;
  if (status === "draft" || status === "review") return "warning" as const;
  return "secondary" as const;
}

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "published", label: "Published" }
];

export default async function DashboardWorksPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const permissionCheck = requirePermission("content.works.edit_any");
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const search = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "";
  const [, result] = await Promise.all([
    permissionCheck,
    getDashboardWorks(page, 10, search, status)
  ]);

  const filterParams: Record<string, string> = {};
  if (search) filterParams.q = search;
  if (status) filterParams.status = status;

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

        {/* Filters */}
        <RevealItem>
          <form className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/36" />
              <Input
                name="q"
                defaultValue={search}
                placeholder="Search works by title..."
                className="pl-9 h-9"
              />
            </div>
            <select
              name="status"
              defaultValue={status}
              className="h-9 rounded-md border border-border/20 bg-card/72 px-2.5 text-xs text-fg"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm" className="h-9">
              Search
            </Button>
            {(search || status) && (
              <Button asChild variant="ghost" size="sm" className="h-9 text-fg/56">
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
                title={search || status ? "No works match your filters" : "No works yet"}
                description={search || status ? "Try different search terms or filters." : "Add your first project to showcase your work."}
                actionLabel={search || status ? undefined : "New work"}
                actionHref={search || status ? undefined : "/dashboard/works/new"}
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
                  searchParams={filterParams}
                />
              </>
            )}
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
