import Link from "next/link";
import { Eye, Search, Users } from "lucide-react";
import { ServerPagination } from "@/app/dashboard/(components)/server-pagination";
import { AddUserDialog } from "@/app/dashboard/users/add-user-dialog";
import {
  createUserInviteAction,
  createUserWithPasswordAction,
  deleteUserAction,
  sendPasswordResetEmailAction,
  setUserStatusAction,
  updateUserRoleAction
} from "@/app/dashboard/users/actions";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardRoles, getDashboardUsers } from "@/db/queries/admin";
import { requireRole } from "@/lib/auth/requireRole";
import { UserActionsDropdown } from "@/app/dashboard/users/user-actions-dropdown";



/* ── Helpers ── */

function parsePage(value: string | string[] | undefined): number {
  const page = typeof value === "string" ? Number(value) : 1;
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function initials(name: string | null, email: string): string {
  const source = (name || email).trim();
  if (!source) return "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function roleLabel(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatDate(value: string | null): string {
  if (!value) return "–";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function roleBadgeVariant(role: string): "default" | "warning" | "secondary" {
  if (role === "admin") return "default";
  if (role === "moderator") return "warning";
  return "secondary";
}

function statusBadgeVariant(status: string): "success" | "warning" | "secondary" {
  if (status === "active") return "success";
  if (status === "pending_invite") return "warning";
  return "secondary";
}

function statusLabel(status: string): string {
  if (status === "pending_invite") return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/* ── Page ── */

export default async function DashboardUsersPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await requireRole(["admin"]);
  const resolved = await searchParams;
  const page = parsePage(resolved.page);
  const search = typeof resolved.q === "string" ? resolved.q : "";
  const role = typeof resolved.role === "string" ? resolved.role : "";
  const status = typeof resolved.status === "string" ? resolved.status : "";
  const lastLogin = typeof resolved.lastLogin === "string" ? resolved.lastLogin : "";
  const createdWithin = typeof resolved.createdWithin === "string" ? resolved.createdWithin : "";

  const result = await getDashboardUsers({ page, pageSize: 20, search, role, status, lastLogin, createdWithin });
  const roleOptions = await getDashboardRoles();

  const preservedParams: Record<string, string> = {};
  if (search) preservedParams.q = search;
  if (role) preservedParams.role = role;
  if (status) preservedParams.status = status;
  if (lastLogin) preservedParams.lastLogin = lastLogin;
  if (createdWithin) preservedParams.createdWithin = createdWithin;

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        {/* ── Header ── */}
        <RevealItem className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Admin</p>
            <h1 className="text-3xl font-semibold">Users</h1>
            <p className="text-sm text-fg/56">
              {result.total} {result.total === 1 ? "user" : "users"} total
            </p>
          </div>
          <AddUserDialog
            roleOptions={roleOptions}
            createUserInviteAction={createUserInviteAction}
            createUserWithPasswordAction={createUserWithPasswordAction}
          />
        </RevealItem>

        {/* ── Filters ── */}
        <RevealItem>
          <form className="flex flex-wrap items-center gap-2 rounded-xl border border-border/14 bg-card/60 px-4 py-3 backdrop-blur">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/36" />
              <Input name="q" defaultValue={search} placeholder="Search name or email…" className="pl-9 h-9" />
            </div>
            <select name="role" defaultValue={role} className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg">
              <option value="">All roles</option>
              {roleOptions.map((roleOption) => (
                <option key={roleOption.id} value={roleOption.slug}>{roleOption.name}</option>
              ))}
            </select>
            <select name="status" defaultValue={status} className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg">
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
              <option value="pending_invite">Pending</option>
            </select>
            <select name="lastLogin" defaultValue={lastLogin} className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg">
              <option value="">Login: any</option>
              <option value="7d">Last 7d</option>
              <option value="30d">Last 30d</option>
              <option value="90d">Last 90d</option>
              <option value="never">Never</option>
            </select>
            <select name="createdWithin" defaultValue={createdWithin} className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg">
              <option value="">Created: any</option>
              <option value="7d">7d</option>
              <option value="30d">30d</option>
              <option value="90d">90d</option>
              <option value="365d">1y</option>
            </select>
            <Button type="submit" size="sm" variant="secondary" className="h-9">Filter</Button>
            <Button asChild type="button" variant="ghost" size="sm" className="h-9">
              <Link href="/dashboard/users">Clear</Link>
            </Button>
          </form>
        </RevealItem>

        {/* ── Bulk Actions + Table ── */}
        <RevealItem>
          <div className="rounded-xl border border-border/14 bg-card/60 backdrop-blur overflow-hidden">

            {result.rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-fg/56">
                <Users className="h-8 w-8 text-fg/28" />
                <p className="text-sm">No users found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10">
                      <span className="sr-only">Avatar</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map((user) => {
                    const name = user.display_name || user.email.split("@")[0];
                    const isSelf = user.id === actor.id;
                    return (
                      <TableRow key={user.id} className="group">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || ""} alt={name} />
                            <AvatarFallback className="text-[0.65rem]">{initials(user.display_name, user.email)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Link href={`/dashboard/users/${user.id}`} className="font-medium hover:text-accentA transition-colors">
                            {name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-fg/62">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={roleBadgeVariant(user.role)} className="text-[0.65rem]">
                            {roleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(user.status)} className="text-[0.65rem]">
                            {statusLabel(user.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-fg/48">{formatDate(user.created_at)}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-fg/48">{formatDate(user.last_login)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs text-fg/60 hover:text-accentA transition-colors">
                              <Link href={`/dashboard/users/${user.id}`}>
                                <Eye className="h-3.5 w-3.5" />
                                View Profile
                              </Link>
                            </Button>
                            <UserActionsDropdown
                              userId={user.id}
                              currentRole={user.role}
                              currentStatus={user.status}
                              isSelf={isSelf}
                              roles={roleOptions.map((roleOption) => roleOption.slug)}
                              updateRoleAction={updateUserRoleAction}
                              sendPasswordResetAction={sendPasswordResetEmailAction}
                              setStatusAction={setUserStatusAction}
                              deleteAction={deleteUserAction}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}

            {result.total > 20 && (
              <div className="border-t border-border/10 px-4 py-3">
                <ServerPagination
                  currentPage={result.page}
                  total={result.total}
                  pageSize={20}
                  basePath="/dashboard/users"
                  searchParams={preservedParams}
                />
              </div>
            )}
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
