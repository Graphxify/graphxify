export type ContentStatus = "draft" | "review" | "published";

export type Profile = {
  id: string;
  email: string;
  role: "admin" | "mod";
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  status: ContentStatus;
  author_id: string;
  created_at: string;
  updated_at: string;
};

export type Work = {
  id: string;
  title: string;
  slug: string;
  year: number;
  role: string;
  services: string[];
  subtitle: string | null;
  layout_variant: "A" | "B" | "C" | "D" | "E" | "F";
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  gallery_images: string[];
  status: ContentStatus;
  author_id: string;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image_url: string | null;
  status: "draft" | "published";
  sort_order: number;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type TestimonialMetric = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};
