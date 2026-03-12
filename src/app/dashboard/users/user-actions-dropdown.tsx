"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type UserActionsProps = {
  userId: string;
  currentRole: string;
  currentStatus: string;
  isSelf: boolean;
  roles: string[];
  updateRoleAction: (formData: FormData) => Promise<void>;
  sendPasswordResetAction: (formData: FormData) => Promise<void>;
  setStatusAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function UserActionsDropdown({
  userId,
  currentRole,
  currentStatus,
  isSelf,
  roles,
  updateRoleAction,
  sendPasswordResetAction,
  setStatusAction,
  deleteAction
}: UserActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleAction(action: (formData: FormData) => Promise<void>, data: Record<string, string>, successMessage: string) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      fd.append(key, value);
    }
    startTransition(async () => {
      try {
        await action(fd);
        toast.success(successMessage);
      } catch {
        toast.error("Action failed. Please try again.");
      }
    });
  }

  return (
    <DropdownMenu onOpenChange={() => setConfirmDelete(false)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Role changes */}
        {roles.filter((r) => r !== currentRole).map((r) => (
          <DropdownMenuItem
            key={r}
            onClick={() => handleAction(updateRoleAction, { userId, role: r }, `Role changed to ${roleLabel(r)}`)}
          >
            Set role → {roleLabel(r)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />

        {/* Reset password */}
        <DropdownMenuItem
          onClick={() => handleAction(sendPasswordResetAction, { userId }, "Password reset email sent")}
        >
          Reset password
        </DropdownMenuItem>

        {/* Enable/Disable */}
        <DropdownMenuItem
          disabled={isSelf}
          onClick={() =>
            handleAction(
              setStatusAction,
              { userId, status: currentStatus === "disabled" ? "active" : "disabled" },
              currentStatus === "disabled" ? "Account enabled" : "Account disabled"
            )
          }
        >
          {currentStatus === "disabled" ? "Enable account" : "Disable account"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete with confirmation */}
        {!confirmDelete ? (
          <DropdownMenuItem
            disabled={isSelf}
            onClick={(e) => {
              e.preventDefault();
              setConfirmDelete(true);
            }}
            className="text-red-400"
          >
            Delete user
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            disabled={isSelf}
            onClick={() => handleAction(deleteAction, { userId }, "User deleted")}
            className="text-red-400 font-semibold"
          >
            ⚠ Confirm delete?
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
