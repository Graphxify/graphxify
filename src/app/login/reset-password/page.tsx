"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { GraphxifyLogo } from "@/components/marketing/graphxify-logo";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setForced(params.get("forced") === "1");
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirm") || "");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        if (updateError.message.toLowerCase().includes("same password")) {
          setError("New password must be different from your current password.");
        } else if (updateError.message.toLowerCase().includes("session")) {
          setError("Your reset link has expired. Please request a new one.");
        } else {
          setError(updateError.message || "Could not update password. Please try again.");
        }
        setLoading(false);
        return;
      }

      await fetch("/api/auth/password-reset-complete", {
        method: "POST",
        credentials: "include"
      });
      await supabase.auth.signOut();
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      {/* Background decorative glows */}
      <span className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accentA/5 blur-[100px]" />
      <span className="pointer-events-none absolute -bottom-24 -right-24 h-[22rem] w-[22rem] rounded-full bg-accentB/5 blur-[80px]" />

      {/* Theme toggle */}
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-[26rem]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="group inline-block">
            <GraphxifyLogo
              alt="Graphxify"
              width={246}
              height={68}
              className="h-auto w-[9rem]"
              priority
            />
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/18 bg-card/72 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
            <p className="mt-1.5 text-sm text-fg/50">Enter your new password below.</p>
          </div>
          {forced ? (
            <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-2.5">
              <p className="text-sm text-amber-400">An administrator requires you to reset your password.</p>
            </div>
          ) : null}

          {success ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-fg/80">Password updated successfully!</p>
                  <p className="mt-1 text-xs text-fg/50">Redirecting to login...</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs font-medium uppercase tracking-[0.1em] text-fg/56">
                  New Password
                </Label>
                <PasswordInput
                  id="new-password"
                  name="password"
                  required
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs font-medium uppercase tracking-[0.1em] text-fg/56">
                  Confirm Password
                </Label>
                <PasswordInput
                  id="confirm-password"
                  name="confirm"
                  required
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {error ? (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              ) : null}

              <Button type="submit" className="h-11 w-full rounded-xl text-sm font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-fg/34">
          Protected access ·{" "}
          <Link href="/login" className="text-fg/48 underline decoration-fg/20 underline-offset-2 transition-colors hover:text-fg/68">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
