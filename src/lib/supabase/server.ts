import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

type SupabaseCookieOptions = {
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | boolean;
};

export function createClient() {
  const publicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, publicKey, {
    cookies: {
      async get(name: string) {
        try {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        } catch {
          return undefined;
        }
      },
      async set(name: string, value: string, options: SupabaseCookieOptions) {
        try {
          const cookieStore = await cookies();
          cookieStore.set({ name, value, ...options });
        } catch {
          // Called from a Server Component where response cookies are immutable.
        }
      },
      async remove(name: string, options: SupabaseCookieOptions) {
        try {
          const cookieStore = await cookies();
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Called from a Server Component where response cookies are immutable.
        }
      }
    }
  });
}
