import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { publicReviewSchema } from "@/lib/validation/schemas";
import { sendEmail } from "@/lib/email/provider";
import { isNotificationEnabled } from "@/lib/email/notification-settings";
import { reviewSubmissionTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = publicReviewSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid submission.";
      return NextResponse.json({ message: firstError }, { status: 400 });
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
      logger.error("Review submission failed", { error: error.message });
      return NextResponse.json(
        { message: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // Notify owner about new review submission
    if (env.OWNER_NOTIFY_EMAIL && await isNotificationEnabled("notify_review_submissions")) {
      const template = reviewSubmissionTemplate({
        name,
        role: roleDisplay,
        quote,
        rating: rating ?? 5
      });
      void sendEmail({ to: env.OWNER_NOTIFY_EMAIL, ...template });
    }

    return NextResponse.json(
      { message: "Thank you! Your review has been submitted and is pending approval." },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Review submission error", { error: String(error) });
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
