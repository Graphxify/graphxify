import { NextRequest, NextResponse } from "next/server";
import { formError, formSuccess, fieldErrorsFromZod } from "@/lib/forms/shared";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { subscribeToNewsletter } from "@/services/newsletter-service";
import { newsletterSubscriptionSchema } from "@/lib/validation/schemas";

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
    return NextResponse.json(
      formSuccess(
        result.alreadySubscribed
          ? "You're already subscribed. We'll keep you on the list."
          : "You're subscribed. We'll send occasional insights when there's something worth reading."
      ),
      { status: 201 }
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
