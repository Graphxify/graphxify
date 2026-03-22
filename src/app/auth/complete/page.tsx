import { AuthCompleteClient } from "@/app/auth/complete/page-client";

export default async function AuthCompletePage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const nextParam = typeof resolved?.next === "string" ? resolved.next : undefined;
  const nextPath = nextParam?.startsWith("/") ? nextParam : "/dashboard";
  const tokenHash = typeof resolved?.token_hash === "string" ? resolved.token_hash : "";
  const rawType = typeof resolved?.type === "string" ? resolved.type : "";
  const verificationType: "magiclink" | "invite" | "recovery" =
    rawType === "invite" || rawType === "recovery" || rawType === "magiclink" ? rawType : "magiclink";

  return (
    <AuthCompleteClient
      nextPath={nextPath}
      tokenHash={tokenHash}
      verificationType={verificationType}
    />
  );
}
