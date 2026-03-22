import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { unsubscribeFromNewsletter } from "@/services/newsletter-service";

export const runtime = "nodejs";

function buildRedirectUrl(request: NextRequest, status: string): URL {
  const url = new URL("/newsletter/unsubscribe", request.url);
  url.searchParams.set("status", status);
  return url;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "").trim();

  if (!token) {
    return NextResponse.redirect(buildRedirectUrl(request, "invalid"));
  }

  try {
    const result = await unsubscribeFromNewsletter(token);
    const status =
      result.status === "unsubscribed"
        ? "success"
        : result.status === "already_unsubscribed"
          ? "already"
          : "invalid";

    return NextResponse.redirect(buildRedirectUrl(request, status));
  } catch (error) {
    logger.error("Newsletter unsubscribe failed", {
      route: "api/newsletter/unsubscribe",
      error: error instanceof Error ? error.message : "unknown"
    });
    return NextResponse.redirect(buildRedirectUrl(request, "error"));
  }
}
