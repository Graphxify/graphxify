import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Cookie-free Supabase client for public read-only queries in Server Components.
 *
 * Unlike createClient() from server.ts (which uses @supabase/ssr with cookie
 * handlers), this client never calls cookies() from next/headers. That means
 * pages using this for data fetching stay eligible for ISR / Full Route Cache.
 *
 * Use this for any public query that does NOT need auth context:
 * published works, testimonials, blog posts, marquee items, etc.
 *
 * Dashboard queries that need the user's session must still use createClient().
 */
export function createPublicClient() {
  const publicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, publicKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
