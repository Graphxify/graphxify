import Link from "next/link";
import { MailOpen, MoreHorizontal, Search, Users } from "lucide-react";
import { EmptyState } from "@/app/dashboard/(components)/empty-state";
import { ServerPagination } from "@/app/dashboard/(components)/server-pagination";
import { deleteLeadAction, updateLeadStatusAction } from "@/app/dashboard/leads/actions";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardLeads, getLeadStatusCounts } from "@/db/queries/admin";
import { requirePermission } from "@/lib/auth/requireRole";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { value: "", label: "All", color: "" },
  { value: "new", label: "New", color: "text-sky-400" },
  { value: "contacted", label: "Contacted", color: "text-amber-400" },
  { value: "converted", label: "Converted", color: "text-emerald-400" },
  { value: "lost", label: "Lost", color: "text-red-400" },
  { value: "archived", label: "Archived", color: "text-fg/40" }
];

const LEAD_STATUSES = ["new", "contacted", "converted", "lost", "archived"];

function statusBadgeClass(status: string) {
  switch (status) {
    case "new": return "border-sky-500/30 bg-sky-500/10 text-sky-400";
    case "contacted": return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "converted": return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "lost": return "border-red-500/30 bg-red-500/10 text-red-400";
    case "archived": return "border-fg/10 bg-fg/5 text-fg/40";
    default: return "";
  }
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function DashboardLeadsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePermission("leads.view");
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const search = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "";

  const [result, statusCounts] = await Promise.all([
    getDashboardLeads(page, 20, search, status),
    getLeadStatusCounts()
  ]);

  const totalAll = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const filterParams: Record<string, string> = {};
  if (search) filterParams.q = search;
  if (status) filterParams.status = status;

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">CRM</p>
          <h1 className="text-3xl font-semibold">Leads</h1>
          <p className="text-sm text-fg/48">{totalAll} {totalAll === 1 ? "lead" : "leads"} total</p>
        </RevealItem>

        {/* Status Tabs */}
        <RevealItem>
          <div className="flex items-center gap-1 rounded-lg border border-border/14 bg-card/60 p-1">
            {STATUS_TABS.map((tab) => {
              const count = tab.value ? (statusCounts[tab.value] || 0) : totalAll;
              return (
                <Link
                  key={tab.value}
                  href={`/dashboard/leads${tab.value ? `?status=${tab.value}` : ""}${search ? `${tab.value ? "&" : "?"}q=${search}` : ""}`}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    (status || "") === tab.value
                      ? "bg-accentA/12 text-accentA shadow-sm"
                      : "text-fg/56 hover:text-fg hover:bg-card/80"
                  }`}
                >
                  {tab.label}
                  <span className="tabular-nums text-fg/36">{count}</span>
                </Link>
              );
            })}
          </div>
        </RevealItem>

        {/* Search */}
        <RevealItem>
          <form className="flex items-center gap-2">
            {status && <input type="hidden" name="status" value={status} />}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/36" />
              <Input
                name="q"
                defaultValue={search}
                placeholder="Search by name, email, or message..."
                className="pl-9 h-9"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="h-9">
              Search
            </Button>
            {(search || status) && (
              <Button asChild variant="ghost" size="sm" className="h-9 text-fg/56">
                <Link href="/dashboard/leads">Clear</Link>
              </Button>
            )}
          </form>
        </RevealItem>

        {/* Table */}
        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            {result.rows.length === 0 ? (
              <EmptyState
                icon={<Users className="h-8 w-8 text-fg/32" />}
                title={search || status ? "No leads match your filters" : "No leads yet"}
                description={search || status ? "Try different search terms or filters." : "Leads from your contact form will appear here."}
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.rows.map((lead) => {
                      const leadStatus = (lead as { status?: string }).status || "new";
                      return (
                        <TableRow key={lead.id} className="group">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {leadStatus === "new" && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-sky-400 animate-pulse" />
                              )}
                              {lead.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <a href={`mailto:${lead.email}`} className="text-fg/72 hover:text-accentA transition-colors">
                              {lead.email}
                            </a>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate text-sm text-fg/56" title={lead.message}>
                              {lead.message}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={statusBadgeClass(leadStatus)}>
                              {statusLabel(leadStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-fg/48">
                            {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {leadStatus === "new" && (
                                <form action={updateLeadStatusAction}>
                                  <input type="hidden" name="id" value={lead.id} />
                                  <input type="hidden" name="status" value="contacted" />
                                  <Button type="submit" variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-fg/60 hover:text-accentA">
                                    <MailOpen className="h-3 w-3" />
                                    Mark Read
                                  </Button>
                                </form>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem asChild>
                                    <a href={`mailto:${lead.email}`}>Reply by email</a>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {LEAD_STATUSES.filter((s) => s !== leadStatus).map((s) => (
                                    <form key={s} action={updateLeadStatusAction}>
                                      <input type="hidden" name="id" value={lead.id} />
                                      <input type="hidden" name="status" value={s} />
                                      <DropdownMenuItem asChild>
                                        <button type="submit" className="w-full text-left">
                                          Set → {statusLabel(s)}
                                        </button>
                                      </DropdownMenuItem>
                                    </form>
                                  ))}
                                  <DropdownMenuSeparator />
                                  <form action={deleteLeadAction}>
                                    <input type="hidden" name="id" value={lead.id} />
                                    <DropdownMenuItem asChild>
                                      <button type="submit" className="w-full text-left text-red-400">
                                        Delete
                                      </button>
                                    </DropdownMenuItem>
                                  </form>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <ServerPagination
                  currentPage={result.page}
                  total={result.total}
                  pageSize={20}
                  basePath="/dashboard/leads"
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
