"use server";

import { redirect } from "next/navigation";
import { deletePost, restorePostVersion } from "@/services/content-service";

export async function restorePostVersionAction(formData: FormData): Promise<void> {
  const postId = String(formData.get("postId") || "");
  const versionId = String(formData.get("versionId") || "");
  if (!postId || !versionId) {
    throw new Error("Missing fields");
  }

  await restorePostVersion(postId, versionId);
  redirect(`/dashboard/posts/${postId}`);
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const postId = String(formData.get("postId") || "");
  if (!postId) {
    throw new Error("Missing post id");
  }

  await deletePost(postId);
  redirect("/dashboard/posts");
}
