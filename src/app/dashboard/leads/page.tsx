import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardLeads } from "@/db/queries/admin";
import { requireRole } from "@/lib/auth/requireRole";

export default async function DashboardLeadsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  await requireRole(["admin", "mod"]);
  const page = Number(searchParams.page ?? 1);
  const result = await getDashboardLeads(page, 20);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Leads</h1>
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
      <p className="text-sm text-[rgba(242,240,235,0.75)]">Page {result.page} - Total {result.total}</p>
    </section>
  );
}
