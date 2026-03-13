import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateTestimonial, deleteTestimonial } from "@/services/testimonial-service";
import { requireApiPermission } from "@/lib/auth/requireRole";
import { errorMessage } from "@/lib/api-error";
import { formError, formSuccess } from "@/lib/forms/shared";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await requireApiPermission("content.testimonials.create");
    const formData = await request.formData();
    const result = await createOrUpdateTestimonial({ formData });
    return NextResponse.json(formSuccess("Testimonial saved.", { id: result.id }), { status: 201 });
  } catch (error) {
    const message = errorMessage(error, "Unable to create testimonial");
    logger.error("Testimonial create failed", { error: message });
    return NextResponse.json(formError(message), { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireApiPermission("content.testimonials.edit");
    const formData = await request.formData();
    const id = String(formData.get("id") || "");
    if (!id) {
      return NextResponse.json(formError("Missing testimonial id"), { status: 400 });
    }
    const result = await createOrUpdateTestimonial({ id, formData });
    return NextResponse.json(formSuccess("Testimonial saved.", { id: result.id }), { status: 200 });
  } catch (error) {
    const message = errorMessage(error, "Unable to update testimonial");
    logger.error("Testimonial update failed", { error: message });
    return NextResponse.json(formError(message), { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiPermission("content.testimonials.delete");
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(formError("Missing testimonial id"), { status: 400 });
    }

    await deleteTestimonial(id);
    return NextResponse.json(formSuccess("Testimonial deleted."));
  } catch (error) {
    const message = errorMessage(error, "Unable to delete testimonial");
    logger.error("Testimonial delete failed", { error: message });
    return NextResponse.json(formError(message), { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireApiPermission("content.testimonials.moderate");
    const body = (await request.json()) as { id?: string; status?: string };
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(formError("Missing id or status"), { status: 400 });
    }

    const validStatuses = ["draft", "pending", "published", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(formError("Invalid status"), { status: 400 });
    }

    const { updateTestimonialStatus } = await import("@/services/testimonial-service");
    await updateTestimonialStatus(id, status as "draft" | "pending" | "published" | "rejected");
    return NextResponse.json(formSuccess("Testimonial status updated.", { id }));
  } catch (error) {
    const message = errorMessage(error, "Unable to update testimonial status");
    logger.error("Testimonial status update failed", { error: message });
    return NextResponse.json(formError(message), { status: 400 });
  }
}
