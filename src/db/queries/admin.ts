import "server-only";

import {
  APP_ROLES,
  normalizeAccountStatus,
  normalizeRole,
  type AccountStatus,
  type AppPermission,
  type AppRole
} from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export async function getDashboardLeads(page = 1, pageSize = 20, search = "", status = "") {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("leads")
    .select("id,name,email,message,status,notes,created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search.trim()) {
    const escaped = search.trim().replace(/[%_]/g, "");
    query = query.or(`name.ilike.%${escaped}%,email.ilike.%${escaped}%,message.ilike.%${escaped}%`);
  }

  if (status && ["new", "contacted", "converted", "lost", "archived"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    rows: data ?? [],
    total: count ?? 0,
    page,
    pageSize
  };
}

export async function getLeadStatusCounts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("status");

  if (error) throw error;

  const counts: Record<string, number> = { new: 0, contacted: 0, converted: 0, lost: 0, archived: 0 };
  for (const row of data ?? []) {
    const s = (row as { status?: string }).status || "new";
    counts[s] = (counts[s] || 0) + 1;
  }
  return counts;
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export type DashboardUserRow = {
  id: string;
  email: string;
  role: AppRole;
  role_id: number | null;
  status: AccountStatus;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  permissions: Record<string, boolean>;
  created_at: string;
  last_login: string | null;
  last_activity: string | null;
  last_password_change: string | null;
  force_password_reset: boolean;
  force_logout_at: string | null;
};

export type DashboardRoleRow = {
  id: number;
  slug: AppRole;
  name: string;
  description: string | null;
  sort_order: number;
};

type UserListFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
  lastLogin?: string;
  createdWithin?: string;
};

const USER_SELECT_FIELDS =
  "id,email,role,role_id,status,display_name,avatar_url,phone,bio,permissions,created_at,last_login,last_activity,last_password_change,force_password_reset,force_logout_at";

function parsePermissions(raw: unknown): Record<string, boolean> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const result: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof value === "boolean") {
        result[key] = value;
      }
    }
    return result;
  }
  return {};
}

function isMissingAppRolesTableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  const message =
    "message" in error ? String((error as { message?: unknown }).message ?? "").toLowerCase() : "";

  return code === "42P01" || message.includes("app_roles");
}

function normalizeUserRow(row: Record<string, unknown>): DashboardUserRow {
  return {
    id: String(row.id ?? ""),
    email: String(row.email ?? ""),
    role: normalizeRole(typeof row.role === "string" ? row.role : "editor"),
    role_id: typeof row.role_id === "number" ? row.role_id : null,
    status: normalizeAccountStatus(typeof row.status === "string" ? row.status : "active"),
    display_name: typeof row.display_name === "string" ? row.display_name : null,
    avatar_url: typeof row.avatar_url === "string" ? row.avatar_url : null,
    phone: typeof row.phone === "string" ? row.phone : null,
    bio: typeof row.bio === "string" ? row.bio : null,
    permissions: parsePermissions(row.permissions),
    created_at: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
    last_login: typeof row.last_login === "string" ? row.last_login : null,
    last_activity: typeof row.last_activity === "string" ? row.last_activity : null,
    last_password_change: typeof row.last_password_change === "string" ? row.last_password_change : null,
    force_password_reset: Boolean(row.force_password_reset),
    force_logout_at: typeof row.force_logout_at === "string" ? row.force_logout_at : null
  };
}

function normalizeRoleRow(row: Record<string, unknown>): DashboardRoleRow {
  return {
    id: typeof row.id === "number" ? row.id : 2,
    slug: normalizeRole(typeof row.slug === "string" ? row.slug : "editor"),
    name: typeof row.name === "string" ? row.name : "Editor",
    description: typeof row.description === "string" ? row.description : null,
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0
  };
}

export async function getDashboardUsers(filters: UserListFilters = {}) {
  const page = Math.max(1, Number(filters.page ?? 1));
  const pageSize = Math.min(100, Math.max(5, Number(filters.pageSize ?? 20)));
  const search = String(filters.search ?? "").trim();
  const role = String(filters.role ?? "").trim();
  const status = String(filters.status ?? "").trim();
  const lastLogin = String(filters.lastLogin ?? "").trim();
  const createdWithin = String(filters.createdWithin ?? "").trim();

  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("profiles")
    .select(USER_SELECT_FIELDS, { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    const escaped = search.replace(/[%_]/g, "");
    query = query.or(`display_name.ilike.%${escaped}%,email.ilike.%${escaped}%`);
  }

  if (role) {
    query = query.eq("role", role);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (lastLogin === "never") {
    query = query.is("last_login", null);
  } else if (lastLogin === "7d" || lastLogin === "30d" || lastLogin === "90d") {
    query = query.gte("last_login", isoDaysAgo(Number(lastLogin.replace("d", ""))));
  }

  if (createdWithin === "7d" || createdWithin === "30d" || createdWithin === "90d" || createdWithin === "365d") {
    query = query.gte("created_at", isoDaysAgo(Number(createdWithin.replace("d", ""))));
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    rows: (data ?? []).map((row) => normalizeUserRow(row as Record<string, unknown>)),
    total: count ?? 0,
    page,
    pageSize
  };
}

export async function getDashboardUserById(id: string): Promise<DashboardUserRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(USER_SELECT_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return normalizeUserRow(data as Record<string, unknown>);
}

export async function getDashboardRoles(): Promise<DashboardRoleRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("app_roles")
    .select("id,slug,name,description,sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    if (isMissingAppRolesTableError(error)) {
      return APP_ROLES.map((role, index) => ({
        id: index + 1,
        slug: role,
        name: role.charAt(0).toUpperCase() + role.slice(1),
        description: null,
        sort_order: index
      }));
    }
    throw error;
  }

  return (data ?? []).map((row) => normalizeRoleRow(row as Record<string, unknown>));
}

export async function getRecentUserActivity(userId: string, limit = 20) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id,action,entity_type,entity_id,metadata,created_at")
    .eq("actor_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data ?? [];
}

export async function getUserEditCount(userId: string): Promise<number> {
  const supabase = createClient();
  const editActions = [
    "post.create",
    "post.update",
    "post.publish",
    "post.restore",
    "work.create",
    "work.update",
    "work.publish",
    "work.restore",
    "testimonial.update",
    "testimonial.publish",
    "testimonial.status_change"
  ];

  const { count, error } = await supabase
    .from("audit_logs")
    .select("id", { head: true, count: "exact" })
    .eq("actor_id", userId)
    .in("action", editActions);

  if (error) throw error;

  return count ?? 0;
}
