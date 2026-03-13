"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { forgotPasswordAction } from "@/app/login/forgot-password/actions";
import { GraphxifyLogo } from "@/components/marketing/graphxify-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await forgotPasswordAction(formData);
      setResult(response);
    } catch {
      setResult({ success: false, message: "Something went wrong. Please try again." });
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
            <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
            <p className="mt-1.5 text-sm text-fg/50">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {result?.success ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <p className="text-sm text-fg/80">{result.message}</p>
              </div>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-fg/56 transition-colors hover:text-fg/80"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-xs font-medium uppercase tracking-[0.1em] text-fg/56">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 rounded-xl border-border/18 bg-bg/50 px-4 text-sm text-fg transition-colors duration-200 placeholder:text-fg/30 focus:border-accentA/40 focus:ring-accentA/20"
                  disabled={loading}
                />
              </div>

              {result && !result.success ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2.5">
                  <p className="text-sm text-red-400">{result.message}</p>
                </div>
              ) : null}

              <Button type="submit" className="h-11 w-full rounded-xl text-sm font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-fg/56 transition-colors hover:text-fg/80"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-fg/34">
          Protected access ·{" "}
          <Link href="/" className="text-fg/48 underline decoration-fg/20 underline-offset-2 transition-colors hover:text-fg/68">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
