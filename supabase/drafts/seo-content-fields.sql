-- DRAFT — NOT APPLIED. Review, then run in the Supabase SQL editor.
--
-- Optional SEO / accessibility / case-study fields identified in
-- docs/SEO-AI-SEARCH-AUDIT.md (sections W, 33, 34). Every column is nullable so
-- historic rows stay valid; nothing here backfills or invents data.
--
-- IMPORTANT: the public queries (src/db/queries/posts.ts, works.ts) select an
-- explicit column list and fall back to a legacy column set when a column is
-- missing. Only add these columns to those select lists AFTER this migration
-- has run in production, otherwise every page silently loses its extended fields.

begin;

-- ── Posts ────────────────────────────────────────────────────────────────────
-- A real first-publication timestamp. Today `created_at` doubles as the publish
-- date, so a draft created weeks before publishing shows the wrong date.
alter table public.posts add column if not exists published_at timestamptz;
-- Alt text for the cover image (currently the post title is reused).
alter table public.posts add column if not exists cover_image_alt text;

-- ── Works (case studies) ─────────────────────────────────────────────────────
-- Client / brand name when it differs from the project title.
alter table public.works add column if not exists client_name text;
-- Market or country the client serves (distinct from `location`, which is
-- ambiguous today — see ENTITY-DATA-NEEDED.md).
alter table public.works add column if not exists market text;
-- Technologies actually used (e.g. {Next.js, Figma}). Only fill with facts.
alter table public.works add column if not exists technologies text[];
-- Alt text for the cover image and per-gallery-image alt text (same order as gallery_images).
alter table public.works add column if not exists cover_image_alt text;
alter table public.works add column if not exists gallery_image_alts text[];
-- A real client testimonial, with written permission to publish it.
alter table public.works add column if not exists testimonial_quote text;
alter table public.works add column if not exists testimonial_author text;
alter table public.works add column if not exists testimonial_role text;

commit;
