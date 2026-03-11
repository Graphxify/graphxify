import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { publicReviewSchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = publicReviewSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid submission.";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { name, role, quote, company } = parsed.data;
    const supabase = createAdminClient() ?? createClient();

    const roleDisplay = company ? `${role}, ${company}` : role;

    const { error } = await supabase.from("testimonials").insert({
      name,
      role: roleDisplay,
      quote,
      status: "draft",
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
