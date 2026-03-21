import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function createPublicServerClient() {
  const publicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, publicKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
