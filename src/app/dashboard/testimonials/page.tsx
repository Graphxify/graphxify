import Link from "next/link";
import { MessageSquareQuote, Search } from "lucide-react";
import { EmptyState } from "@/app/dashboard/(components)/empty-state";
import { ServerPagination } from "@/app/dashboard/(components)/server-pagination";
import { TestimonialActions } from "@/app/dashboard/(components)/testimonial-actions";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardTestimonials } from "@/db/queries/testimonials";
import { requirePermission } from "@/lib/auth/requireRole";
import { hasPermission } from "@/lib/auth/roles";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" }
];

export default async function DashboardTestimonialsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Start auth check immediately; parse params then run auth + data in parallel
  const profilePromise = requirePermission("content.testimonials.view");
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const statusFilter = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "";
  const search = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";

  let result: Awaited<ReturnType<typeof getDashboardTestimonials>> = {
    rows: [],
    total: 0,
    page,
    pageSize: 12,
    warning: ""
  };
  let loadError = "";

  type DataOutcome =
    | { ok: true; data: Awaited<ReturnType<typeof getDashboardTestimonials>> }
    | { ok: false; error: unknown };

  const [profile, dataOutcome] = await Promise.all([
    profilePromise,
    getDashboardTestimonials(page, 12, statusFilter, search)
      .then((data): DataOutcome => ({ ok: true, data }))
      .catch((error): DataOutcome => ({ ok: false, error }))
  ]);

  if (dataOutcome.ok) {
    result = dataOutcome.data;
  } else {
    const error = dataOutcome.error;
    if (error && typeof error === "object" && "code" in error) {
      const code = String((error as { code?: string }).code || "");
      if (code === "42501") {
        loadError = "Testimonials permissions are missing. Re-run supabase/rls.sql after supabase/testimonials.sql.";
      } else if (["42P01", "42703", "PGRST116", "PGRST204"].includes(code)) {
        loadError = "Testimonials schema is missing or outdated. Run supabase/testimonials.sql in Supabase SQL editor.";
      }
    }
    if (!loadError && error && typeof error === "object" && "message" in error) {
      loadError = String((error as { message?: string }).message || "Unable to load testimonials.");
    } else {
      loadError ||= "Unable to load testimonials.";
    }
  }

  const canModerate = hasPermission(profile.role, "content.testimonials.moderate");
  const canDelete = hasPermission(profile.role, "content.testimonials.delete");

  const filterParams: Record<string, string> = {};
  if (statusFilter) filterParams.status = statusFilter;
  if (search) filterParams.q = search;

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Content</p>
              <h1 className="text-3xl font-semibold">Testimonials</h1>
            </div>
          </div>
        </RevealItem>

        {/* Status Tabs + Search */}
        <RevealItem>
          <div className="space-y-3">
            <div className="flex items-center gap-1 rounded-lg border border-border/14 bg-card/60 p-1">
              {STATUS_TABS.map((tab) => (
                <Link
                  key={tab.value}
                  href={`/dashboard/testimonials${tab.value ? `?status=${tab.value}` : ""}${search ? `${tab.value ? "&" : "?"}q=${search}` : ""}`}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                    statusFilter === tab.value
                      ? "bg-accentA/12 text-accentA shadow-sm"
                      : "text-fg/56 hover:text-fg hover:bg-card/80"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
            <form className="flex items-center gap-2">
              {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/36" />
                <Input
                  name="q"
                  defaultValue={search}
                  placeholder="Search by name, role, or quote..."
                  className="pl-9 h-9"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" className="h-9">
                Search
              </Button>
              {(search || statusFilter) && (
                <Button asChild variant="ghost" size="sm" className="h-9 text-fg/56">
                  <Link href="/dashboard/testimonials">Clear</Link>
                </Button>
              )}
            </form>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            {result.warning ? <p className="mb-3 text-sm text-fg/72">{result.warning}</p> : null}
            {loadError ? <p className="mb-3 text-sm text-red-400">{loadError}</p> : null}
            {result.rows.length === 0 && !loadError ? (
              <EmptyState
                icon={<MessageSquareQuote className="h-8 w-8 text-fg/32" />}
                title={statusFilter || search ? "No testimonials match your filters" : "No testimonials yet"}
                description={statusFilter || search ? "Try different filters or search terms." : "Client testimonial submissions will appear here once they are received."}
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="max-w-[18rem]">Quote</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.rows.map((item) => {
                      const badgeClass =
                        item.status === "published"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : item.status === "pending"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                            : item.status === "rejected"
                              ? "border-red-500/30 bg-red-500/10 text-red-400"
                              : "";
                      const isClientSubmission = !item.author_id;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell className="max-w-[18rem] truncate text-xs text-fg/56">
                            {item.quote.length > 80 ? `${item.quote.slice(0, 80)}…` : item.quote}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={badgeClass}>{item.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {isClientSubmission ? (
                              <span className="inline-flex items-center gap-1 text-xs text-fg/48">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400/70" />
                                Client
                              </span>
                            ) : (
                              <span className="text-xs text-fg/32">Staff</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <TestimonialActions id={item.id} status={item.status} canModerate={canModerate} canDelete={canDelete} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <ServerPagination
                  currentPage={result.page}
                  total={result.total}
                  pageSize={12}
                  basePath="/dashboard/testimonials"
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
