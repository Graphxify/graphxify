"use client";

const warned = new Set<string>();

function warnMissing(name: string): void {
  if (!warned.has(name)) {
    warned.add(name);
    console.warn(`[env] Missing ${name}. Running in degraded mode.`);
  }
}

function readClientEnv(value: string | undefined, name: string, fallback = ""): string {
  if (!value) {
    warnMissing(name);
    return fallback;
  }
  return value;
}

export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: readClientEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL",
    "https://cajxvhcrfgpyyqohlkfp.supabase.co"
  ),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: readClientEnv(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ""
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: readClientEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ""
  )
} as const;
