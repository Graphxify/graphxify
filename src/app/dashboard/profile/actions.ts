"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/requireRole";
import { logAuditEvent } from "@/lib/audit";
import { logger } from "@/lib/logger";

export async function updateProfileAction(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const profile = await requireAuth();
  const supabase = createClient();

  const displayName = String(formData.get("display_name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        bio: bio || null
      })
      .eq("id", profile.id);

    if (error) {
      // Column might not exist yet — that's OK
      if (error.message.includes("column") || error.code === "PGRST204") {
        logger.warn("Profile update: columns may not exist yet", { error: error.message });
        return { success: false, message: "Profile fields are not yet configured in the database." };
      }
      throw error;
    }

    try {
      await logAuditEvent({
        actorId: profile.id,
        actorEmail: profile.email,
        actorRole: profile.role,
        action: "profile.update",
        entityType: "profile",
        entityId: profile.id,
        metadata: { fields: ["display_name", "bio"] }
      });
    } catch {
      // Audit log failure is non-critical
    }

    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    logger.error("Profile update failed", {
      userId: profile.id,
      error: error instanceof Error ? error.message : "unknown"
    });
    return { success: false, message: "Failed to update profile. Please try again." };
  }
}

export async function changePasswordAction(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const profile = await requireAuth();
  const supabase = createClient();

  const currentPassword = String(formData.get("current_password") || "");
  const newPassword = String(formData.get("new_password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (!currentPassword || !newPassword) {
    return { success: false, message: "All password fields are required." };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match." };
  }

  // Verify current password by attempting sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: currentPassword
  });

  if (verifyError) {
    return { success: false, message: "Current password is incorrect." };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) {
    logger.error("Password change failed", {
      userId: profile.id,
      error: updateError.message
    });
    return { success: false, message: updateError.message || "Failed to change password." };
  }

  try {
    await logAuditEvent({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      action: "profile.password_change",
      entityType: "profile",
      entityId: profile.id,
      metadata: {}
    });
  } catch {
    // Audit log failure is non-critical
  }

  return { success: true, message: "Password changed successfully." };
}
