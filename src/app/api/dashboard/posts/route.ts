import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePost, deletePost } from "@/services/content-service";
import { requireApiPermission } from "@/lib/auth/requireRole";
import { errorMessage } from "@/lib/api-error";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await requireApiPermission("content.posts.create");
    const formData = await request.formData();
    const result = await createOrUpdatePost({ formData });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = errorMessage(error, "Unable to create blog");
    logger.error("Post create failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireApiPermission("content.posts.edit_own");
    const formData = await request.formData();
    const id = String(formData.get("id") || "");
    if (!id) {
      return NextResponse.json({ message: "Missing blog id" }, { status: 400 });
    }
    const result = await createOrUpdatePost({ id, formData });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = errorMessage(error, "Unable to update blog");
    logger.error("Post update failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiPermission("content.posts.delete");
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing blog id" }, { status: 400 });
    }
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = errorMessage(error, "Unable to delete blog");
    logger.error("Post delete failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}
