import { NextResponse } from "next/server";
import { verifySmtp, sendEmail } from "@/lib/email/provider";
import { testEmailTemplate } from "@/lib/email/templates";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET() {
  // Require authenticated admin
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 });
  }

  // Step 1: Verify SMTP connection
  const verification = await verifySmtp();
  if (!verification.ok) {
    logger.error("SMTP test failed at verification", { message: verification.message });
    return NextResponse.json({
      success: false,
      step: "verification",
      message: verification.message
    }, { status: 500 });
  }

  // Step 2: Send test email
  const recipient = env.OWNER_NOTIFY_EMAIL || "info@graphxify.com";
  const template = testEmailTemplate();
  const result = await sendEmail({ to: recipient, ...template });

  if (!result.ok) {
    logger.error("SMTP test failed at send", { error: result.error });
    return NextResponse.json({
      success: false,
      step: "send",
      message: result.error || "Failed to send test email"
    }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Test email sent successfully to ${recipient}`,
    smtp: {
      verified: true,
      recipient
    }
  });
}
