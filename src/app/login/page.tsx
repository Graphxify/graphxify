import type { Metadata } from "next";
import { loginAction } from "@/app/login/actions";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Graphxify CMS login",
  path: "/login"
});

export default function LoginPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const errorMessages: Record<string, string> = {
    invalid_credentials: "Invalid email or password.",
    email_not_confirmed: "Email is not confirmed. Confirm your inbox first, then try again.",
    rate_limited: "Too many attempts. Please wait and try again.",
    auth_unavailable: "Authentication service is temporarily unavailable.",
    unknown: "Unable to sign in. Please try again."
  };

  return (
    <LoginView errorMessages={errorMessages} searchParams={searchParams} />
  );
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
    <div className="container grid min-h-[84vh] items-center gap-10 py-16 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-fg/58">Graphxify Platform</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Access the CMS control center.</h1>
        <p className="max-w-xl text-fg/68">
          Use your provisioned credentials. New accounts are created in Supabase Auth, and profile roles are managed in the dashboard users page.
        </p>
      </div>

      <Card className="w-full border-border/18 bg-card/78">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-fg/58">CMS Login</p>
            <ThemeToggle />
          </div>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4" aria-label="Login form">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
          {errorText ? <p className="mt-4 text-sm text-fg/74">{errorText}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
