"use client";

import { type FormEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { STRONG_PASSWORD_HINT, validatePasswordAgainstPolicy } from "@/lib/auth/password-policy";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import type { DashboardRoleRow } from "@/db/queries/admin";
import type { CreateUserResult } from "@/app/dashboard/users/actions";

type AddUserDialogProps = {
  roleOptions: DashboardRoleRow[];
  createUserInviteAction: (formData: FormData) => Promise<CreateUserResult>;
  createUserWithPasswordAction: (formData: FormData) => Promise<CreateUserResult>;
  requireStrongPasswords: boolean;
};

type CreationMode = "invite" | "manual";

export function AddUserDialog({
  roleOptions,
  createUserInviteAction,
  createUserWithPasswordAction,
  requireStrongPasswords
}: AddUserDialogProps): JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<CreationMode>("invite");
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function resetFormState() {
    setMode("invite");
    setError("");
    formRef.current?.reset();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    if (mode === "manual") {
      const password = String(formData.get("password") || "");
      const validationError = validatePasswordAgainstPolicy(password, {
        requireStrongPasswords
      });
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }
    }

    startTransition(async () => {
      const result =
        mode === "invite"
          ? await createUserInviteAction(formData)
          : await createUserWithPasswordAction(formData);

      if (!result.ok) {
        setError(result.message);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
      resetFormState();
      setOpen(false);
    });
  }

  return (
    <>
      <Button
        type="button"
        className="gap-2 rounded-lg border border-accentA/20 bg-accentA/8 px-3.5 py-2 text-sm font-medium text-accentA transition hover:bg-accentA/16"
        variant="ghost"
        onClick={() => {
          resetFormState();
          setOpen(true);
        }}
      >
        <UserPlus className="h-4 w-4" />
        Add User
      </Button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            resetFormState();
          }
          setOpen(nextOpen);
        }}
      >
        <DialogContent className="max-w-2xl border-border/18 bg-card/95 p-0 backdrop-blur">
          <div className="p-6">
            <DialogHeader className="mb-5">
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Choose whether to send an invitation or create the account manually with a password.
              </DialogDescription>
            </DialogHeader>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-border/12 bg-bg/35 p-1">
              <Button
                type="button"
                variant={mode === "invite" ? "default" : "ghost"}
                className="h-10"
                onClick={() => setMode("invite")}
              >
                Send Invitation
              </Button>
              <Button
                type="button"
                variant={mode === "manual" ? "default" : "ghost"}
                className="h-10"
                onClick={() => setMode("manual")}
              >
                Create Manually
              </Button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
              <FormAlert
                message={error || (mode === "invite" ? "Invite delivery depends on Supabase Auth email configuration." : "")}
                type={error ? "error" : "info"}
                className="md:col-span-2"
              />
              <Input name="full_name" placeholder="Full name *" required />
              <Input name="email" placeholder="Email address *" type="email" required />
              <select
                name="role"
                className="h-10 rounded-md border border-border/20 bg-card/72 px-3 text-sm text-fg"
                defaultValue="editor"
              >
                {roleOptions.map((roleOption) => (
                  <option key={roleOption.id} value={roleOption.slug}>
                    {roleOption.name}
                  </option>
                ))}
              </select>
              <Input name="phone" placeholder="Phone (optional)" />
              <Input name="avatar_url" placeholder="Avatar URL (optional)" />
              <Input name="bio" placeholder="Bio (optional)" />
              {mode === "manual" && (
                <>
                  <PasswordInput name="password" placeholder="Password *" required minLength={8} />
                  <PasswordInput name="confirm_password" placeholder="Confirm password *" required minLength={8} />
                  <p className="md:col-span-2 -mt-1 text-xs text-fg/48">
                    {requireStrongPasswords ? STRONG_PASSWORD_HINT : "Minimum 8 characters."}
                  </p>
                </>
              )}
              <DialogFooter className="md:col-span-2 mt-2 justify-start">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? "Working..." : mode === "invite" ? "Send invitation" : "Create user"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
