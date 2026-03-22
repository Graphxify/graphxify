import { AuthCompleteClient } from "@/app/auth/complete/page-client";

export default async function AuthCompletePage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const nextParam = typeof resolved?.next === "string" ? resolved.next : undefined;
  const nextPath = nextParam?.startsWith("/") ? nextParam : "/dashboard";

  return <AuthCompleteClient nextPath={nextPath} />;
}
