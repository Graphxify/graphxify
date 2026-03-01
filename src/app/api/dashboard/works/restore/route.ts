import { NextRequest, NextResponse } from "next/server";
import { restoreWorkVersion } from "@/services/content-service";
import { requireApiRole } from "@/lib/auth/requireRole";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);
    const formData = await request.formData();
    const workId = String(formData.get("workId") || "");
    const versionId = String(formData.get("versionId") || "");
    if (!workId || !versionId) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }
    await restoreWorkVersion(workId, versionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Work restore failed", { error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ message: "Unable to restore work version" }, { status: 400 });
  }
}
