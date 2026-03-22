import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PasswordPolicy } from "@/lib/auth/password-policy";

export async function getCmsPasswordPolicy(): Promise<PasswordPolicy> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("cms_settings")
      .select("value")
      .eq("key", "security")
      .maybeSingle();

    const settings = (data?.value as Record<string, unknown> | null) ?? null;
    return {
      requireStrongPasswords: settings?.require_strong_passwords !== false
    };
  } catch {
    return {
      requireStrongPasswords: true
    };
  }
}
