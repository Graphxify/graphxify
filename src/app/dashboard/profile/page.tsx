import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/requireRole";
import { ProfilePageContent } from "@/app/dashboard/profile/profile-page-content";

export const metadata: Metadata = {
  title: "Profile — Graphxify CMS"
};

export default async function DashboardProfilePage() {
  const profile = await requireAuth();
  const supabase = createClient();

  // Fetch extended profile data (may have extra columns)
  let extendedProfile: Record<string, unknown> = {};
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.id)
      .maybeSingle();
    if (data) {
      extendedProfile = data as Record<string, unknown>;
    }
  } catch {
    // Fallback to basic profile
  }

  // Fetch auth user metadata (created_at, last_sign_in_at)
  let createdAt: string | null = null;
  let lastSignIn: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    createdAt = user?.created_at ?? null;
    lastSignIn = user?.last_sign_in_at ?? null;
  } catch {
    // Non-critical
  }

  return (
    <ProfilePageContent
      profile={{
        id: profile.id,
        email: profile.email,
        role: profile.role,
        displayName: (extendedProfile.display_name as string) ?? null,
        bio: (extendedProfile.bio as string) ?? null,
        avatarUrl: (extendedProfile.avatar_url as string) ?? null,
        phone: (extendedProfile.phone as string) ?? null,
        createdAt,
        lastSignIn
      }}
    />
  );
}
