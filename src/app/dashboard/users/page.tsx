import { updateUserRoleAction } from "@/app/dashboard/users/actions";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProfiles } from "@/db/queries/admin";
import { requireRole } from "@/lib/auth/requireRole";

export default async function DashboardUsersPage() {
  await requireRole(["admin"]);
  const users = await getProfiles();

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Admin</p>
          <h1 className="text-3xl font-semibold">Users</h1>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <form action={updateUserRoleAction} className="flex items-center gap-2">
                        <input type="hidden" name="userId" value={user.id} />
                        <select name="role" defaultValue={user.role} className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-sm">
                          <option value="mod">mod</option>
                          <option value="admin">admin</option>
                        </select>
                        <Button type="submit" size="sm" variant="secondary">
                          Update
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
