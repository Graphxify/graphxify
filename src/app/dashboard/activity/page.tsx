import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/requireRole";
import { listAuditLogs } from "@/services/activity-service";

export default async function DashboardActivityPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["admin", "mod"]);
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const action = typeof resolvedSearchParams.action === "string" ? resolvedSearchParams.action : "";
  const entity = typeof resolvedSearchParams.entity === "string" ? resolvedSearchParams.entity : "";
  const actor = typeof resolvedSearchParams.actor === "string" ? resolvedSearchParams.actor : "";
  const from = typeof resolvedSearchParams.from === "string" ? resolvedSearchParams.from : "";
  const to = typeof resolvedSearchParams.to === "string" ? resolvedSearchParams.to : "";

  const result = await listAuditLogs({ page, pageSize: 20, action, entity, actor, from, to });

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Audit</p>
          <h1 className="text-3xl font-semibold">Activity Logs</h1>
        </RevealItem>

        <RevealItem>
          <form className="section-shell grid gap-3 border-border/18 bg-card/72 p-4 md:grid-cols-6">
            <Input name="action" placeholder="Action" defaultValue={action} />
            <Input name="entity" placeholder="Entity" defaultValue={entity} />
            <Input name="actor" placeholder="Actor email" defaultValue={actor} />
            <Input name="from" placeholder="From (ISO date)" defaultValue={from} />
            <Input name="to" placeholder="To (ISO date)" defaultValue={to} />
            <Button type="submit">Filter</Button>
          </form>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
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
