-- SUPERSEDED 2026-09-29: the equivalent changes were applied directly to production
-- (see docs/PRODUCTION-CMS-CLEANUP-2026-09-29.md). Do not run; it is guarded and
-- would be a no-op. Kept for history.
--
-- (original header) DRAFT — NOT APPLIED. Run once in the Supabase SQL editor (production), then
-- redeploy. Idempotent: every statement is guarded so re-running is a no-op,
-- and it only touches the specific rows/values listed below.
--
-- Applies the facts Daniel confirmed on 2026-09-29 (docs/PROJECT-DATA-CONFLICTS.md).
-- The site already RENDERS these facts from src/lib/project-card-content.ts;
-- this script makes the CMS agree, which silences the build's
-- "[project-facts] CMS value differs from confirmed fact" warnings.
--
-- Step 0 (optional): preview what will change
--   select slug, title, year, industry, location, services, card_services from public.works order by sort_order;

begin;

-- ── 1. Confirmed delivery years ──────────────────────────────────────────────
update public.works set year = 2025 where slug = 'flyup-line'                and year is distinct from 2025;
update public.works set year = 2024 where slug = 'pharmacy-on-king'          and year is distinct from 2024;
update public.works set year = 2023 where slug = 'luka-hair-salon'           and year is distinct from 2023;
update public.works set year = 2023 where slug = 'king-medical-art-pharmacy' and year is distinct from 2023;

-- ── 2. FlyUp Line: branding confirmed ────────────────────────────────────────
update public.works set services = array_prepend('Branding', coalesce(services, '{}'))
  where slug = 'flyup-line' and not ('Branding' = any(coalesce(services, '{}')));
update public.works set card_services = array_prepend('Branding', coalesce(card_services, '{}'))
  where slug = 'flyup-line' and not ('Branding' = any(coalesce(card_services, '{}')));

-- ── 3. Official client name: B.O.S.S. Medical Clinic ─────────────────────────
-- Replaces the retired spellings in every text field of that one record.
create or replace function pg_temp.boss_name(t text) returns text language sql immutable as $$
  select replace(replace(replace(t,
    'B.O.S.S Medical Clinic', 'B.O.S.S. Medical Clinic'),
    'BOSS Medical Clinic',    'B.O.S.S. Medical Clinic'),
    'Boss Medical Clinic',    'B.O.S.S. Medical Clinic')
$$;
update public.works set
  title               = pg_temp.boss_name(title),
  subtitle            = pg_temp.boss_name(subtitle),
  excerpt             = pg_temp.boss_name(excerpt),
  content             = pg_temp.boss_name(content),
  card_outcome        = pg_temp.boss_name(card_outcome),
  overview            = pg_temp.boss_name(overview),
  challenge           = pg_temp.boss_name(challenge),
  approach            = pg_temp.boss_name(approach),
  solution            = pg_temp.boss_name(solution),
  result              = pg_temp.boss_name(result),
  meta_title          = pg_temp.boss_name(meta_title),
  meta_description    = pg_temp.boss_name(meta_description),
  og_title            = pg_temp.boss_name(og_title),
  og_description      = pg_temp.boss_name(og_description),
  og_image_alt        = pg_temp.boss_name(og_image_alt),
  twitter_title       = pg_temp.boss_name(twitter_title),
  twitter_description = pg_temp.boss_name(twitter_description)
where slug = 'boss-medical-clinic';

-- ── 4. Maven: normalized industry "Fashion" ──────────────────────────────────
update public.works set industry = 'Fashion'
  where slug = 'maven' and industry is distinct from 'Fashion';
-- Classification phrases in labels, SEO text and short copy. Straight and
-- curly apostrophes are both handled.
create or replace function pg_temp.maven_terms(t text) returns text language sql immutable as $$
  select replace(replace(replace(replace(replace(replace(replace(t,
    'Women''s Fashion Brand Identity', 'Fashion Brand Identity'),
    'Women’s Fashion Brand Identity',  'Fashion Brand Identity'),
    'women''s fashion label',          'fashion label'),
    'women’s fashion label',           'fashion label'),
    'women''s fashion brand',          'fashion brand'),
    'women’s fashion brand',           'fashion brand'),
    'streetwear label',                'fashion label')
$$;
update public.works set
  subtitle            = pg_temp.maven_terms(subtitle),
  excerpt             = pg_temp.maven_terms(excerpt),
  content             = pg_temp.maven_terms(content),
  card_outcome        = pg_temp.maven_terms(card_outcome),
  overview            = pg_temp.maven_terms(overview),
  meta_title          = pg_temp.maven_terms(meta_title),
  meta_description    = pg_temp.maven_terms(meta_description),
  og_title            = pg_temp.maven_terms(og_title),
  og_description      = pg_temp.maven_terms(og_description),
  twitter_title       = pg_temp.maven_terms(twitter_title),
  twitter_description = pg_temp.maven_terms(twitter_description)
where slug = 'maven';
-- NOT changed automatically (needs Daniel's wording): Maven's `challenge`
-- paragraph is written around women's fashion ("Women's fashion branding often
-- leans heavily on soft visuals … feel feminine without being delicate …").
-- Rewrite it in the dashboard if it should not narrow the industry.

-- ── 5. Project location = CLIENT location / market ───────────────────────────
-- Remove the global default that stamped 'Canada' on every project.
alter table public.works alter column location drop default;
comment on column public.works.location is
  'Client location / primary market (NOT Graphxify''s own location). Nullable — leave empty when unknown.';
-- Clear the bulk-default values. Evidence they are not editor-entered: all six
-- rows were set to 'Canada' by supabase/migrate-and-seed-works.sql, and every
-- row shares the same bulk updated_at. Only the exact default value is cleared,
-- so any other (manually entered) location is left untouched.
update public.works set location = null where location = 'Canada';

-- ── 6. Testimonial role typo (unambiguous) ───────────────────────────────────
update public.testimonials set role = 'Manager'
  where id = '094ff68d-f465-4d55-82e0-6e41e7ebdfb7' and role = 'Manger';

commit;

-- Verify:
--   select slug, title, year, industry, location, services, card_services, meta_title, og_title
--   from public.works order by sort_order;
--   select id, role from public.testimonials where id = '094ff68d-f465-4d55-82e0-6e41e7ebdfb7';
