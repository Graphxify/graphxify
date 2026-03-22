import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createLead, type LeadNotificationResult } from "@/services/lead-service";
import { formError, formSuccess, fieldErrorsFromZod } from "@/lib/forms/shared";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { publicLeadSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";

function getLeadResponseMessage(notification: LeadNotificationResult): string {
  if (notification.status === "failed" || notification.status === "skipped") {
    return "Your inquiry was saved, but our team notification email could not be delivered right now. Please contact us directly if your request is urgent.";
  }

  return "Thanks for reaching out. Your inquiry has been received.";
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

  try {
    const limit = await rateLimit({ key: ip, route: "api-leads", limit: 10, windowSec: 60 });
    if (!limit.allowed) {
      return NextResponse.json(
        formError("Too many requests. Please try again shortly."),
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();
    const parsed = publicLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        formError("Please review the highlighted fields and try again.", fieldErrorsFromZod(parsed.error)),
        { status: 400 }
      );
    }

    const result = await createLead(parsed.data);
    revalidatePath("/dashboard/leads");
    return NextResponse.json(
      formSuccess(getLeadResponseMessage(result.notification), {
        id: result.id,
        notification: result.notification
      }),
      {
        status:
          result.notification.status === "failed" || result.notification.status === "skipped"
            ? 202
            : 201
      }
    );
  } catch (error) {
    logger.error("Lead create failed", {
      route: "api/leads",
      error: error instanceof Error ? error.message : "unknown"
    });
    return NextResponse.json(
      formError("We couldn't send your inquiry right now. Please try again in a moment."),
      { status: 500 }
    );
  }
}
