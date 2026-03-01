"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { emitCmsContentChanged } from "@/lib/client/cms-sync";

type DeleteContentButtonProps = {
  type: "post" | "work";
  id: string;
};

export function DeleteContentButton({ type, id }: DeleteContentButtonProps): JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    if (pending) return;

    setPending(true);
    setError("");

    try {
      const response = await fetch(`/api/dashboard/${type}s?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store"
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message || `Unable to delete ${type}`);
        return;
      }

      emitCmsContentChanged(`${type}.deleted`);
      setOpen(false);
      router.push(`/dashboard/${type}s`);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : `Unable to delete ${type}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        {`Delete ${type}`}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`Delete ${type}?`}</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          {error ? <p className="text-sm text-fg/74">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={onDelete} disabled={pending}>
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
