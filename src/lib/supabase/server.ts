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
  const cookieStore = cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: SupabaseCookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Called from a Server Component where response cookies are immutable.
        }
      },
      remove(name: string, options: SupabaseCookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Called from a Server Component where response cookies are immutable.
        }
      }
    }
  });
}
