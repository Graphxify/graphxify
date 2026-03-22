"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export default function AuthCompletePage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const resolvedNext = searchParams.get("next")?.startsWith("/") ? searchParams.get("next")! : "/dashboard";

  const description = useMemo(() => {
    return error || "Completing your secure sign-in…";
  }, [error]);

  useEffect(() => {
    let cancelled = false;

    async function completeAuth() {
      try {
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (!hash) {
          throw new Error("Missing auth token.");
        }

        const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
          throw new Error("Magic link is invalid or expired.");
        }

        const supabase = createClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          throw sessionError;
        }

        if (cancelled) {
          return;
        }

        const cleanTarget = resolvedNext.startsWith("/") ? resolvedNext : "/dashboard";
        window.location.replace(cleanTarget);
      } catch (authError) {
        if (cancelled) {
          return;
        }
        const message = authError instanceof Error ? authError.message : "Unable to complete sign-in.";
        setError(message);
        window.setTimeout(() => {
          window.location.replace("/admin?error=unknown");
        }, 1500);
      }
    }

    void completeAuth();

    return () => {
      cancelled = true;
    };
  }, [resolvedNext]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/16 bg-card/72 p-8 text-center shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accentA/10 text-accentA">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Signing you in</h1>
        <p className="mt-2 text-sm text-fg/56">{description}</p>
      </div>
    </div>
  );
}
