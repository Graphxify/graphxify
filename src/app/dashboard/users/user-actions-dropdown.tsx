"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {roles.filter((r) => r !== currentRole).map((r) => (
            <DropdownMenuItem
              key={r}
              onClick={() => handleAction(updateRoleAction, { userId, role: r }, `Role changed to ${roleLabel(r)}`)}
            >
              Set role → {roleLabel(r)}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction(sendPasswordResetAction, { userId }, "Password reset email sent")}
          >
            Reset password
          </DropdownMenuItem>

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

          <DropdownMenuItem
            disabled={isSelf}
            onSelect={(event) => {
              event.preventDefault();
              setDeleteDialogOpen(true);
            }}
            className="text-red-400"
          >
            Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              This permanently deletes the user account and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending || isSelf}
              onClick={() => {
                setDeleteDialogOpen(false);
                handleAction(deleteAction, { userId }, "User deleted");
              }}
            >
              Confirm delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
