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

type ConfirmDialogProps = {
    title: string;
    description?: string;
    confirmLabel?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
    children: React.ReactNode;
};

export function ConfirmDialog({
    title,
    description = "Are you sure? This action cannot be undone.",
    confirmLabel = "Confirm",
    variant = "default",
    onConfirm,
    children
}: ConfirmDialogProps) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    async function handleConfirm() {
        setPending(true);
        try {
            await onConfirm();
            setOpen(false);
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <span onClick={() => setOpen(true)}>{children}</span>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant={variant === "destructive" ? "destructive" : "default"}
                            onClick={handleConfirm}
                            disabled={pending}
                        >
                            {pending ? "Processing..." : confirmLabel}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
