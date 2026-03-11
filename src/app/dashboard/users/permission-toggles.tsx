"use client";

import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  ALL_PERMISSIONS,
  PERMISSION_GROUPS,
  PERMISSION_LABELS,
  getRoleDefaults,
  type AppPermission,
  type AppRole
} from "@/lib/auth/roles";
import { updateUserPermissionsAction } from "@/app/dashboard/users/actions";

type PermissionTogglesProps = {
  userId: string;
  role: AppRole;
  overrides: Record<string, boolean>;
};

export function PermissionToggles({ userId, role, overrides }: PermissionTogglesProps): JSX.Element {
  const roleDefaults = getRoleDefaults(role);
  const [isPending, startTransition] = useTransition();

  // Build initial state combining role defaults + overrides
  const initialState: Record<AppPermission, boolean> = {} as Record<AppPermission, boolean>;
  for (const perm of ALL_PERMISSIONS) {
    const hasOverride = perm in overrides;
    initialState[perm] = hasOverride ? overrides[perm] : roleDefaults.has(perm);
  }

  const [permissions, setPermissions] = useOptimistic(initialState);

  function handleToggle(perm: AppPermission) {
    const newValue = !permissions[perm];
    setPermissions((prev) => ({ ...prev, [perm]: newValue }));
  }

  function handleSubmit() {
    // Only send overrides that differ from role defaults
    const formData = new FormData();
    formData.set("userId", userId);
    for (const perm of ALL_PERMISSIONS) {
      const current = permissions[perm];
      const isDefault = roleDefaults.has(perm);
      if (current !== isDefault) {
        formData.set(`perm_${perm}`, String(current));
      }
    }
    startTransition(async () => {
      await updateUserPermissionsAction(formData);
    });
  }

  return (
    <div className="space-y-6">
      {PERMISSION_GROUPS.map((group) => (
        <div key={group.label}>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-fg/48">{group.label}</h4>
          <div className="space-y-1">
            {group.permissions.map((perm) => {
              const isEnabled = permissions[perm];
              const isDefault = roleDefaults.has(perm);
              const isOverridden = (perm in overrides) && overrides[perm] !== isDefault;

              return (
                <label
                  key={perm}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-card/60"
                >
                  <span className="flex items-center gap-2 text-sm text-fg/80">
                    {PERMISSION_LABELS[perm]}
                    {isOverridden && (
                      <span className="rounded-full bg-accentA/12 px-1.5 py-0.5 text-[0.6rem] font-medium text-accentA">
                        Override
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={() => handleToggle(perm)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      isEnabled ? "bg-accentA" : "bg-border/30"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <Button type="button" size="sm" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving…" : "Save permissions"}
        </Button>
        <p className="text-xs text-fg/42">
          Role default: <span className="font-medium text-fg/62">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
        </p>
      </div>
    </div>
  );
}
