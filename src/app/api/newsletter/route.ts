import { NextRequest, NextResponse } from "next/server";
import { formError, formSuccess, fieldErrorsFromZod } from "@/lib/forms/shared";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { subscribeToNewsletter } from "@/services/newsletter-service";
import { newsletterSubscriptionSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

  try {
    const limit = await rateLimit({ key: ip, route: "api-newsletter", limit: 6, windowSec: 60 });
    if (!limit.allowed) {
      return NextResponse.json(
        formError("Too many subscription attempts. Please try again shortly."),
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();
    const parsed = newsletterSubscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        formError("Please review the highlighted fields and try again.", fieldErrorsFromZod(parsed.error)),
        { status: 400 }
      );
    }

    const result = await subscribeToNewsletter({ email: parsed.data.email, source: "blog" });
    const message =
      result.state === "already_subscribed"
        ? "You're already subscribed. We'll keep you on the list."
        : result.welcomeEmail?.status === "sent"
          ? "You're subscribed. Check your inbox for the checklist and future updates."
          : "You're subscribed, but the checklist email could not be delivered right now. Please contact us directly if you need it urgently.";

    return NextResponse.json(
      formSuccess(message),
      { status: result.state === "already_subscribed" ? 200 : 201 }
    );
  } catch (error) {
    logger.error("Newsletter subscription failed", {
      route: "api/newsletter",
      error: error instanceof Error ? error.message : "unknown"
    });
    return NextResponse.json(
      formError("We couldn't complete your subscription right now. Please try again in a moment."),
      { status: 500 }
    );
  }
}
