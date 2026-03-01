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

export default function LoginPage() {
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
        </CardContent>
      </Card>
    </div>
  );
}
