import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { countRecentLeads, createLead, type LeadNotificationResult } from "@/services/lead-service";
import { formError, formSuccess, fieldErrorsFromZod } from "@/lib/forms/shared";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { publicLeadSchema } from "@/lib/validation/schemas";
import { guardSubmission, looksLikeSpam } from "@/lib/forms/bot-guard";

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

    const body = (await request.json()) as Record<string, unknown>;
    const verdict = guardSubmission(request, body);
    if (!verdict.ok) {
      logger.warn("Lead blocked", { route: "api/leads", reason: verdict.reason });
      return verdict.silent
        ? NextResponse.json(formSuccess("Thanks for reaching out. Your inquiry has been received."), { status: 201 })
        : NextResponse.json(formError(verdict.message), { status: verdict.status });
    }
    const parsed = publicLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        formError("Please review the highlighted fields and try again.", fieldErrorsFromZod(parsed.error)),
        { status: 400 }
      );
    }

    if (parsed.data.source === "contact" && !parsed.data.consent) {
      return NextResponse.json(formError("Please agree to be contacted.", { consent: "Consent is required before sending." }), { status: 400 });
    }
    if (looksLikeSpam(parsed.data.message) || looksLikeSpam(parsed.data.customRequest)) {
      return NextResponse.json(formError("Please remove the links from your message and try again.", { message: "Too many links." }), { status: 400 });
    }
    if ((await countRecentLeads(parsed.data.email)) >= 3) {
      return NextResponse.json(formError("We've already received several messages from this email. We'll be in touch soon."), { status: 429 });
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
