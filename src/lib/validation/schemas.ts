import { z } from "zod";

const imageUrlSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    if (value.startsWith("/")) return true;
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, "Invalid image URL. Use an absolute URL or a root-relative path like /assets/example.svg.");

export const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  message: z.string().min(8).max(2000)
});

export const postSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z
    .string()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(1).max(320),
  content: z.string().min(1),
  coverImageUrl: imageUrlSchema.optional().or(z.literal("")),
  status: z.enum(["draft", "review", "published"])
}).superRefine((value, ctx) => {
  if (value.status !== "published") {
    return;
  }
  if (value.excerpt.trim().length < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["excerpt"],
      message: "Excerpt must contain at least 10 characters to publish."
    });
  }
  if (value.content.trim().length < 20) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["content"],
      message: "Content must contain at least 20 characters to publish."
    });
  }
});

export const workSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z
    .string()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9-]+$/),
  year: z.coerce.number().int().min(2000).max(2100),
  role: z.string().min(2).max(120),
  services: z.array(z.string().min(2).max(80)).min(1),
  subtitle: z.string().trim().max(220).optional().or(z.literal("")),
  layoutVariant: z.enum(["A", "B", "C", "D", "E", "F"]).default("A"),
  excerpt: z.string().min(1).max(320),
  content: z.string().min(1),
  coverImageUrl: imageUrlSchema.optional().or(z.literal("")),
  galleryImages: z.array(imageUrlSchema).max(24).default([]),
  status: z.enum(["draft", "review", "published"])
}).superRefine((value, ctx) => {
  if (value.status !== "published") {
    return;
  }
  if (value.excerpt.trim().length < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["excerpt"],
      message: "Excerpt must contain at least 10 characters to publish."
    });
  }
  if (value.content.trim().length < 20) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["content"],
      message: "Content must contain at least 20 characters to publish."
    });
  }
});

export const testimonialSchema = z.object({
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(160),
  quote: z.string().min(1).max(600),
  imageUrl: imageUrlSchema.optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  sortOrder: z.coerce.number().int().min(0).max(9999)
}).superRefine((value, ctx) => {
  if (value.status !== "published") {
    return;
  }
  if (value.quote.trim().length < 20) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["quote"],
      message: "Quote must contain at least 20 characters to publish."
    });
  }
});

export const testimonialMetricItemSchema = z.object({
  id: z.string().trim().min(1).max(120).optional(),
  value: z.string().trim().min(1).max(40),
  label: z.string().trim().min(2).max(120),
  sort_order: z.coerce.number().int().min(0).max(9999)
});

export const testimonialMetricsSchema = z.object({
  metrics: z.array(testimonialMetricItemSchema).min(1).max(6)
});
