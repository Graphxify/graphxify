import { AddUserDialog } from "@/app/dashboard/users/add-user-dialog";
import { UsersTableClient } from "@/app/dashboard/users/users-table-client";
import {
  copyMagicLinkAction,
  createUserInviteAction,
  createUserWithPasswordAction,
  deleteUserAction,
  forceLogoutUserAction,
  forcePasswordResetAction,
  sendMagicLinkEmailAction,
  sendPasswordResetEmailAction,
  setUserStatusAction,
  updateUserRoleAction
} from "@/app/dashboard/users/actions";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { getAllDashboardUsers, getDashboardRoles } from "@/db/queries/admin";
import { getCmsPasswordPolicy } from "@/lib/auth/password-policy.server";
import { requireRole } from "@/lib/auth/requireRole";

function parsePage(value: string | string[] | undefined): number {
  const page = typeof value === "string" ? Number(value) : 1;
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function DashboardUsersPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await requireRole(["admin"]);
  const resolved = await searchParams;
  const initialPage = parsePage(resolved.page);
  const initialSearch = typeof resolved.q === "string" ? resolved.q : "";
  const initialRole = typeof resolved.role === "string" ? resolved.role : "";
  const initialStatus = typeof resolved.status === "string" ? resolved.status : "";
  const initialLastLogin = typeof resolved.lastLogin === "string" ? resolved.lastLogin : "";
  const initialCreatedWithin = typeof resolved.createdWithin === "string" ? resolved.createdWithin : "";

  const [users, roleOptions, passwordPolicy] = await Promise.all([
    getAllDashboardUsers(),
    getDashboardRoles(),
    getCmsPasswordPolicy()
  ]);

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Admin</p>
            <h1 className="text-3xl font-semibold">Users</h1>
            <p className="text-sm text-fg/56">
              {users.length} {users.length === 1 ? "user" : "users"} total
            </p>
          </div>
          <AddUserDialog
            roleOptions={roleOptions}
            createUserInviteAction={createUserInviteAction}
            createUserWithPasswordAction={createUserWithPasswordAction}
            requireStrongPasswords={passwordPolicy.requireStrongPasswords}
          />
        </RevealItem>

        <RevealItem className="space-y-4">
          <UsersTableClient
            users={users}
            roleOptions={roleOptions}
            actorId={actor.id}
            actorRole={actor.role}
            initialSearch={initialSearch}
            initialRole={initialRole}
            initialStatus={initialStatus}
            initialLastLogin={initialLastLogin}
            initialCreatedWithin={initialCreatedWithin}
            initialPage={initialPage}
            updateUserRoleAction={updateUserRoleAction}
            copyMagicLinkAction={copyMagicLinkAction}
            sendMagicLinkAction={sendMagicLinkEmailAction}
            sendPasswordResetAction={sendPasswordResetEmailAction}
            forcePasswordResetAction={forcePasswordResetAction}
            forceLogoutAction={forceLogoutUserAction}
            setUserStatusAction={setUserStatusAction}
            deleteUserAction={deleteUserAction}
          />
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
