import { listAuditLogs } from "@/services/activity-service";
import { requireRole } from "@/lib/auth/requireRole";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function DashboardActivityPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  await requireRole(["admin", "mod"]);
  const page = Number(searchParams.page ?? 1);
  const action = typeof searchParams.action === "string" ? searchParams.action : "";
  const entity = typeof searchParams.entity === "string" ? searchParams.entity : "";
  const actor = typeof searchParams.actor === "string" ? searchParams.actor : "";
  const from = typeof searchParams.from === "string" ? searchParams.from : "";
  const to = typeof searchParams.to === "string" ? searchParams.to : "";

  const result = await listAuditLogs({ page, pageSize: 20, action, entity, actor, from, to });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Activity Logs</h1>
      <form className="grid gap-3 rounded-lg border border-[rgba(242,240,235,0.15)] p-4 md:grid-cols-6">
        <Input name="action" placeholder="Action" defaultValue={action} />
        <Input name="entity" placeholder="Entity" defaultValue={entity} />
        <Input name="actor" placeholder="Actor email" defaultValue={actor} />
        <Input name="from" placeholder="From (ISO date)" defaultValue={from} />
        <Input name="to" placeholder="To (ISO date)" defaultValue={to} />
        <Button type="submit">Filter</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.rows.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
              <TableCell>{log.actor_email || "system"}</TableCell>
              <TableCell>{log.actor_role || "-"}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.entity_type}</TableCell>
              <TableCell>{log.ip || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-[rgba(242,240,235,0.75)]">Page {result.page} - Total {result.total}</p>
    </section>
  );
}
