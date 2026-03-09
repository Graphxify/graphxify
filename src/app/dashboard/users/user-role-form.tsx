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

type UserRoleFormProps = {
    userId: string;
    currentRole: string;
    updateAction: (formData: FormData) => void;
};

export function UserRoleForm({ userId, currentRole, updateAction }: UserRoleFormProps) {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(currentRole);

    return (
        <>
            <div className="flex items-center gap-2">
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-sm text-fg"
                >
                    <option value="mod">mod</option>
                    <option value="admin">admin</option>
                </select>
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={selectedRole === currentRole}
                    onClick={() => setOpen(true)}
                >
                    Update
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change user role?</DialogTitle>
                        <DialogDescription>
                            This will change the user&apos;s role from <strong>{currentRole}</strong> to{" "}
                            <strong>{selectedRole}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <form action={updateAction}>
                            <input type="hidden" name="userId" value={userId} />
                            <input type="hidden" name="role" value={selectedRole} />
                            <Button type="submit" onClick={() => setOpen(false)}>
                                Confirm
                            </Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
