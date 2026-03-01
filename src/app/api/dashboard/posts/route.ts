import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePost, deletePost } from "@/services/content-service";
import { requireApiRole } from "@/lib/auth/requireRole";
import { logger } from "@/lib/logger";

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
  return error instanceof Error && error.message ? error.message : fallback;
}

export async function POST(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const formData = await request.formData();
    const result = await createOrUpdatePost({ formData });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = errorMessage(error, "Unable to create post");
    logger.error("Post create failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
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
    const message = errorMessage(error, "Unable to update post");
    logger.error("Post update failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing post id" }, { status: 400 });
    }
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = errorMessage(error, "Unable to delete post");
    logger.error("Post delete failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}
