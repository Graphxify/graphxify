"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Loader2, Copy, Send, KeyRound, LogOut, RefreshCcw, ShieldAlert, Trash2 } from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type UserActionsProps = {
  userId: string;
  currentRole: string;
  currentStatus: string;
  currentDisabledUntil?: string | null;
  isSelf: boolean;
  canManageMagicLinks: boolean;
  roles: string[];
  updateRoleAction: (formData: FormData) => Promise<void>;
  copyMagicLinkAction: (formData: FormData) => Promise<{ ok: boolean; message: string; url?: string }>;
  sendMagicLinkAction: (formData: FormData) => Promise<{ ok: boolean; message: string; url?: string }>;
  sendPasswordResetAction: (formData: FormData) => Promise<void>;
  forcePasswordResetAction: (formData: FormData) => Promise<void>;
  forceLogoutAction: (formData: FormData) => Promise<void>;
  setStatusAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  onRoleUpdated?: (userId: string, nextRole: string) => void;
  onStatusUpdated?: (userId: string, nextStatus: string, disabledUntil: string | null) => void;
  onUserDeleted?: (userId: string) => void;
};

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function UserActionsDropdown({
  userId,
  currentRole,
  currentStatus,
  currentDisabledUntil,
  isSelf,
  canManageMagicLinks,
  roles,
  updateRoleAction,
  copyMagicLinkAction,
  sendMagicLinkAction,
  sendPasswordResetAction,
  forcePasswordResetAction,
  forceLogoutAction,
  setStatusAction,
  deleteAction,
  onRoleUpdated,
  onStatusUpdated,
  onUserDeleted
}: UserActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [disableMode, setDisableMode] = useState<"disable" | "timeout">("disable");
  const [timeoutDays, setTimeoutDays] = useState("7");

  function handleAction(
    action: (formData: FormData) => Promise<void>,
    data: Record<string, string>,
    successMessage: string,
    onSuccess?: () => void
  ) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      fd.append(key, value);
    }
    startTransition(async () => {
      try {
        await action(fd);
        onSuccess?.();
        toast.success(successMessage);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Action failed. Please try again.");
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

  function handleRoleChange(nextRole: string) {
    handleAction(updateRoleAction, { userId, role: nextRole }, `Role changed to ${roleLabel(nextRole)}`, () => {
      onRoleUpdated?.(userId, nextRole);
    });
  }

  function handleEnableAccount() {
    handleAction(setStatusAction, { userId, mode: "enable" }, "Account enabled", () => {
      onStatusUpdated?.(userId, "active", null);
    });
  }

  function handleDisableSubmit() {
    const nextDisabledUntil =
      disableMode === "timeout"
        ? new Date(Date.now() + Number(timeoutDays) * 24 * 60 * 60 * 1000).toISOString()
        : null;

    setDisableDialogOpen(false);
    handleAction(
      setStatusAction,
      disableMode === "timeout"
        ? { userId, mode: "timeout", timeout_days: timeoutDays }
        : { userId, mode: "disable" },
      disableMode === "timeout" ? `Account timed out for ${timeoutDays} days` : "Account disabled",
      () => {
        onStatusUpdated?.(userId, "disabled", nextDisabledUntil);
      }
    );
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
        <DropdownMenuContent align="end" className="w-56">
          {roles.filter((r) => r !== currentRole).length > 0 ? (
            <>
              <DropdownMenuLabel>Role</DropdownMenuLabel>
              {roles.filter((r) => r !== currentRole).map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => handleRoleChange(r)}
                >
                  Set role → {roleLabel(r)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          ) : null}

          {canManageMagicLinks ? (
            <>
              <DropdownMenuLabel>Access</DropdownMenuLabel>
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

          <DropdownMenuLabel>Security</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleAction(sendPasswordResetAction, { userId }, "Password reset email sent")}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Reset password
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction(forcePasswordResetAction, { userId }, "Password reset will be required on the next login")}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Force reset on next login
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction(forceLogoutAction, { userId }, "User has been signed out on their next request")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Force logout
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={isSelf}
            onSelect={(event) => {
              event.preventDefault();
              if (currentStatus === "disabled") {
                handleEnableAccount();
                return;
              }
              setDisableDialogOpen(true);
            }}
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
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
            <Trash2 className="mr-2 h-4 w-4" />
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
                handleAction(deleteAction, { userId }, "User deleted", () => {
                  onUserDeleted?.(userId);
                });
              }}
            >
              Confirm delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable account</DialogTitle>
            <DialogDescription>
              Choose whether this account should be disabled permanently or for a fixed number of days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-fg">Disable type</label>
              <select
                value={disableMode}
                onChange={(event) => setDisableMode(event.target.value as "disable" | "timeout")}
                className="h-10 rounded-md border border-border/20 bg-card/72 px-3 text-sm text-fg"
              >
                <option value="disable">Permanent disable</option>
                <option value="timeout">Temporary timeout</option>
              </select>
            </div>

            {disableMode === "timeout" ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-fg">Timeout period</label>
                <select
                  value={timeoutDays}
                  onChange={(event) => setTimeoutDays(event.target.value)}
                  className="h-10 rounded-md border border-border/20 bg-card/72 px-3 text-sm text-fg"
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            ) : null}

            {currentDisabledUntil ? (
              <p className="text-xs text-fg/56">
                Current timeout ends on {new Date(currentDisabledUntil).toLocaleString("en-US")}.
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDisableDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={isPending || isSelf} onClick={handleDisableSubmit}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
