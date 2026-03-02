import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth/requireRole";
import { logger } from "@/lib/logger";
import { saveTestimonialMetrics } from "@/services/testimonial-metric-service";

function mapError(error: unknown): string {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues?: Array<{ path?: Array<string | number>; message?: string }> }).issues;
    if (Array.isArray(issues) && issues.length > 0) {
      return issues
        .map((issue) => {
          const key = issue.path?.join(".") || "field";
          return `${key}: ${issue.message || "Invalid value"}`;
        })
        .join("; ");
    }
  }

  if (error && typeof error === "object") {
    const raw = error as { message?: unknown; details?: unknown; hint?: unknown };
    const message = typeof raw.message === "string" ? raw.message.trim() : "";
    const details = typeof raw.details === "string" ? raw.details.trim() : "";
    const hint = typeof raw.hint === "string" ? raw.hint.trim() : "";
    if (message) return message;
    if (details || hint) return [details, hint].filter(Boolean).join(" ");
  }

  return error instanceof Error && error.message ? error.message : "Unable to save testimonial metrics";
}

export async function PUT(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const body = (await request.json()) as unknown;
    const result = await saveTestimonialMetrics(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = mapError(error);
    logger.error("Testimonial metrics save failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}

