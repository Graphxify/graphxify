import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain"
];

/**
 * Public upload endpoint for contact form attachments.
 * Rate-limited and restricted to safe file types.
 * Files are stored in a separate "attachments" bucket.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const limit = await rateLimit({ key: ip, route: "api-uploads-public", limit: 10, windowSec: 60 });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many uploads. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "File type not allowed. Accepted: images, PDF, Word, PowerPoint, plain text." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "Max upload size is 8MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "bin";
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80);
    const filePath = `contact/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
    const bytes = await file.arrayBuffer();

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ message: "Storage unavailable" }, { status: 500 });
    }

    const { data, error } = await admin.storage.from("media").upload(filePath, Buffer.from(bytes), {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

    if (error) {
      throw new Error(error.message || "Storage upload failed");
    }

    const { data: publicUrlData } = admin.storage.from("media").getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrlData.publicUrl, name: file.name, type: file.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    logger.error("Public upload failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}
