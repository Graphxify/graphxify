export const dynamic = "force-dynamic";

import Link from "next/link";
import { Download, Mail, Search, Users } from "lucide-react";
import { EmptyState } from "@/app/dashboard/(components)/empty-state";
import { ServerPagination } from "@/app/dashboard/(components)/server-pagination";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getDashboardNewsletterSubscribers,
  getNewsletterSubscriberStats,
  type NewsletterSubscriberRow
} from "@/db/queries/admin";
import { requirePermission } from "@/lib/auth/requireRole";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "subscribed", label: "Subscribed" },
  { value: "unsubscribed", label: "Unsubscribed" }
];

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function buildExportHref(search: string, status: string, overrideStatus?: string): string {
  const params = new URLSearchParams();
  const nextStatus = overrideStatus ?? status;
  if (search) params.set("q", search);
  if (nextStatus) params.set("status", nextStatus);
  const query = params.toString();
  return query ? `/api/dashboard/subscriptions/export?${query}` : "/api/dashboard/subscriptions/export";
}

function StatusBadge({ row }: { row: NewsletterSubscriberRow }) {
  const subscribed = row.status === "subscribed";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        subscribed
          ? "border-green/30 bg-green/10 text-[#137a3a]"
          : "border-accentA/30 bg-accentA/10 text-accentB"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${subscribed ? "bg-green" : "bg-accentA"}`}
        aria-hidden="true"
      />
      {subscribed ? "Subscribed" : "Unsubscribed"}
    </span>
  );
}

export default async function DashboardSubscriptionsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const search = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "";

  const [, result, stats] = await Promise.all([
    requirePermission("leads.view"),
    getDashboardNewsletterSubscribers(page, 20, search, status),
    getNewsletterSubscriberStats()
  ]);

  const filterParams: Record<string, string> = {};
  if (search) filterParams.q = search;
  if (status) filterParams.status = status;

  const sourceSummary = Object.entries(stats.bySource)
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => `${source} (${count})`)
    .join(", ");

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="inline-flex items-center gap-2 rounded-full bg-white py-1 pl-2.5 pr-3 text-[0.8125rem] font-semibold text-fg"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-fg" />Newsletter</p>
              <h1 className="text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">Subscriptions</h1>
              <p className="text-sm text-fg/48">
                Manage subscriber emails, export your list, and track unsubscribe status from the CMS.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href={buildExportHref(search, status, "subscribed")}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Export active CSV
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="border border-border/18">
                <Link href={buildExportHref(search, status)}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Export current view
                </Link>
              </Button>
            </div>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total subscribers", value: stats.total, tone: "text-fg" },
              { label: "Active", value: stats.subscribed, tone: "text-[#137a3a]" },
              { label: "Unsubscribed", value: stats.unsubscribed, tone: "text-accentB" },
              { label: "Checklist emails sent", value: stats.welcomeSent, tone: "text-accentB" }
            ].map((card) => (
              <div key={card.label} className="section-shell border-border/18 bg-card/72 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-fg/44">{card.label}</p>
                <p className={`mt-2 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
              </div>
            ))}
          </div>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            <form className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/36" />
                <Input
                  name="q"
                  defaultValue={search}
                  placeholder="Search by email or source..."
                  className="h-9 pl-9"
                />
              </div>
              <select
                name="status"
                defaultValue={status}
                className="h-9 rounded-md border border-border/20 bg-card/72 px-2.5 text-xs text-fg"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="secondary" size="sm" className="h-9">
                Search
              </Button>
              {(search || status) && (
                <Button asChild variant="ghost" size="sm" className="h-9 text-fg/56">
                  <Link href="/dashboard/subscriptions">Clear</Link>
                </Button>
              )}
            </form>
            <p className="mt-3 text-xs text-fg/44">
              Export active subscribers when you want to send a campaign from your email tool. Sources tracked: {sourceSummary || "blog"}.
            </p>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            {result.rows.length === 0 ? (
              <EmptyState
                icon={<Users className="h-8 w-8 text-fg/32" />}
                title={search || status ? "No subscribers match your filters" : "No subscribers yet"}
                description={
                  search || status
                    ? "Try a different email, source, or status filter."
                    : "Newsletter signups from the blog page will appear here."
                }
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Checklist sent</TableHead>
                      <TableHead>Unsubscribed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">
                          <a
                            href={`mailto:${row.email}`}
                            className="inline-flex items-center gap-1.5 text-fg/70 transition-colors duration-150 hover:text-accentB"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {row.email}
                          </a>
                        </TableCell>
                        <TableCell className="capitalize text-fg/60">{row.source || "blog"}</TableCell>
                        <TableCell>
                          <StatusBadge row={row} />
                        </TableCell>
                        <TableCell className="text-fg/56">{formatDate(row.subscribed_at)}</TableCell>
                        <TableCell className="text-fg/56">{formatDate(row.welcome_email_sent_at)}</TableCell>
                        <TableCell className="text-fg/56">{formatDate(row.unsubscribed_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <ServerPagination
                  currentPage={result.page}
                  total={result.total}
                  pageSize={20}
                  basePath="/dashboard/subscriptions"
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
