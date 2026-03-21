"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  action: (formData: FormData) => Promise<void>;
  errorText: string;
  forcedReset: boolean;
  errorCode: string;
};

export function LoginForm({ action, errorText, forcedReset, errorCode }: LoginFormProps): JSX.Element {
  return (
    <>
      <form action={action} className="space-y-5" aria-label="Login form">
        <LoginFields />
      </form>

      {errorText ? (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2.5">
          <p className="text-sm text-red-400">{errorText}</p>
        </div>
      ) : null}
      {forcedReset ? (
        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2.5">
          <p className="text-sm text-amber-400">Password reset is required before accessing the dashboard.</p>
        </div>
      ) : null}
      {process.env.NODE_ENV !== "production" && errorCode ? (
        <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.1em] text-fg/36">Code: {errorCode}</p>
      ) : null}
    </>
  );
}

function LoginFields(): JSX.Element {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.1em] text-fg/56">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          disabled={pending}
          className="h-11 rounded-xl border-border/18 bg-bg/50 px-4 text-sm text-fg transition-colors duration-200 placeholder:text-fg/30 focus:border-accentA/40 focus:ring-accentA/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.1em] text-fg/56">
          Password
        </Label>
        <PasswordInput
          id="password"
          name="password"
          required
          placeholder="••••••••"
          disabled={pending}
        />
        <div className="flex justify-end">
          <Link
            href="/admin/forgot-password"
            className="text-xs text-fg/48 transition-colors hover:text-accentA"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      <div className="space-y-2">
        <Button type="submit" className="h-11 w-full rounded-xl text-sm font-medium" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
        <p aria-live="polite" className="min-h-[1rem] text-center text-xs text-fg/42">
          {pending ? "Checking your credentials and preparing the dashboard..." : ""}
        </p>
      </div>
    </>
  );
}
