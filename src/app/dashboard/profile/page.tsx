import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/requireRole";
import { ProfilePageContent } from "@/app/dashboard/profile/profile-page-content";

export const metadata: Metadata = {
  title: "Profile — Graphxify CMS"
};

export default async function DashboardProfilePage() {
  const supabase = createClient();

  // x-cms-uid is forwarded by middleware — lets us start the DB query
  // before requireAuth() resolves, so all three run in parallel.
  const uid = (await headers()).get("x-cms-uid");

  const [profile, extendedResult, authUserResult] = await Promise.all([
    requireAuth(),
    uid
      ? Promise.resolve(
          supabase.from("profiles").select("*").eq("id", uid).maybeSingle()
        ).catch(() => ({ data: null }))
      : Promise.resolve({ data: null }),
    supabase.auth.getUser().catch(() => ({ data: { user: null } }))
  ]);

  const extendedProfile: Record<string, unknown> =
    (extendedResult.data as Record<string, unknown> | null) ?? {};

  const createdAt = authUserResult.data.user?.created_at ?? null;
  const lastSignIn = authUserResult.data.user?.last_sign_in_at ?? null;

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
