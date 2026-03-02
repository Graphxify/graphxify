import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateTestimonial, deleteTestimonial } from "@/services/testimonial-service";
import { requireApiRole } from "@/lib/auth/requireRole";
import { logger } from "@/lib/logger";

function isMissingTestimonialsSchema(code?: string, message?: string): boolean {
  const normalizedMessage = (message || "").toLowerCase();
  return (
    ["42P01", "42703", "PGRST116", "PGRST204", "PGRST205"].includes(code || "") ||
    normalizedMessage.includes("could not find the table 'public.testimonials'") ||
    normalizedMessage.includes("schema cache")
  );
}

function errorMessage(error: unknown, fallback: string): string {
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
    const raw = error as {
      code?: string;
      message?: unknown;
      details?: unknown;
      hint?: unknown;
    };

    const rawMessage = typeof raw.message === "string" ? raw.message : "";
    if (isMissingTestimonialsSchema(raw.code, rawMessage)) {
      return "Testimonials table is missing in Supabase schema cache. Run supabase/testimonials.sql, then run: notify pgrst, 'reload schema';";
    }

    if (typeof raw.message === "string" && raw.message.trim()) {
      return raw.message;
    }

    if (typeof raw.code === "string") {
      if (raw.code === "42501") {
        return "Testimonials permissions are missing. Re-run supabase/rls.sql after supabase/testimonials.sql.";
      }
    }

    const details = typeof raw.details === "string" ? raw.details.trim() : "";
    const hint = typeof raw.hint === "string" ? raw.hint.trim() : "";
    if (details || hint) {
      return [details, hint].filter(Boolean).join(" ");
    }
  }

  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: string }).code;
    if (code === "42501") {
      return "Testimonials permissions are missing. Re-run supabase/rls.sql after supabase/testimonials.sql.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export async function POST(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const formData = await request.formData();
    const result = await createOrUpdateTestimonial({ formData });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = errorMessage(error, "Unable to create testimonial");
    logger.error("Testimonial create failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const formData = await request.formData();
    const id = String(formData.get("id") || "");
    if (!id) {
      return NextResponse.json({ message: "Missing testimonial id" }, { status: 400 });
    }
    const result = await createOrUpdateTestimonial({ id, formData });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = errorMessage(error, "Unable to update testimonial");
    logger.error("Testimonial update failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing testimonial id" }, { status: 400 });
    }

    await deleteTestimonial(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = errorMessage(error, "Unable to delete testimonial");
    logger.error("Testimonial delete failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}
