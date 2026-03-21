import { ResetPasswordPage } from "@/components/auth/reset-password-page";

export default async function ResetPasswordRoutePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;

  return (
    <ResetPasswordPage
      forced={resolved.forced === "1"}
      invite={resolved.invite === "1"}
    />
  );
}
