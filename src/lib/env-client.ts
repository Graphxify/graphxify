"use client";

const warned = new Set<string>();

function warnMissing(name: string): void {
  if (!warned.has(name)) {
    warned.add(name);
    console.warn(`[env] Missing ${name}. Running in degraded mode.`);
  }
}

function readClientEnv(name: string, fallback = ""): string {
  const value = process.env[name];
  if (!value) {
    warnMissing(name);
    return fallback;
  }
  return value;
}

export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: readClientEnv("NEXT_PUBLIC_SUPABASE_URL", "https://cajxvhcrfgpyyqohlkfp.supabase.co"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: readClientEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", ""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: readClientEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
} as const;
