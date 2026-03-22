"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireRole, type AppProfile } from "@/lib/auth/requireRole";
import {
  ACCOUNT_STATUSES,
  ALL_PERMISSIONS,
  APP_ROLES,
  canAssignRole,
  normalizeAccountStatus,
  normalizeRole,
  type AccountStatus,
  type AppPermission,
  type AppRole
} from "@/lib/auth/roles";
import { logAuditEvent } from "@/lib/audit";
import { sendEmail } from "@/lib/email/provider";
import { magicLinkTemplate, passwordResetTemplate, userInvitationTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

/* ── Internal types ── */

type TargetProfile = {
  id: string;
  email: string;
  role: AppRole;
  status: AccountStatus;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  force_password_reset: boolean;
};

type WriteClient = ReturnType<typeof createClient> | NonNullable<ReturnType<typeof createAdminClient>>;
export type CreateUserResult =
  | { ok: true; mode: "invite" | "manual"; message: string; userId: string }
  | { ok: false; message: string };
export type MagicLinkActionResult =
  | { ok: true; message: string; url?: string }
  | { ok: false; message: string };

/* ── Helpers ── */

function getWriteClient(): WriteClient {
  return createAdminClient() ?? createClient();
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function parseRole(value: string): AppRole {
  const raw = String(value).trim().toLowerCase();
  if (!APP_ROLES.includes(raw as AppRole)) {
    throw new Error("Invalid role");
  }
  return raw as AppRole;
}

function parseStatus(value: string): AccountStatus {
  const parsed = String(value).trim().toLowerCase();
  if (!ACCOUNT_STATUSES.includes(parsed as AccountStatus)) {
    throw new Error("Invalid status");
  }
  return parsed as AccountStatus;
}

function parsePassword(value: FormDataEntryValue | null): string {
  const password = String(value).trim();
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  return password;
}

function formatRoleName(role: AppRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function buildCallbackUrl(baseUrl: string, nextPath: string): string {
  const url = new URL("/auth/callback", baseUrl);
  url.searchParams.set("next", nextPath);
  return url.toString();
}

function buildMagicLinkRedirectUrl(baseUrl: string, nextPath: string): string {
  const url = new URL("/auth/complete", baseUrl);
  url.searchParams.set("next", nextPath);
  return url.toString();
}

async function getAppBaseUrl(): Promise<string> {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  if (origin) {
    return origin;
  }

  const forwardedProto = headerStore.get("x-forwarded-proto") ?? "https";
  const forwardedHost = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProductionUrl) {
    return `https://${vercelProductionUrl}`;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return env.NEXT_PUBLIC_SITE_URL;
}

function parseCreateUserFields(formData: FormData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const email = normalizeEmail(String(formData.get("email") || ""));
  const role = parseRole(String(formData.get("role") || "editor"));
  const avatarUrl = String(formData.get("avatar_url") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  if (!fullName || fullName.length < 2) throw new Error("Full name is required");
  if (!email || !email.includes("@")) throw new Error("Valid email is required");

  return {
    fullName,
    email,
    role,
    avatarUrl,
    phone,
    bio
  };
}

async function countAdmins(client: WriteClient): Promise<number> {
  const { count, error } = await client
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");

  if (error) throw error;
  return count ?? 0;
}

async function getTargetProfile(client: WriteClient, userId: string): Promise<TargetProfile> {
  const { data, error } = await client
    .from("profiles")
    .select("id,email,role,status,display_name,avatar_url,phone,bio,force_password_reset")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("User not found");

  return {
    id: String(data.id),
    email: String(data.email ?? ""),
    role: normalizeRole(typeof data.role === "string" ? data.role : "editor"),
    status: normalizeAccountStatus(typeof data.status === "string" ? data.status : "active"),
    display_name: typeof data.display_name === "string" ? data.display_name : null,
    avatar_url: typeof data.avatar_url === "string" ? data.avatar_url : null,
    phone: typeof data.phone === "string" ? data.phone : null,
    bio: typeof data.bio === "string" ? data.bio : null,
    force_password_reset: Boolean(data.force_password_reset)
  };
}

function assertCannotRemoveLastAdmin(currentRole: AppRole, nextRole: AppRole, adminCount: number): void {
  if (currentRole === "admin" && nextRole !== "admin" && adminCount <= 1) {
    throw new Error("Cannot remove the last admin");
  }
}

function assertCannotDisableLastAdmin(currentRole: AppRole, nextStatus: AccountStatus, adminCount: number): void {
  if (currentRole === "admin" && nextStatus !== "active" && adminCount <= 1) {
    throw new Error("Cannot disable the last admin");
  }
}

async function findAuthUserByEmail(email: string): Promise<{ id: string; email?: string | null } | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  let page = 1;
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message || "Failed to query auth users");

    const matched = data.users.find((user) => (user.email ?? "").toLowerCase() === email.toLowerCase());
    if (matched) return matched;
    if (data.users.length < 200) break;
    page += 1;
  }

  return null;
}

function revalidateUserViews(userId?: string): void {
  revalidatePath("/dashboard/users");
  if (userId) {
    revalidatePath(`/dashboard/users/${userId}`);
  }
}

function resolveMagicLinkNextPath(target: Pick<TargetProfile, "status" | "force_password_reset">): string {
  if (target.status === "pending_invite") {
    return "/reset-password?invite=1";
  }
  if (target.force_password_reset) {
    return "/reset-password?forced=1";
  }
  return "/dashboard";
}

function resolveMagicLinkType(target: Pick<TargetProfile, "status" | "force_password_reset">): "invite" | "recovery" | "magiclink" {
  if (target.status === "pending_invite") {
    return "invite";
  }
  if (target.force_password_reset) {
    return "recovery";
  }
  return "magiclink";
}

function buildManagedAuthLink(baseUrl: string, params: { tokenHash: string; type: string; nextPath: string }): string {
  const url = new URL("/auth/complete", baseUrl);
  url.searchParams.set("token_hash", params.tokenHash);
  url.searchParams.set("type", params.type);
  url.searchParams.set("next", params.nextPath);
  return url.toString();
}

async function createMagicLinkForUser(userId: string): Promise<{ target: TargetProfile; magicLink: string; nextPath: string; verificationType: string }> {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("Service role key is required to generate magic links");
  }

  const client = getWriteClient();
  const target = await getTargetProfile(client, userId);

  if (target.status === "disabled") {
    throw new Error("Cannot generate a magic link for a disabled account");
  }

  const nextPath = resolveMagicLinkNextPath(target);
  const verificationType = resolveMagicLinkType(target);
  const baseUrl = await getAppBaseUrl();
  const redirectTo = buildMagicLinkRedirectUrl(baseUrl, nextPath);
  const linkParams =
    verificationType === "recovery"
      ? {
          type: "recovery" as const,
          email: target.email,
          options: {
            redirectTo
          }
        }
      : {
          type: verificationType,
          email: target.email,
          options: {
            redirectTo,
            data: {
              full_name: target.display_name || undefined,
              display_name: target.display_name || undefined,
              role: target.role
            }
          }
        };
  const { data, error } = await admin.auth.admin.generateLink(linkParams);

  if (error) {
    throw new Error(error.message || "Failed to generate magic link");
  }

  const tokenHash = data.properties?.hashed_token;
  const returnedType = data.properties?.verification_type ?? verificationType;
  if (!tokenHash) {
    throw new Error("Magic link token was not returned by Supabase");
  }

  const magicLink = buildManagedAuthLink(baseUrl, {
    tokenHash,
    type: returnedType,
    nextPath
  });

  return { target, magicLink, nextPath, verificationType: returnedType };
}

async function upsertManagedProfile(
  client: WriteClient,
  payload: {
    authUserId: string;
    email: string;
    role: AppRole;
    fullName: string;
    avatarUrl: string;
    phone: string;
    bio: string;
    status: AccountStatus;
    forcePasswordReset?: boolean;
  }
): Promise<{ isNewProfile: boolean; desiredStatus: AccountStatus }> {
  const { data: existingProfile, error: profileError } = await client
    .from("profiles")
    .select("status")
    .eq("id", payload.authUserId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  const isNewProfile = !existingProfile;
  const desiredStatus = existingProfile
    ? normalizeAccountStatus(String(existingProfile.status ?? payload.status))
    : payload.status;

  const { error: upsertError } = await client.from("profiles").upsert({
    id: payload.authUserId,
    email: payload.email,
    role: payload.role,
    status: desiredStatus,
    display_name: payload.fullName,
    avatar_url: payload.avatarUrl || null,
    phone: payload.phone || null,
    bio: payload.bio || null,
    force_password_reset: Boolean(payload.forcePasswordReset)
  });

  if (upsertError) {
    throw upsertError;
  }

  return { isNewProfile, desiredStatus };
}

/* ── Core operations ── */

async function applyRoleChange(actor: AppProfile, userId: string, nextRole: AppRole): Promise<void> {
  const client = getWriteClient();
  const target = await getTargetProfile(client, userId);

  if (!canAssignRole(actor.role, nextRole)) {
    throw new Error("Only admins can assign this role");
  }

  const adminCount = await countAdmins(client);
  assertCannotRemoveLastAdmin(target.role, nextRole, adminCount);

  const { error } = await client.from("profiles").update({ role: nextRole }).eq("id", userId);
  if (error) throw error;

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "user.role_change",
    entityType: "profile",
    entityId: userId,
    metadata: { previous_role: target.role, next_role: nextRole }
  });
}

async function applyStatusChange(actor: AppProfile, userId: string, nextStatus: AccountStatus): Promise<void> {
  const client = getWriteClient();
  const target = await getTargetProfile(client, userId);
  const adminCount = await countAdmins(client);
  assertCannotDisableLastAdmin(target.role, nextStatus, adminCount);

  const nowIso = new Date().toISOString();
  const { error } = await client
    .from("profiles")
    .update({
      status: nextStatus,
      force_logout_at: nextStatus === "active" ? null : nowIso
    })
    .eq("id", userId);

  if (error) throw error;

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: nextStatus === "disabled" ? "user.disabled" : "user.enabled",
    entityType: "profile",
    entityId: userId,
    metadata: { previous_status: target.status, next_status: nextStatus }
  });
}

async function applyDelete(actor: AppProfile, userId: string): Promise<void> {
  if (actor.id === userId) throw new Error("You cannot delete your own account");

  const client = getWriteClient();
  const target = await getTargetProfile(client, userId);
  const adminCount = await countAdmins(client);

  if (target.role === "admin" && adminCount <= 1) {
    throw new Error("Cannot delete the last admin");
  }

  const admin = createAdminClient();
  if (!admin) throw new Error("Service role key is required to delete users");

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message || "Failed to delete auth user");

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "user.deleted",
    entityType: "profile",
    entityId: userId,
    metadata: { deleted_email: target.email }
  });
}

async function applySendPasswordReset(actor: AppProfile, userId: string): Promise<void> {
  const client = getWriteClient();
  const target = await getTargetProfile(client, userId);
  const supabase = createClient();
  const baseUrl = await getAppBaseUrl();
  const redirectTo = buildCallbackUrl(baseUrl, "/reset-password");

  const { error } = await supabase.auth.resetPasswordForEmail(target.email, { redirectTo });
  if (error) throw new Error(error.message || "Unable to send password reset");

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "user.password_reset_email",
    entityType: "profile",
    entityId: userId,
    metadata: { recipient: target.email }
  });
}

async function applyForcePasswordReset(actor: AppProfile, userId: string): Promise<void> {
  const client = getWriteClient();
  const target = await getTargetProfile(client, userId);
  const nowIso = new Date().toISOString();

  const { error } = await client
    .from("profiles")
    .update({ force_password_reset: true, force_logout_at: nowIso })
    .eq("id", userId);

  if (error) throw error;

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "user.force_password_reset",
    entityType: "profile",
    entityId: userId,
    metadata: { previous_force_password_reset: target.force_password_reset }
  });
}

async function applyForceLogout(actor: AppProfile, userId: string): Promise<void> {
  const client = getWriteClient();
  const nowIso = new Date().toISOString();
  const { error } = await client.from("profiles").update({ force_logout_at: nowIso }).eq("id", userId);
  if (error) throw error;

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "user.force_logout",
    entityType: "profile",
    entityId: userId,
    metadata: { forced_at: nowIso }
  });
}

async function applyUpdateDetails(
  actor: AppProfile,
  payload: { userId: string; fullName: string; phone: string; bio: string; avatarUrl: string }
): Promise<void> {
  const client = getWriteClient();
  const { error } = await client
    .from("profiles")
    .update({
      display_name: payload.fullName || null,
      phone: payload.phone || null,
      bio: payload.bio || null,
      avatar_url: payload.avatarUrl || null
    })
    .eq("id", payload.userId);

  if (error) throw error;

  const admin = createAdminClient();
  if (admin) {
    const { error: authUpdateError } = await admin.auth.admin.updateUserById(payload.userId, {
      user_metadata: {
        full_name: payload.fullName || null,
        display_name: payload.fullName || null,
        phone: payload.phone || null,
        avatar_url: payload.avatarUrl || null
      }
    });

    if (authUpdateError) {
      logger.warn("Managed user auth metadata sync failed", {
        userId: payload.userId,
        error: authUpdateError.message
      });
    }
  }

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "user.updated",
    entityType: "profile",
    entityId: payload.userId,
    metadata: { fields: ["display_name", "phone", "bio", "avatar_url"] }
  });
}

/* ── Exported server actions ── */

export async function createUserInviteAction(formData: FormData): Promise<CreateUserResult> {
  try {
    const actor = await requireRole(["admin"]);
    const admin = createAdminClient();
    if (!admin) throw new Error("Service role key is required to invite users");

    const { fullName, email, role, avatarUrl, phone, bio } = parseCreateUserFields(formData);
    if (role === "admin" && !canAssignRole(actor.role, role)) {
      throw new Error("Only admins can assign the admin role");
    }

    let authUserId: string | null = null;
    const baseUrl = await getAppBaseUrl();
    const redirectTo = buildCallbackUrl(baseUrl, "/reset-password?invite=1");

    const inviteResult = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName, display_name: fullName, role },
      redirectTo
    });

    if (inviteResult.error) {
      const message = inviteResult.error.message.toLowerCase();
      const alreadyExists = message.includes("already") || message.includes("exists") || message.includes("registered");

      if (!alreadyExists) throw new Error(inviteResult.error.message || "Failed to send invitation");

      const existing = await findAuthUserByEmail(email);
      if (!existing) throw new Error(inviteResult.error.message || "Unable to locate existing user");
      authUserId = existing.id;
    } else {
      authUserId = inviteResult.data.user?.id ?? null;
    }

    if (!authUserId) {
      const existing = await findAuthUserByEmail(email);
      authUserId = existing?.id ?? null;
    }

    if (!authUserId) throw new Error("Unable to resolve invited user id");

    const client = getWriteClient();
    const { isNewProfile, desiredStatus } = await upsertManagedProfile(client, {
      authUserId,
      email,
      role,
      fullName,
      avatarUrl,
      phone,
      bio,
      status: "pending_invite",
      forcePasswordReset: false
    });

    if (isNewProfile) {
      await logAuditEvent({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "user.created",
        entityType: "profile",
        entityId: authUserId,
        metadata: { email, role, creation_mode: "invite" }
      });
    }

    await logAuditEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "user.invited",
      entityType: "profile",
      entityId: authUserId,
      metadata: { invited_email: email, role, status: desiredStatus }
    });

    const inviteTemplate = userInvitationTemplate({
      inviteeName: fullName,
      inviteeEmail: email,
      role: formatRoleName(role),
      invitedBy: actor.email
    });
    void sendEmail({ to: email, ...inviteTemplate });

    revalidateUserViews(authUserId);

    return {
      ok: true,
      mode: "invite",
      userId: authUserId,
      message: "Invitation requested. Supabase will send the invite email if Auth email delivery is configured."
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send invitation";
    logger.error("User invite failed", { error: message });
    return { ok: false, message };
  }
}

export async function createUserWithPasswordAction(formData: FormData): Promise<CreateUserResult> {
  try {
    const actor = await requireRole(["admin"]);
    const admin = createAdminClient();
    if (!admin) throw new Error("Service role key is required to create users");

    const { fullName, email, role, avatarUrl, phone, bio } = parseCreateUserFields(formData);
    const password = parsePassword(formData.get("password"));
    const confirmPassword = String(formData.get("confirm_password") || "");

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    if (role === "admin" && !canAssignRole(actor.role, role)) {
      throw new Error("Only admins can assign the admin role");
    }

    const existing = await findAuthUserByEmail(email);
    if (existing) {
      throw new Error("A user with this email already exists");
    }

    const createResult = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        display_name: fullName,
        role
      }
    });

    if (createResult.error) {
      throw new Error(createResult.error.message || "Failed to create user");
    }

    const authUserId = createResult.data.user?.id;
    if (!authUserId) {
      throw new Error("Unable to resolve created user id");
    }

    const client = getWriteClient();
    await upsertManagedProfile(client, {
      authUserId,
      email,
      role,
      fullName,
      avatarUrl,
      phone,
      bio,
      status: "active",
      forcePasswordReset: false
    });

    await logAuditEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "user.created",
      entityType: "profile",
      entityId: authUserId,
      metadata: { email, role, creation_mode: "manual" }
    });

    revalidateUserViews(authUserId);

    return {
      ok: true,
      mode: "manual",
      userId: authUserId,
      message: "User created successfully. Share the password with them through a secure channel."
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    logger.error("Manual user creation failed", { error: message });
    return { ok: false, message };
  }
}

export async function updateUserRoleAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");
  const role = parseRole(String(formData.get("role") || "editor"));

  if (!userId) throw new Error("User id is required");

  await applyRoleChange(actor, userId, role);
  revalidateUserViews(userId);
}

export async function setUserStatusAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");
  const status = parseStatus(String(formData.get("status") || "active"));

  if (!userId) throw new Error("User id is required");

  await applyStatusChange(actor, userId, status);
  revalidateUserViews(userId);
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");

  if (!userId) throw new Error("User id is required");

  await applyDelete(actor, userId);
  revalidateUserViews(userId);
}

export async function sendPasswordResetEmailAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");

  if (!userId) throw new Error("User id is required");

  await applySendPasswordReset(actor, userId);

  // Also send branded password reset notification
  const client = getWriteClient();
  const target = await getTargetProfile(client, userId);
  const resetTemplate = passwordResetTemplate({ recipientEmail: target.email });
  void sendEmail({ to: target.email, ...resetTemplate });

  revalidateUserViews(userId);
}

export async function copyMagicLinkAction(formData: FormData): Promise<MagicLinkActionResult> {
  try {
    const actor = await requireRole(["admin"]);
    const userId = String(formData.get("userId") || "");

    if (!userId) throw new Error("User id is required");

    const { target, magicLink, nextPath } = await createMagicLinkForUser(userId);

    await logAuditEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "user.magic_link_copied",
      entityType: "profile",
      entityId: userId,
      metadata: { target_email: target.email, next_path: nextPath }
    });

    return { ok: true, message: "Magic link generated.", url: magicLink };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate magic link";
    logger.error("Magic link copy failed", { error: message });
    return { ok: false, message };
  }
}

export async function sendMagicLinkEmailAction(formData: FormData): Promise<MagicLinkActionResult> {
  try {
    const actor = await requireRole(["admin"]);
    const userId = String(formData.get("userId") || "");

    if (!userId) throw new Error("User id is required");

    const { target, magicLink, nextPath } = await createMagicLinkForUser(userId);
    const emailTemplate = magicLinkTemplate({
      recipientName: target.display_name,
      recipientEmail: target.email,
      magicLink
    });
    const emailResult = await sendEmail({ to: target.email, ...emailTemplate });

    if (!emailResult.ok) {
      throw new Error(emailResult.error || "Failed to send magic link email");
    }

    await logAuditEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "user.magic_link_sent",
      entityType: "profile",
      entityId: userId,
      metadata: { target_email: target.email, next_path: nextPath }
    });

    return { ok: true, message: `Magic link sent to ${target.email}.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send magic link";
    logger.error("Magic link send failed", { error: message });
    return { ok: false, message };
  }
}

export async function forcePasswordResetAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");

  if (!userId) throw new Error("User id is required");

  await applyForcePasswordReset(actor, userId);
  revalidateUserViews(userId);
}

export async function forceLogoutUserAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");

  if (!userId) throw new Error("User id is required");

  await applyForceLogout(actor, userId);
  revalidateUserViews(userId);
}

export async function updateUserDetailsAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const avatarUrl = String(formData.get("avatar_url") || "").trim();

  if (!userId) throw new Error("User id is required");

  await applyUpdateDetails(actor, { userId, fullName, phone, bio, avatarUrl });
  revalidateUserViews(userId);
}

export async function updateUserPermissionsAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const userId = String(formData.get("userId") || "");
  if (!userId) throw new Error("User id is required");

  const permissions: Record<string, boolean> = {};
  for (const perm of ALL_PERMISSIONS) {
    const value = formData.get(`perm_${perm}`);
    if (value !== null) {
      permissions[perm] = value === "true";
    }
  }

  const client = getWriteClient();
  const { error } = await client.from("profiles").update({ permissions }).eq("id", userId);
  if (error) throw error;

  await logAuditEvent({
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    action: "user.permissions_change",
    entityType: "profile",
    entityId: userId,
    metadata: { permissions }
  });

  revalidateUserViews(userId);
}

export async function bulkUserAction(formData: FormData): Promise<void> {
  const actor = await requireRole(["admin"]);
  const operation = String(formData.get("bulkAction") || "").trim();
  const bulkRoleRaw = String(formData.get("bulkRole") || "").trim();
  const userIds = Array.from(
    new Set(
      formData
        .getAll("userIds")
        .map((value) => String(value))
        .filter(Boolean)
    )
  );

  if (userIds.length === 0) throw new Error("Select at least one user");

  try {
    if (operation === "disable") {
      for (const userId of userIds) await applyStatusChange(actor, userId, "disabled");
    } else if (operation === "delete") {
      for (const userId of userIds) await applyDelete(actor, userId);
    } else if (operation === "change_role") {
      const bulkRole = parseRole(bulkRoleRaw || "editor");
      for (const userId of userIds) await applyRoleChange(actor, userId, bulkRole);
    } else if (operation === "send_reset") {
      for (const userId of userIds) await applySendPasswordReset(actor, userId);
    } else {
      throw new Error("Invalid bulk action");
    }
  } catch (error) {
    logger.error("Bulk user action failed", {
      operation,
      count: userIds.length,
      error: error instanceof Error ? error.message : "unknown"
    });
    throw error;
  }

  revalidateUserViews();
}
