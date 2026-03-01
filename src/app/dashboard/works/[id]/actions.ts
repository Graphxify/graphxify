"use server";

import { redirect } from "next/navigation";
import { deleteWork, restoreWorkVersion } from "@/services/content-service";

export async function restoreWorkVersionAction(formData: FormData): Promise<void> {
  const workId = String(formData.get("workId") || "");
  const versionId = String(formData.get("versionId") || "");
  if (!workId || !versionId) {
    throw new Error("Missing fields");
  }

  await restoreWorkVersion(workId, versionId);
  redirect(`/dashboard/works/${workId}`);
}

export async function deleteWorkAction(formData: FormData): Promise<void> {
  const workId = String(formData.get("workId") || "");
  if (!workId) {
    throw new Error("Missing work id");
  }

  await deleteWork(workId);
  redirect("/dashboard/works");
}
