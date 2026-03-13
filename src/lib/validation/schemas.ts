import { z } from "zod";
import { BLOG_CATEGORIES } from "@/lib/blog";

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

const optionalHttpUrlSchema = z
  .string()
  .trim()
  .max(240, "Website URL must be under 240 characters.")
  .refine((value) => {
    if (!value) return true;
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid website URL.");

export const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  message: z.string().min(8).max(2000),
  attachments: z.array(z.string().url()).max(5).optional()
});

export const publicLeadSchema = z.object({
  source: z.enum(["quick_start", "contact"]).default("quick_start"),
  name: z.string().trim().min(2, "Enter your full name.").max(120, "Name must be under 120 characters."),
  email: z.string().trim().email("Enter a valid email address.").max(180, "Email must be under 180 characters."),
  message: z.string().trim().max(1200, "Message must be under 1200 characters.").optional().or(z.literal("")),
  company: z.string().trim().max(120, "Company name must be under 120 characters.").optional().or(z.literal("")),
  website: optionalHttpUrlSchema.optional().or(z.literal("")),
  budgetRange: z.string().trim().max(40, "Budget range must be under 40 characters.").optional().or(z.literal("")),
  timeline: z.string().trim().max(40, "Timeline must be under 40 characters.").optional().or(z.literal("")),
  intakeNeeds: z.array(z.string().trim().min(2).max(80)).max(6, "Select up to 6 services.").default([]),
  customRequest: z.string().trim().max(160, "Custom request must be under 160 characters.").optional().or(z.literal("")),
  attachments: z.array(z.string().url("Attachment URL is invalid.")).max(5, "Upload up to 5 attachments.").default([]),
  consent: z.boolean().optional().default(false)
}).superRefine((value, ctx) => {
  if (value.intakeNeeds.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["intakeNeeds"],
      message: "Select at least one service."
    });
  }

  if (
    value.source === "contact" &&
    value.intakeNeeds.includes("something-else") &&
    (value.customRequest ?? "").trim().length < 3
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["customRequest"],
      message: "Add a short custom request."
    });
  }

  if (value.source === "contact" && value.consent !== true) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["consent"],
      message: "Consent is required before sending."
    });
  }
});

export const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(180, "Email must be under 180 characters.")
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
  category: z.enum(BLOG_CATEGORIES),
  author: z.string().trim().min(2).max(120),
  authorRole: z.string().trim().max(120).optional().or(z.literal("")),
  authorBio: z.string().trim().max(320).optional().or(z.literal("")),
  tags: z.string().trim().max(240).optional().or(z.literal("")),
  seoTitle: z.string().trim().max(180).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(320).optional().or(z.literal("")),
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
  if (value.author.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["author"],
      message: "Author must contain at least 2 characters to publish."
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
  rating: z.coerce.number().int().min(1).max(5).default(5),
  status: z.enum(["draft", "pending", "published", "rejected"]),
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

export const publicReviewSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(120),
  role: z.string().trim().min(2, "Role/title must be at least 2 characters.").max(160),
  quote: z.string().trim().min(10, "Review must be at least 10 characters.").max(600, "Review must be under 600 characters."),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1, "Please select a rating.").max(5).default(5)
});
