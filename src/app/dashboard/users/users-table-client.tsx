"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Eye, Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { UserActionsDropdown } from "@/app/dashboard/users/user-actions-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardRoleRow, DashboardUserRow } from "@/db/queries/admin";

const PAGE_SIZE = 20;

type UsersTableClientProps = {
  users: DashboardUserRow[];
  roleOptions: DashboardRoleRow[];
  actorId: string;
  actorRole: string;
  initialSearch: string;
  initialRole: string;
  initialStatus: string;
  initialLastLogin: string;
  initialCreatedWithin: string;
  initialPage: number;
  updateUserRoleAction: (formData: FormData) => Promise<void>;
  copyMagicLinkAction: (formData: FormData) => Promise<{ ok: boolean; message: string; url?: string }>;
  sendMagicLinkAction: (formData: FormData) => Promise<{ ok: boolean; message: string; url?: string }>;
  sendPasswordResetAction: (formData: FormData) => Promise<void>;
  forcePasswordResetAction: (formData: FormData) => Promise<void>;
  forceLogoutAction: (formData: FormData) => Promise<void>;
  setUserStatusAction: (formData: FormData) => Promise<void>;
  deleteUserAction: (formData: FormData) => Promise<void>;
};

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

function statusLabel(status: string, disabledUntil?: string | null): string {
  if (status === "disabled" && disabledUntil) return "Timed out";
  if (status === "pending_invite") return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function matchesRelativeDays(value: string | null, days: number): boolean {
  if (!value) return false;
  return new Date(value).getTime() >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function matchesCreatedWithin(value: string, createdAt: string): boolean {
  if (!value) return true;
  const days = Number(value.replace("d", ""));
  if (!Number.isFinite(days)) return true;
  return new Date(createdAt).getTime() >= Date.now() - days * 24 * 60 * 60 * 1000;
}

export function UsersTableClient({
  users,
  roleOptions,
  actorId,
  actorRole,
  initialSearch,
  initialRole,
  initialStatus,
  initialLastLogin,
  initialCreatedWithin,
  initialPage,
  updateUserRoleAction,
  copyMagicLinkAction,
  sendMagicLinkAction,
  sendPasswordResetAction,
  forcePasswordResetAction,
  forceLogoutAction,
  setUserStatusAction,
  deleteUserAction
}: UsersTableClientProps): JSX.Element {
  const [rows, setRows] = useState(users);
  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState(initialRole);
  const [status, setStatus] = useState(initialStatus);
  const [lastLogin, setLastLogin] = useState(initialLastLogin);
  const [createdWithin, setCreatedWithin] = useState(initialCreatedWithin);
  const [page, setPage] = useState(Math.max(1, initialPage));
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    setRows(users);
  }, [users]);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, role, status, lastLogin, createdWithin]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    if (lastLogin) params.set("lastLogin", lastLogin);
    if (createdWithin) params.set("createdWithin", createdWithin);
    if (page > 1) params.set("page", String(page));

    const nextUrl = params.toString() ? `/dashboard/users?${params.toString()}` : "/dashboard/users";
    window.history.replaceState({}, "", nextUrl);
  }, [search, role, status, lastLogin, createdWithin, page]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return rows.filter((user) => {
      const name = (user.display_name || "").toLowerCase();
      const email = user.email.toLowerCase();

      if (normalizedSearch && !name.includes(normalizedSearch) && !email.includes(normalizedSearch)) {
        return false;
      }

      if (role && user.role !== role) {
        return false;
      }

      if (status && user.status !== status) {
        return false;
      }

      if (lastLogin === "never" && user.last_login !== null) {
        return false;
      }
      if (lastLogin === "7d" && !matchesRelativeDays(user.last_login, 7)) {
        return false;
      }
      if (lastLogin === "30d" && !matchesRelativeDays(user.last_login, 30)) {
        return false;
      }
      if (lastLogin === "90d" && !matchesRelativeDays(user.last_login, 90)) {
        return false;
      }

      if (!matchesCreatedWithin(createdWithin, user.created_at)) {
        return false;
      }

      return true;
    });
  }, [rows, deferredSearch, role, status, lastLogin, createdWithin]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [page, currentPage]);

  function handleRoleUpdated(userId: string, nextRole: string) {
    setRows((currentRows) =>
      currentRows.map((user) =>
        user.id === userId ? { ...user, role: nextRole as DashboardUserRow["role"] } : user
      )
    );
  }

  function handleStatusUpdated(userId: string, nextStatus: string, disabledUntil: string | null) {
    setRows((currentRows) =>
      currentRows.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: nextStatus as DashboardUserRow["status"],
              disabled_until: disabledUntil,
              force_logout_at: nextStatus === "active" ? null : new Date().toISOString()
            }
          : user
      )
    );
  }

  function handleUserDeleted(userId: string) {
    setRows((currentRows) => currentRows.filter((user) => user.id !== userId));
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/14 bg-card/60 px-4 py-3 backdrop-blur">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/36" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email..."
            className="h-9 pl-9"
          />
        </div>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg"
        >
          <option value="">All roles</option>
          {roleOptions.map((roleOption) => (
            <option key={roleOption.id} value={roleOption.slug}>
              {roleOption.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
          <option value="pending_invite">Pending</option>
        </select>

        <select
          value={lastLogin}
          onChange={(event) => setLastLogin(event.target.value)}
          className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg"
        >
          <option value="">Login: any</option>
          <option value="7d">Last 7d</option>
          <option value="30d">Last 30d</option>
          <option value="90d">Last 90d</option>
          <option value="never">Never</option>
        </select>

        <select
          value={createdWithin}
          onChange={(event) => setCreatedWithin(event.target.value)}
          className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg"
        >
          <option value="">Created: any</option>
          <option value="7d">7d</option>
          <option value="30d">30d</option>
          <option value="90d">90d</option>
          <option value="365d">1y</option>
        </select>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9"
          onClick={() => {
            setSearch("");
            setRole("");
            setStatus("");
            setLastLogin("");
            setCreatedWithin("");
            setPage(1);
          }}
        >
          Clear
        </Button>
      </div>

      <div className="rounded-xl border border-border/14 bg-card/60 backdrop-blur overflow-hidden">
        {paginatedUsers.length === 0 ? (
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
              {paginatedUsers.map((user) => {
                const name = user.display_name || user.email.split("@")[0];
                const isSelf = user.id === actorId;

                return (
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ""} alt={name} />
                        <AvatarFallback className="text-[0.65rem]">{initials(user.display_name, user.email)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/users/${user.id}`} className="font-medium transition-colors hover:text-accentA">
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
                        {statusLabel(user.status, user.disabled_until)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-fg/48">{formatDate(user.created_at)}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-fg/48">{formatDate(user.last_login)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs text-fg/60 transition-colors hover:text-accentA">
                          <Link href={`/dashboard/users/${user.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            View Profile
                          </Link>
                        </Button>
                        <UserActionsDropdown
                          userId={user.id}
                          currentRole={user.role}
                          currentStatus={user.status}
                          currentDisabledUntil={user.disabled_until}
                          isSelf={isSelf}
                          canManageMagicLinks={actorRole === "admin"}
                          roles={roleOptions.map((roleOption) => roleOption.slug)}
                          updateRoleAction={updateUserRoleAction}
                copyMagicLinkAction={copyMagicLinkAction}
                sendMagicLinkAction={sendMagicLinkAction}
                sendPasswordResetAction={sendPasswordResetAction}
                forcePasswordResetAction={forcePasswordResetAction}
                forceLogoutAction={forceLogoutAction}
                setStatusAction={setUserStatusAction}
                deleteAction={deleteUserAction}
                onRoleUpdated={handleRoleUpdated}
                          onStatusUpdated={handleStatusUpdated}
                          onUserDeleted={handleUserDeleted}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {filteredUsers.length > PAGE_SIZE ? (
          <div className="flex items-center justify-between border-t border-border/10 px-4 py-3">
            <p className="text-xs text-fg/56">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="secondary"
                disabled={currentPage <= 1}
                className="h-8 w-8 p-0"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Button
                  key={pageNumber}
                  size="sm"
                  variant={pageNumber === currentPage ? "default" : "secondary"}
                  className="h-8 w-8 p-0 text-xs"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                size="sm"
                variant="secondary"
                disabled={currentPage >= totalPages}
                className="h-8 w-8 p-0"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
