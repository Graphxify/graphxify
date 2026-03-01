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

export const inquiryServiceValues = [
  "Brand Systems",
  "Web Design (UX/UI)",
  "Web Development",
  "CMS Architecture"
] as const;

export const inquiryTimelineValues = ["ASAP", "2-4 weeks", "1-2 months", "3+ months"] as const;

export const inquiryBudgetValues = ["$5k-$10k", "$10k-$25k", "$25k-$50k", "$50k+"] as const;

export const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  company: z.string().min(2).max(180),
  website: z.string().trim().optional().or(z.literal("")).refine((value) => {
    if (!value) return true;
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, "Website URL must be a valid http(s) URL."),
  services: z.array(z.enum(inquiryServiceValues)).min(1),
  timeline: z.enum(inquiryTimelineValues),
  budget: z.enum(inquiryBudgetValues),
  details: z.string().min(80).max(5000),
  source: z.enum(["homepage", "contact"])
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
