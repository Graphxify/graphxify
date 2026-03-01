import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/services/lead-service";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
  const limit = await rateLimit({ key: ip, route: "api-leads", limit: 10, windowSec: 60 });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const result = await createLead(body);
    return NextResponse.json({ id: result.id, message: "Lead created" }, { status: 201 });
  } catch (error) {
    logger.error("Lead create failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to process your request." }, { status: 400 });
  }
}
