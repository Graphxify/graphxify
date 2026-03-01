import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePost, deletePost } from "@/services/content-service";
import { requireApiRole } from "@/lib/auth/requireRole";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const formData = await request.formData();
    const result = await createOrUpdatePost({ formData });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    logger.error("Post create failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to create post" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const formData = await request.formData();
    const id = String(formData.get("id") || "");
    if (!id) {
      return NextResponse.json({ message: "Missing post id" }, { status: 400 });
    }
    const result = await createOrUpdatePost({ id, formData });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    logger.error("Post update failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to update post" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiRole(["admin"]);
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing post id" }, { status: 400 });
    }
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Post delete failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to delete post" }, { status: 400 });
  }
}
