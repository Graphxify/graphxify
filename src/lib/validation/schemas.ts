import { z } from "zod";

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
  excerpt: z.string().min(10).max(320),
  content: z.string().min(20),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "review", "published"])
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
  excerpt: z.string().min(10).max(320),
  content: z.string().min(20),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "review", "published"])
});
