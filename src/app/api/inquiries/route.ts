import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/services/inquiry-service";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

function validationMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues?: Array<{ path?: Array<string | number>; message?: string }> }).issues;
    if (Array.isArray(issues) && issues.length > 0) {
      return issues
        .map((issue) => {
          const field = issue.path?.join(".") || "field";
          return `${field}: ${issue.message || "Invalid value"}`;
        })
        .join("; ");
    }
  }
  return error instanceof Error ? error.message : fallback;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

  const limited = await rateLimit({ key: ip, route: "api-inquiries", limit: 10, windowSec: 60 });
  if (!limited.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  try {
    const payload = await request.json();
    const result = await createInquiry(payload);

    if (result.mode === "mailto") {
      return NextResponse.json(
        {
          mode: "mailto",
          mailtoUrl: result.mailtoUrl,
          message: "Using email fallback. Your default mail app will open."
        },
        { status: 202 }
      );
    }

    return NextResponse.json(
      {
        mode: "stored",
        id: result.id,
        message:
          "Received — thanks. We'll reply within one business day. If it's a fit, you'll get a short call invite and a delivery plan."
      },
      { status: 201 }
    );
  } catch (error) {
    const message = validationMessage(error, "Unable to process your inquiry.");
    logger.error("Inquiry submission failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}
