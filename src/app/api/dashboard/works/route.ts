import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateWork, deleteWork } from "@/services/content-service";
import { requireApiRole } from "@/lib/auth/requireRole";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const formData = await request.formData();
    const result = await createOrUpdateWork({ formData });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    logger.error("Work create failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to create work" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const formData = await request.formData();
    const id = String(formData.get("id") || "");
    if (!id) {
      return NextResponse.json({ message: "Missing work id" }, { status: 400 });
    }
    const result = await createOrUpdateWork({ id, formData });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("Work update failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to update work" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiRole(["admin"]);
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing work id" }, { status: 400 });
    }
    await deleteWork(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Work delete failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to delete work" }, { status: 400 });
  }
}
