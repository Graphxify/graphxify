import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createOrUpdateWork, deleteWork } from "@/services/content-service";
import { requireApiPermission } from "@/lib/auth/requireRole";
import { errorMessage } from "@/lib/api-error";
import { fieldErrorsFromZod, formError, formSuccess } from "@/lib/forms/shared";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await requireApiPermission("content.works.create");
    const formData = await request.formData();
    const result = await createOrUpdateWork({ formData });
    return NextResponse.json(formSuccess("Work saved.", { id: result.id }), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        formError("Please review the highlighted fields and try again.", fieldErrorsFromZod(error)),
        { status: 400 }
      );
    }
    const message = errorMessage(error, "Unable to create work");
    logger.error("Work create failed", { error: message });
    return NextResponse.json(formError(message), { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireApiPermission("content.works.edit_any");
    const formData = await request.formData();
    const id = String(formData.get("id") || "");
    if (!id) {
      return NextResponse.json(formError("Missing work id"), { status: 400 });
    }
    const result = await createOrUpdateWork({ id, formData });
    return NextResponse.json(formSuccess("Work saved.", { id: result.id }), { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        formError("Please review the highlighted fields and try again.", fieldErrorsFromZod(error)),
        { status: 400 }
      );
    }
    const message = errorMessage(error, "Unable to update work");
    logger.error("Work update failed", { error: message });
    return NextResponse.json(formError(message), { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiPermission("content.works.delete");
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(formError("Missing work id"), { status: 400 });
    }
    await deleteWork(id);
    return NextResponse.json(formSuccess("Work deleted."));
  } catch (error) {
    const message = errorMessage(error, "Unable to delete work");
    logger.error("Work delete failed", { error: message });
    return NextResponse.json(formError(message), { status: 400 });
  }
}
