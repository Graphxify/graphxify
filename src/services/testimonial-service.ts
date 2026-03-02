import "server-only";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/requireRole";
import { logAuditEvent } from "@/lib/audit";
import {
  isTestimonialsTableMissing,
  readFallbackTestimonials,
  writeFallbackSnapshot,
  type FallbackTestimonial
} from "@/lib/testimonial-fallback";
import { testimonialSchema } from "@/lib/validation/schemas";

type TestimonialClient = ReturnType<typeof createClient> | NonNullable<ReturnType<typeof createAdminClient>>;

function getWriteClient(): TestimonialClient {
  return createAdminClient() ?? createClient();
}

function toFallbackRecord(params: {
  id: string;
  profileId: string;
  parsed: {
    name: string;
    role: string;
    quote: string;
    imageUrl?: string;
    status: "draft" | "published";
    sortOrder: number;
  };
  createdAt?: string;
}): FallbackTestimonial {
  const createdAt = params.createdAt || new Date().toISOString();
  return {
    id: params.id,
    name: params.parsed.name,
    role: params.parsed.role,
    quote: params.parsed.quote,
    image_url: params.parsed.imageUrl || null,
    status: params.parsed.status,
    sort_order: params.parsed.sortOrder,
    author_id: params.profileId,
    created_at: createdAt,
    updated_at: new Date().toISOString()
  };
}

export async function createOrUpdateTestimonial(params: { id?: string; formData: FormData }): Promise<{ id: string }> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }

  const parsed = testimonialSchema.parse({
    name: params.formData.get("name"),
    role: params.formData.get("role"),
    quote: params.formData.get("quote"),
    imageUrl: params.formData.get("imageUrl"),
    status: params.formData.get("status"),
    sortOrder: params.formData.get("sortOrder")
  });

  const supabase = getWriteClient();

  if (!params.id) {
    let createdId = "";
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert({
          name: parsed.name,
          role: parsed.role,
          quote: parsed.quote,
          image_url: parsed.imageUrl || null,
          status: parsed.status,
          sort_order: parsed.sortOrder,
          author_id: profile.id
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }
      createdId = data.id;
    } catch (error) {
      if (!isTestimonialsTableMissing(error)) {
        throw error;
      }

      createdId = randomUUID();
      const fallbackRecord = toFallbackRecord({
        id: createdId,
        profileId: profile.id,
        parsed
      });
      await writeFallbackSnapshot({
        entityId: createdId,
        actorId: profile.id,
        actorEmail: profile.email,
        actorRole: profile.role,
        testimonial: fallbackRecord
      });
    }

    await logAuditEvent({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      action: parsed.status === "published" ? "testimonial.publish" : "testimonial.create",
      entityType: "testimonial",
      entityId: createdId,
      metadata: {
        status: parsed.status,
        sort_order: parsed.sortOrder
      }
    });

    revalidatePath("/");
    revalidatePath("/dashboard/testimonials");
    return { id: createdId };
  }

  let existing: { id: string; author_id: string | null; status: "draft" | "published"; created_at?: string } | null = null;
  try {
    const { data, error: existingError } = await supabase
      .from("testimonials")
      .select("id,author_id,status,created_at")
      .eq("id", params.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }
    existing = data;
  } catch (error) {
    if (!isTestimonialsTableMissing(error)) {
      throw error;
    }

    const fallbackRows = await readFallbackTestimonials();
    const fallbackExisting = fallbackRows.find((item) => item.id === params.id) ?? null;
    if (!fallbackExisting) {
      throw new Error("Testimonial not found");
    }
    existing = {
      id: fallbackExisting.id,
      author_id: fallbackExisting.author_id,
      status: fallbackExisting.status,
      created_at: fallbackExisting.created_at
    };
  }
  if (!existing) {
    throw new Error("Testimonial not found");
  }

  if (profile.role === "mod" && existing.author_id && existing.author_id !== profile.id) {
    throw new Error("Forbidden");
  }

  try {
    const { error } = await supabase
      .from("testimonials")
      .update({
        name: parsed.name,
        role: parsed.role,
        quote: parsed.quote,
        image_url: parsed.imageUrl || null,
        status: parsed.status,
        sort_order: parsed.sortOrder,
        author_id: existing.author_id ?? profile.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    if (!isTestimonialsTableMissing(error)) {
      throw error;
    }
    const fallbackRecord = toFallbackRecord({
      id: params.id,
      profileId: existing.author_id ?? profile.id,
      parsed,
      createdAt: existing.created_at
    });
    await writeFallbackSnapshot({
      entityId: params.id,
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      testimonial: fallbackRecord
    });
  }

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: parsed.status === "published" ? "testimonial.publish" : "testimonial.update",
    entityType: "testimonial",
    entityId: params.id,
    metadata: {
      previous_status: existing.status,
      next_status: parsed.status,
      sort_order: parsed.sortOrder
    }
  });

  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
  return { id: params.id };
}

export async function deleteTestimonial(id: string): Promise<void> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "mod")) {
    throw new Error("Forbidden");
  }

  const supabase = getWriteClient();
  let existing: { id: string; author_id: string | null } | null = null;
  try {
    const { data, error: existingError } = await supabase
      .from("testimonials")
      .select("id,author_id")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }
    existing = data;
  } catch (error) {
    if (!isTestimonialsTableMissing(error)) {
      throw error;
    }
    const fallbackRows = await readFallbackTestimonials();
    const fallbackExisting = fallbackRows.find((item) => item.id === id) ?? null;
    if (!fallbackExisting) {
      throw new Error("Testimonial not found");
    }
    existing = {
      id: fallbackExisting.id,
      author_id: fallbackExisting.author_id
    };
  }
  if (!existing) {
    throw new Error("Testimonial not found");
  }

  if (profile.role === "mod" && existing.author_id && existing.author_id !== profile.id) {
    throw new Error("Forbidden");
  }

  try {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      throw error;
    }
  } catch (error) {
    if (!isTestimonialsTableMissing(error)) {
      throw error;
    }
    await writeFallbackSnapshot({
      entityId: id,
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      deleted: true
    });
  }

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: "testimonial.delete",
    entityType: "testimonial",
    entityId: id,
    metadata: { operation: "delete" }
  });

  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
}
