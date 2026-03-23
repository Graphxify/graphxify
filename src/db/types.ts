export type ContentStatus = "draft" | "review" | "published";

export type Profile = {
  id: string;
  email: string;
  role: "admin" | "editor" | "moderator";
  role_id: number | null;
  status: "active" | "disabled" | "pending_invite";
  disabled_until: string | null;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  permissions: Record<string, boolean>;
  last_login: string | null;
  last_activity: string | null;
  last_password_change: string | null;
  force_password_reset: boolean;
  force_logout_at: string | null;
  created_at: string;
};

export type AppRoleRecord = {
  id: number;
  slug: "admin" | "editor" | "moderator";
  name: string;
  description: string | null;
  sort_order: number;
  default_permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  author: string | null;
  author_role: string | null;
  author_bio: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_image_alt: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_card: string | null;
  canonical_url: string | null;
  related_service: string | null;
  read_time_override: number | null;
  status: ContentStatus;
  author_id: string | null;
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
  // Portfolio card
  card_outcome: string | null;
  card_services: string[];
  sort_order: number;
  featured: boolean;
  // Info panel
  industry: string | null;
  platform: string | null;
  timeline: string | null;
  location: string | null;
  live_url: string | null;
  // Case study
  overview: string | null;
  challenge: string | null;
  approach: string | null;
  solution: string | null;
  result: string | null;
  // SEO
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_image_alt: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_card: string | null;
  canonical_url: string | null;
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
  rating: number;
  status: "draft" | "pending" | "published" | "rejected";
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
