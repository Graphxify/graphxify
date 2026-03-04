import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardLeads } from "@/db/queries/admin";
import { requireRole } from "@/lib/auth/requireRole";

export default async function DashboardLeadsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["admin", "mod"]);
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const result = await getDashboardLeads(page, 20);

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">CRM</p>
          <h1 className="text-3xl font-semibold">Leads</h1>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell className="max-w-md whitespace-pre-wrap">{lead.message}</TableCell>
                    <TableCell>{new Date(lead.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </RevealItem>
        <RevealItem>
          <p className="text-sm text-fg/62">
            Page {result.page} - Total {result.total}
          </p>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
