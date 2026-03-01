"use client";

import { createBrowserClient } from "@supabase/ssr";
import { clientEnv } from "@/lib/env-client";

export function createClient() {
  const publicKey = clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createBrowserClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, publicKey);
}
