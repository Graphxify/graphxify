import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth/requireRole";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await requireApiRole(["admin", "mod"]);

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ message: "Max upload size is 8MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "bin";
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();

    const admin = createAdminClient();
    const client = admin ?? createClient();

    const { data, error } = await client.storage.from("media").upload(filePath, Buffer.from(bytes), {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

    if (error) {
      throw new Error(error.message || "Storage upload failed");
    }

    const { data: publicUrlData } = client.storage.from("media").getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    logger.error("Upload failed", { error: message });
    return NextResponse.json({ message }, { status: 400 });
  }
}
