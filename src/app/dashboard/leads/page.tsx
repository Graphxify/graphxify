export const dynamic = "force-dynamic";

import { Users } from "lucide-react";
import { EmptyState } from "@/app/dashboard/(components)/empty-state";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardLeads } from "@/db/queries/admin";
import { requirePermission } from "@/lib/auth/requireRole";

/** Extract the human-readable service label stored inside the message field. */
function extractService(message: string): string {
  const match = message.match(/^Services:\s*(.+)$/m);
  return match?.[1]?.trim() ?? "—";
}

type KnownStatus = "new" | "contacted" | "converted" | "lost" | "archived";

const STATUS_STYLES: Record<KnownStatus, string> = {
  new:       "border-sky-500/30 bg-sky-500/10 text-sky-400",
  contacted: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  converted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  lost:      "border-red-500/30 bg-red-500/10 text-red-400",
  archived:  "border-fg/10 bg-fg/5 text-fg/40",
};

const STATUS_LABELS: Record<KnownStatus, string> = {
  new:       "New",
  contacted: "Contacted",
  converted: "Converted",
  lost:      "Lost",
  archived:  "Archived",
};

function StatusBadge({ status }: { status: string }) {
  const known = status as KnownStatus;
  const isKnown = known in STATUS_STYLES;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        isKnown ? STATUS_STYLES[known] : "border-fg/12 bg-fg/6 text-fg/50"
      }`}
    >
      {known === "new" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" aria-hidden="true" />
      )}
      {isKnown
        ? STATUS_LABELS[known]
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function DashboardLeadsPage() {
  await requirePermission("leads.view");

  const result = await getDashboardLeads(1, 50);
  const leads = result.rows;

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">

        {/* Header */}
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">CRM</p>
          <h1 className="text-3xl font-semibold">Leads</h1>
          <p className="text-sm text-fg/48">
            {result.total} {result.total === 1 ? "lead" : "leads"} total
          </p>
        </RevealItem>

        {/* Table */}
        <RevealItem>
          <div className="section-shell overflow-hidden border-border/18 bg-card/72 p-0">
            {leads.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={<Users className="h-8 w-8 text-fg/32" />}
                  title="No leads yet"
                  description="Leads submitted through your contact form will appear here."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="pr-5"><span className="sr-only">Action</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => {
                      const status = (lead as { status?: string }).status ?? "new";
                      const date = new Date(lead.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <TableRow key={lead.id} className="group">
                          <TableCell className="pl-5 font-medium whitespace-nowrap">
                            {lead.name}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-fg/70">
                            {extractService(lead.message)}
                          </TableCell>
                          <TableCell>
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-fg/60 transition-colors duration-150 hover:text-accentA"
                            >
                              {lead.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={status} />
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-fg/44">
                            {date}
                          </TableCell>
                          <TableCell className="pr-5">
                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border/18 bg-card/60 px-3 py-1.5 text-xs font-medium text-fg/64 transition-[border-color,background-color,color] duration-150 hover:border-accentA/28 hover:bg-accentA/6 hover:text-fg"
                            >
                              Reply by Email
                            </a>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </RevealItem>

      </RevealStagger>
    </section>
  );
}
