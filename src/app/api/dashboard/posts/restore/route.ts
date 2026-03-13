import { NextRequest, NextResponse } from "next/server";
import { restorePostVersion } from "@/services/content-service";
import { requireApiPermission } from "@/lib/auth/requireRole";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await requireApiPermission("content.posts.edit_own");
    const formData = await request.formData();
    const postId = String(formData.get("postId") || "");
    const versionId = String(formData.get("versionId") || "");
    if (!postId || !versionId) {
      return NextResponse.json({ message: "Missing blog restore fields" }, { status: 400 });
    }
    await restorePostVersion(postId, versionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Post restore failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to restore blog version" }, { status: 400 });
  }
}
