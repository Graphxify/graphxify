import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { loginAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Graphxify CMS login",
  path: "/login"
});

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const errorMessages: Record<string, string> = {
    invalid_credentials: "Invalid email or password.",
    account_not_found: "No account exists for this email in Supabase Auth.",
    email_not_confirmed: "Email is not confirmed. Confirm your inbox first, then try again.",
    password_auth_disabled: "Email/password login is disabled in Supabase Auth providers.",
    rate_limited: "Too many attempts. Please wait and try again.",
    auth_unavailable: "Authentication service is temporarily unavailable.",
    unknown: "Unable to sign in. Please try again."
  };

  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return <LoginView errorMessages={errorMessages} searchParams={resolvedSearchParams} />;
}

function LoginView({
  errorMessages,
  searchParams
}: {
  errorMessages: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const errorCode = typeof searchParams?.error === "string" ? searchParams.error : "";
  const errorText = errorMessages[errorCode] ?? "";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      {/* Background decorative glows */}
      <span className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accentA/5 blur-[100px]" />
      <span className="pointer-events-none absolute -bottom-24 -right-24 h-[22rem] w-[22rem] rounded-full bg-accentB/5 blur-[80px]" />
      <span className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-accentA/3 blur-[60px]" />

      {/* Theme toggle — top right */}
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-[26rem]">
        {/* Logo + branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="group inline-block">
            <Image
              src="/assets/Graphxify-Logo-Black.webp"
              alt="Graphxify"
              width={246}
              height={68}
              className="h-auto w-[9rem] dark:hidden"
              priority
            />
            <Image
              src="/assets/Graphxify-Logo-white.webp"
              alt="Graphxify"
              width={246}
              height={68}
              className="hidden h-auto w-[9rem] dark:block"
              priority
            />
          </Link>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border/18 bg-card/72 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-fg/50">Sign in to the CMS dashboard</p>
          </div>

          <form action={loginAction} className="space-y-5" aria-label="Login form">
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
              />
            </div>
            <Button type="submit" className="h-11 w-full rounded-xl text-sm font-medium">
              Sign In
            </Button>
          </form>

          {errorText ? (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2.5">
              <p className="text-sm text-red-400">{errorText}</p>
            </div>
          ) : null}
          {process.env.NODE_ENV !== "production" && errorCode ? (
            <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.1em] text-fg/36">Code: {errorCode}</p>
          ) : null}
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-fg/34">
          Protected access · <Link href="/" className="text-fg/48 underline decoration-fg/20 underline-offset-2 transition-colors hover:text-fg/68">Back to site</Link>
        </p>
      </div>
    </div>
  );
}
