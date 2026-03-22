"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, LogOut, RefreshCcw, Trash2 } from "lucide-react";
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

type UserSecurityActionsProps = {
  userId: string;
  email: string;
  isSelf: boolean;
  sendPasswordResetAction: (formData: FormData) => Promise<void>;
  forcePasswordResetAction: (formData: FormData) => Promise<void>;
  forceLogoutAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};

function buildFormData(userId: string): FormData {
  const formData = new FormData();
  formData.append("userId", userId);
  return formData;
}

export function UserSecurityActions({
  userId,
  email,
  isSelf,
  sendPasswordResetAction,
  forcePasswordResetAction,
  forceLogoutAction,
  deleteAction
}: UserSecurityActionsProps): JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function runAction(
    action: (formData: FormData) => Promise<void>,
    successMessage: string,
    afterSuccess?: () => void
  ) {
    startTransition(async () => {
      try {
        await action(buildFormData(userId));
        afterSuccess?.();
        setStatusMessage({ ok: true, text: successMessage });
        toast.success(successMessage);
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Action failed. Please try again.";
        setStatusMessage({ ok: false, text: message });
        toast.error(message);
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => runAction(sendPasswordResetAction, "Password reset email sent.")}
        >
          {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <KeyRound className="mr-1.5 h-3.5 w-3.5" />}
          Send password reset email
        </Button>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => runAction(forcePasswordResetAction, "Password reset will be required on the next login.")}
        >
          <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
          Force reset on next login
        </Button>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => runAction(forceLogoutAction, "User has been signed out on their next request.")}
        >
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          Force logout
        </Button>

        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={isPending || isSelf}
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      {statusMessage ? (
        <p className={`text-xs ${statusMessage.ok ? "text-emerald-400" : "text-red-400"}`}>{statusMessage.text}</p>
      ) : null}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              This permanently deletes <strong>{email}</strong> and cannot be undone.
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
                runAction(deleteAction, "User deleted.");
              }}
            >
              Confirm delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
