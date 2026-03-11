"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

type DeleteUserDialogProps = {
  userId: string;
  email: string;
  disabled?: boolean;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function DeleteUserDialog({ userId, email, disabled = false, deleteAction }: DeleteUserDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={disabled}
        className="h-7 px-2 text-xs"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              This permanently deletes <strong>{email}</strong> and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <form action={deleteAction}>
              <input type="hidden" name="userId" value={userId} />
              <Button type="submit" variant="destructive" onClick={() => setOpen(false)}>
                Confirm delete
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
