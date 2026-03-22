import { ResetPasswordPage } from "@/components/auth/reset-password-page";
import { getCmsPasswordPolicy } from "@/lib/auth/password-policy.server";

export default async function LoginResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const passwordPolicy = await getCmsPasswordPolicy();

  return (
    <ResetPasswordPage
      forced={resolved.forced === "1"}
      invite={resolved.invite === "1"}
      requireStrongPasswords={passwordPolicy.requireStrongPasswords}
    />
  );
}
