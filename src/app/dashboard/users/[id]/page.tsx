import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Clock,
  KeyRound,
  Mail,
  Shield,
  User
} from "lucide-react";
import {
  deleteUserAction,
  forceLogoutUserAction,
  forcePasswordResetAction,
  sendPasswordResetEmailAction,
  setUserStatusAction,
  updateUserDetailsAction,
  updateUserRoleAction
} from "@/app/dashboard/users/actions";
import { DeleteUserDialog } from "@/app/dashboard/users/delete-user-dialog";
import { PermissionToggles } from "@/app/dashboard/users/permission-toggles";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getDashboardRoles, getDashboardUserById, getRecentUserActivity, getUserEditCount } from "@/db/queries/admin";
import { requireRole } from "@/lib/auth/requireRole";
import { createAdminClient } from "@/lib/supabase/admin";

type Params = { id: string };

/* ── Helpers ── */

function roleLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleString() : "–";
}

function initials(name: string | null, email: string): string {
  const source = (name || email).trim();
  if (!source) return "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
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
  if (status === "pending_invite") return "Pending Invite";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function actionLabel(action: string): string {
  return action
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Page ── */

export default async function DashboardUserProfilePage({ params }: { params: Promise<Params> }) {
  const actor = await requireRole(["admin"]);
  const { id } = await params;
  const user = await getDashboardUserById(id);

  if (!user) notFound();

  const [activity, editCount, roleOptions] = await Promise.all([
    getRecentUserActivity(user.id, 15),
    getUserEditCount(user.id),
    getDashboardRoles()
  ]);

  let authLastSignInAt: string | null = null;
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data } = await admin.auth.admin.getUserById(user.id);
      authLastSignInAt = data.user?.last_sign_in_at ?? null;
    } catch {
      /* Non-critical */
    }
  }

  const lastLogin = user.last_login || authLastSignInAt;
  const lastAction = activity[0]?.created_at ? new Date(activity[0].created_at).toLocaleString() : "–";
  const isSelf = user.id === actor.id;
  const displayName = user.display_name || user.email.split("@")[0];

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        {/* ── Back Link ── */}
        <RevealItem>
          <Link href="/dashboard/users" className="inline-flex items-center gap-1.5 text-sm text-fg/56 transition hover:text-fg">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </RevealItem>

        {/* ── 1. User Header ── */}
        <RevealItem>
          <div className="rounded-xl border border-border/14 bg-card/60 p-6 backdrop-blur">
            <div className="flex flex-wrap items-center gap-5">
              <Avatar className="h-16 w-16 border-2 border-accentA/20">
                <AvatarImage src={user.avatar_url || ""} alt={displayName} />
                <AvatarFallback className="text-lg font-semibold">{initials(user.display_name, user.email)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold truncate">{displayName}</h1>
                <p className="flex items-center gap-1.5 text-sm text-fg/56">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={roleBadgeVariant(user.role)}>{roleLabel(user.role)}</Badge>
                  <Badge variant={statusBadgeVariant(user.status)}>{statusLabel(user.status)}</Badge>
                  {user.force_password_reset && (
                    <Badge variant="warning" className="text-[0.6rem]">Password reset required</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </RevealItem>

        {/* ── 2. Account Info ── */}
        <RevealItem>
          <div className="rounded-xl border border-border/14 bg-card/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-fg/72">
              <User className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Account Information</h2>
            </div>

            {/* Metadata row */}
            <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border/10 bg-card/40 p-3">
                <p className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-fg/42">
                  <Calendar className="h-3 w-3" /> Created
                </p>
                <p className="mt-1 text-sm font-medium">{formatDate(user.created_at)}</p>
              </div>
              <div className="rounded-lg border border-border/10 bg-card/40 p-3">
                <p className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-fg/42">
                  <Clock className="h-3 w-3" /> Last Login
                </p>
                <p className="mt-1 text-sm font-medium">{formatDate(lastLogin)}</p>
              </div>
              <div className="rounded-lg border border-border/10 bg-card/40 p-3">
                <p className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-fg/42">
                  <Activity className="h-3 w-3" /> Last Activity
                </p>
                <p className="mt-1 text-sm font-medium">{formatDate(user.last_activity)}</p>
              </div>
              <div className="rounded-lg border border-border/10 bg-card/40 p-3">
                <p className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-fg/42">
                  <KeyRound className="h-3 w-3" /> Password Changed
                </p>
                <p className="mt-1 text-sm font-medium">{formatDate(user.last_password_change)}</p>
              </div>
            </div>

            {/* Editable fields */}
            <form action={updateUserDetailsAction} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="userId" value={user.id} />
              <div>
                <label className="mb-1 block text-xs text-fg/48">Full Name</label>
                <Input name="full_name" defaultValue={user.display_name || ""} placeholder="Full name" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-fg/48">Email</label>
                <Input value={user.email} readOnly disabled className="opacity-50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-fg/48">Phone</label>
                <Input name="phone" defaultValue={user.phone || ""} placeholder="Phone number" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-fg/48">Avatar URL</label>
                <Input name="avatar_url" defaultValue={user.avatar_url || ""} placeholder="Avatar image URL" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-fg/48">Bio</label>
                <Textarea name="bio" defaultValue={user.bio || ""} placeholder="Short bio" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="sm">Save changes</Button>
              </div>
            </form>

            {/* Role & status controls */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/10 pt-5">
              <form action={updateUserRoleAction} className="flex items-center gap-2">
                <input type="hidden" name="userId" value={user.id} />
                <label className="text-xs text-fg/48">Role</label>
                <select
                  name="role"
                  defaultValue={user.role}
                  className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-sm text-fg"
                >
                  {roleOptions.map((roleOption) => (
                    <option key={roleOption.id} value={roleOption.slug}>{roleOption.name}</option>
                  ))}
                </select>
                <Button type="submit" size="sm" variant="secondary">Change role</Button>
              </form>
              <form action={setUserStatusAction}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="status" value={user.status === "disabled" ? "active" : "disabled"} />
                <Button type="submit" size="sm" variant="secondary" disabled={isSelf}>
                  {user.status === "disabled" ? "Enable account" : "Disable account"}
                </Button>
              </form>
            </div>
          </div>
        </RevealItem>

        {/* ── 3. Permissions ── */}
        <RevealItem>
          <div className="rounded-xl border border-border/14 bg-card/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-fg/72">
              <Shield className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Permissions</h2>
            </div>
            <p className="mb-4 text-xs text-fg/48">
              Override default permissions for this user. Toggle switches to grant or revoke individual permissions.
            </p>
            <PermissionToggles userId={user.id} role={user.role} overrides={user.permissions} />
          </div>
        </RevealItem>

        {/* ── 4. Security ── */}
        <RevealItem>
          <div className="rounded-xl border border-border/14 bg-card/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-fg/72">
              <KeyRound className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Security</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form action={sendPasswordResetEmailAction}>
                <input type="hidden" name="userId" value={user.id} />
                <Button type="submit" size="sm" variant="secondary">Send password reset email</Button>
              </form>
              <form action={forcePasswordResetAction}>
                <input type="hidden" name="userId" value={user.id} />
                <Button type="submit" size="sm" variant="secondary">Force reset on next login</Button>
              </form>
              <form action={forceLogoutUserAction}>
                <input type="hidden" name="userId" value={user.id} />
                <Button type="submit" size="sm" variant="secondary">Force logout</Button>
              </form>
              <DeleteUserDialog userId={user.id} email={user.email} disabled={isSelf} deleteAction={deleteUserAction} />
            </div>
          </div>
        </RevealItem>

        {/* ── 5. Activity ── */}
        <RevealItem>
          <div className="rounded-xl border border-border/14 bg-card/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-fg/72">
              <Activity className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Activity</h2>
            </div>

            {/* Stats */}
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/10 bg-card/40 p-3 text-center">
                <p className="text-xs text-fg/42">Last Action</p>
                <p className="mt-1 text-sm font-medium">{lastAction}</p>
              </div>
              <div className="rounded-lg border border-border/10 bg-card/40 p-3 text-center">
                <p className="text-xs text-fg/42">Total Edits</p>
                <p className="mt-1 text-lg font-semibold text-accentA">{editCount}</p>
              </div>
              <div className="rounded-lg border border-border/10 bg-card/40 p-3 text-center">
                <p className="text-xs text-fg/42">Actions Loaded</p>
                <p className="mt-1 text-sm font-medium">{activity.length}</p>
              </div>
            </div>

            {/* Recent actions list */}
            {activity.length === 0 ? (
              <p className="text-sm text-fg/48">No recorded activity yet.</p>
            ) : (
              <div className="space-y-1">
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/8 bg-card/30 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accentA/60" />
                      <span className="font-medium text-fg/76">{actionLabel(item.action)}</span>
                      <span className="text-[0.65rem] text-fg/40">{item.entity_type}</span>
                    </div>
                    <span className="text-xs text-fg/42">{formatDate(item.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
