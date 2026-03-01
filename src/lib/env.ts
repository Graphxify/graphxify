import "server-only";

const warned = new Set<string>();

function warnMissing(name: string): void {
  if (!warned.has(name)) {
    warned.add(name);
    console.warn(`[env] Missing ${name}. Running in degraded mode.`);
  }
}

export function readEnv(name: string, fallback = ""): string {
  const value = process.env[name];
  if (!value) {
    warnMissing(name);
    return fallback;
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) {
    warnMissing(name);
    return undefined;
  }
  return value;
}

export const env = {
  NEXT_PUBLIC_SITE_URL: readEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: readEnv("NEXT_PUBLIC_SUPABASE_URL", "https://cajxvhcrfgpyyqohlkfp.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""),
  SUPABASE_SERVICE_ROLE_KEY: optionalEnv("SUPABASE_SERVICE_ROLE_KEY"),
  OWNER_NOTIFY_EMAIL: optionalEnv("OWNER_NOTIFY_EMAIL"),
  RESEND_API_KEY: optionalEnv("RESEND_API_KEY"),
  SMTP_HOST: optionalEnv("SMTP_HOST"),
  SMTP_PORT: optionalEnv("SMTP_PORT"),
  SMTP_USER: optionalEnv("SMTP_USER"),
  SMTP_PASS: optionalEnv("SMTP_PASS"),
  UPSTASH_REDIS_REST_URL: optionalEnv("UPSTASH_REDIS_REST_URL"),
  UPSTASH_REDIS_REST_TOKEN: optionalEnv("UPSTASH_REDIS_REST_TOKEN")
} as const;
