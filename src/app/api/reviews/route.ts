import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { formError, formSuccess, fieldErrorsFromZod } from "@/lib/forms/shared";
import { publicReviewSchema } from "@/lib/validation/schemas";
import { sendEmail } from "@/lib/email/provider";
import { isNotificationEnabled } from "@/lib/email/notification-settings";
import { reviewSubmissionTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

  try {
    const limit = await rateLimit({ key: ip, route: "api-reviews", limit: 5, windowSec: 60 });
    if (!limit.allowed) {
      return NextResponse.json(
        formError("Too many requests. Please try again shortly."),
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json();
    const parsed = publicReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        formError("Please review the highlighted fields and try again.", fieldErrorsFromZod(parsed.error)),
        { status: 400 }
      );
    }

    const { name, role, quote, company, rating } = parsed.data;
    const supabase = createAdminClient() ?? createClient();

    const roleDisplay = company ? `${role}, ${company}` : role;

    const { error } = await supabase.from("testimonials").insert({
      name,
      role: roleDisplay,
      quote,
      rating: rating ?? 5,
      status: "pending",
      sort_order: 0,
      author_id: null
    });

    if (error) {
      logger.error("Review submission failed", {
        route: "api/reviews",
        error: error.message,
        code: error.code ?? null
      });
      return NextResponse.json(
        formError("We couldn't submit your review right now. Please try again in a moment."),
        { status: 500 }
      );
    }

    // Fire-and-forget: notify owner — does not block the response
    void (async () => {
      try {
        if (env.OWNER_NOTIFY_EMAIL && await isNotificationEnabled("notify_review_submissions")) {
          const template = reviewSubmissionTemplate({ name, role: roleDisplay, quote, rating: rating ?? 5 });
          void sendEmail({ to: env.OWNER_NOTIFY_EMAIL, ...template });
        }
      } catch (err) {
        logger.error("Email notification failed for review", { error: err instanceof Error ? err.message : "unknown" });
      }
    })();

    return NextResponse.json(
      formSuccess("Thank you. Your review has been submitted and is pending approval."),
      { status: 201 }
    );
  } catch (error) {
    logger.error("Review submission error", {
      route: "api/reviews",
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      formError("We couldn't submit your review right now. Please try again in a moment."),
      { status: 500 }
    );
  }
}
