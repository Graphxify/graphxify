export const APP_ROLES = ["admin", "mod", "editor"] as const;
export type AppRole = (typeof APP_ROLES)[number];
export type LegacyRole = "reviewer" | "author";
export type StoredRole = AppRole | LegacyRole;

export const ACCOUNT_STATUSES = ["active", "disabled", "pending_invite"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

/* ── All granular permissions ── */

export const ALL_PERMISSIONS = [
  "content.works.create",
  "content.works.edit_any",
  "content.works.publish",
  "content.works.delete",
  "content.posts.create",
  "content.posts.edit_any",
  "content.posts.edit_own",
  "content.posts.publish",
  "content.posts.delete",
  "content.testimonials.view",
  "content.testimonials.create",
  "content.testimonials.edit",
  "content.testimonials.moderate",
  "content.testimonials.delete",
  "content.testimonial_metrics.edit",
  "content.services.edit",
  "content.homepage.edit",
  "media.upload",
  "analytics.view",
  "leads.view",
  "activity.view",
  "settings.manage",
  "users.manage",
  "users.create",
  "users.assign_role",
  "users.delete",
  "users.disable",
  "users.reset_password",
  "users.force_logout"
] as const;

export type AppPermission = (typeof ALL_PERMISSIONS)[number];

/* ── Human-readable labels for the permission toggles UI ── */

export const PERMISSION_LABELS: Record<AppPermission, string> = {
  "content.works.create": "Create projects",
  "content.works.edit_any": "Edit projects",
  "content.works.publish": "Publish projects",
  "content.works.delete": "Delete projects",
  "content.posts.create": "Create blog posts",
  "content.posts.edit_any": "Edit any blog posts",
  "content.posts.edit_own": "Edit own blog posts",
  "content.posts.publish": "Publish blog posts",
  "content.posts.delete": "Delete blog posts",
  "content.testimonials.view": "View testimonials",
  "content.testimonials.create": "Create testimonials",
  "content.testimonials.edit": "Edit testimonials",
  "content.testimonials.moderate": "Approve / reject testimonials",
  "content.testimonials.delete": "Delete testimonials",
  "content.testimonial_metrics.edit": "Edit testimonial metrics",
  "content.services.edit": "Edit services",
  "content.homepage.edit": "Edit homepage content",
  "media.upload": "Upload media",
  "analytics.view": "View analytics",
  "leads.view": "View leads",
  "activity.view": "View activity logs",
  "settings.manage": "Manage site settings",
  "users.manage": "View user management",
  "users.create": "Create users",
  "users.assign_role": "Assign roles",
  "users.delete": "Delete users",
  "users.disable": "Disable / enable users",
  "users.reset_password": "Reset passwords",
  "users.force_logout": "Force logout"
};

/* ── Default permissions per role ── */

const ROLE_PERMISSIONS: Record<AppRole, readonly AppPermission[]> = {
  admin: [...ALL_PERMISSIONS],
  mod: [
    "content.works.create",
    "content.works.edit_any",
    "content.works.publish",
    "content.posts.create",
    "content.posts.edit_any",
    "content.posts.edit_own",
    "content.posts.publish",
    "content.testimonials.view",
    "content.testimonials.create",
    "content.testimonials.edit",
    "content.testimonials.moderate",
    "content.testimonial_metrics.edit",
    "media.upload",
    "analytics.view",
    "leads.view",
    "activity.view"
  ],
  editor: [
    "content.works.create",
    "content.works.edit_any",
    "content.posts.create",
    "content.posts.edit_own",
    "content.services.edit",
    "content.homepage.edit",
    "media.upload"
  ]
};

/* ── Permission grouping for UI sections ── */

export type PermissionGroup = { label: string; permissions: AppPermission[] };

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: "Projects",
    permissions: ["content.works.create", "content.works.edit_any", "content.works.publish", "content.works.delete"]
  },
  {
    label: "Blog Posts",
    permissions: [
      "content.posts.create",
      "content.posts.edit_any",
      "content.posts.edit_own",
      "content.posts.publish",
      "content.posts.delete"
    ]
  },
  {
    label: "Testimonials",
    permissions: [
      "content.testimonials.view",
      "content.testimonials.create",
      "content.testimonials.edit",
      "content.testimonials.moderate",
      "content.testimonials.delete",
      "content.testimonial_metrics.edit"
    ]
  },
  {
    label: "Content & Media",
    permissions: ["content.services.edit", "content.homepage.edit", "media.upload"]
  },
  {
    label: "Dashboard",
    permissions: ["analytics.view", "leads.view", "activity.view"]
  },
  {
    label: "Administration",
    permissions: [
      "settings.manage",
      "users.manage",
      "users.create",
      "users.assign_role",
      "users.delete",
      "users.disable",
      "users.reset_password",
      "users.force_logout"
    ]
  }
];

/* ── Helpers ── */

const APP_ROLE_SET = new Set<string>(APP_ROLES);
const ACCOUNT_STATUS_SET = new Set<string>(ACCOUNT_STATUSES);

export function isAppRole(input: string): input is AppRole {
  return APP_ROLE_SET.has(input);
}

export function normalizeRole(input: string | null | undefined): AppRole {
  const normalized = String(input ?? "").trim().toLowerCase();
  if (normalized === "reviewer") return "mod";
  if (normalized === "author") return "editor";
  return isAppRole(normalized) ? normalized : "editor";
}

export function normalizeAccountStatus(input: string | null | undefined): AccountStatus {
  const normalized = String(input ?? "").trim().toLowerCase();
  return ACCOUNT_STATUS_SET.has(normalized) ? (normalized as AccountStatus) : "active";
}

/** Get the default permissions for a role. */
export function getRoleDefaults(role: AppRole): ReadonlySet<AppPermission> {
  return new Set(ROLE_PERMISSIONS[role]);
}

/**
 * Resolve effective permissions for a user.
 * Starts with role defaults, then applies per-user overrides from the jsonb column.
 */
export function resolvePermissions(
  role: AppRole,
  overrides?: Record<string, boolean> | null
): Set<AppPermission> {
  const effective = new Set(ROLE_PERMISSIONS[role]);
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      const perm = key as AppPermission;
      if (!ALL_PERMISSIONS.includes(perm)) continue;
      if (value) {
        effective.add(perm);
      } else {
        effective.delete(perm);
      }
    }
  }
  return effective;
}

/** Check if a role has a specific permission (default, ignoring overrides). */
export function hasPermission(role: AppRole, permission: AppPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/** Check if an actor can assign a given role. */
export function canAssignRole(actorRole: AppRole, nextRole: AppRole): boolean {
  if (actorRole !== "admin") return false;
  return true;
}
