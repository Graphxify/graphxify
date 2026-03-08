import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateTestimonial, deleteTestimonial } from "@/services/testimonial-service";
import { requireApiRole } from "@/lib/auth/requireRole";
import { errorMessage } from "@/lib/api-error";
import { logger } from "@/lib/logger";

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
