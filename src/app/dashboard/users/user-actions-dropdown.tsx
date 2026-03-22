"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Loader2, Copy, Send } from "lucide-react";
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
  canManageMagicLinks: boolean;
  roles: string[];
  updateRoleAction: (formData: FormData) => Promise<void>;
  copyMagicLinkAction: (formData: FormData) => Promise<{ ok: boolean; message: string; url?: string }>;
  sendMagicLinkAction: (formData: FormData) => Promise<{ ok: boolean; message: string; url?: string }>;
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
  canManageMagicLinks,
  roles,
  updateRoleAction,
  copyMagicLinkAction,
  sendMagicLinkAction,
  sendPasswordResetAction,
  setStatusAction,
  deleteAction
}: UserActionsProps) {
  const router = useRouter();
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
        router.refresh();
      } catch {
        toast.error("Action failed. Please try again.");
      }
    });
  }

  function buildFormData(data: Record<string, string>) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      fd.append(key, value);
    }
    return fd;
  }

  function handleCopyMagicLink() {
    startTransition(async () => {
      const result = await copyMagicLinkAction(buildFormData({ userId }));
      if (!result.ok || !result.url) {
        toast.error(result.message || "Failed to generate magic link.");
        return;
      }

      try {
        await navigator.clipboard.writeText(result.url);
        toast.success("Magic link copied to clipboard.");
      } catch {
        window.prompt("Copy the magic link below:", result.url);
        toast.success("Magic link generated.");
      }
    });
  }

  function handleSendMagicLink() {
    startTransition(async () => {
      const result = await sendMagicLinkAction(buildFormData({ userId }));
      if (!result.ok) {
        toast.error(result.message || "Failed to send magic link.");
        return;
      }
      toast.success(result.message);
      router.refresh();
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

          {canManageMagicLinks ? (
            <>
              <DropdownMenuItem onClick={handleSendMagicLink}>
                <Send className="mr-2 h-4 w-4" />
                Send Magic Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyMagicLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Magic Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : null}

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
