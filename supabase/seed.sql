-- Seed works, testimonials, and auxiliary content.
-- Original public blog articles are synced into the CMS with `npm run sync:blog`.

-- REMOVED 2026-09-29: this block inserted six fictional template case studies
-- ("Northline Enterprise Replatform", "Orion SaaS Relaunch", …) as *published*
-- works with invented claims ("measurable conversion lift"). The production rows
-- now use real public slugs (flyup-line, maven, …), so `on conflict (slug) do
-- nothing` no longer protected anything: re-running this seed would have
-- published six fake projects. Real case studies are managed in the CMS.

with seed_author as (
  select id from public.profiles order by created_at asc limit 1
)
insert into public.testimonials (id, quote, name, role, image_url, rating, status, sort_order, author_id)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'Graphxify completely transformed our online presence. The new website feels modern, fast, and perfectly aligned with our brand. The process from design to launch was smooth and professional.',
    'Carlos M',
    'Founder, FlyUp Line',
    null,
    5,
    'published',
    0,
    (select id from seed_author)
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'Working with Graphxify was a great experience. The branding and website design elevated our business and helped us present a more premium image to our clients.',
    'Luka',
    'Founder, Luka Hair Salon',
    null,
    5,
    'published',
    1,
    (select id from seed_author)
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'Graphxify delivered a clean, modern website that feels both professional and easy for our customers to navigate. The final result reflects our brand perfectly.',
    'Sam',
    'Founder, King Medical Arts Pharmacy',
    null,
    5,
    'published',
    2,
    (select id from seed_author)
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'The attention to detail throughout the project was impressive. Graphxify translated our vision into a strong brand and website that truly represents our business.',
    'Sarah H',
    'Founder, Maven Brand',
    null,
    5,
    'published',
    3,
    (select id from seed_author)
  )
on conflict (id) do update set
  quote = excluded.quote,
  name = excluded.name,
  role = excluded.role,
  image_url = excluded.image_url,
  rating = excluded.rating,
  status = excluded.status,
  sort_order = excluded.sort_order;

delete from public.posts
where slug in (
  'enterprise-website-governance-2026',
  'how-to-design-an-audit-ready-cms',
  'performance-patterns-premium-agency-sites'
);

-- Initial version rows for seeded records
insert into public.post_versions (post_id, version, title, slug, excerpt, content, category, author, author_role, author_bio, tags, seo_title, seo_description, cover_image_url, status, editor_id, created_at)
select p.id, 1, p.title, p.slug, p.excerpt, p.content, p.category, p.author, p.author_role, p.author_bio, p.tags, p.seo_title, p.seo_description, p.cover_image_url, p.status, p.author_id, p.created_at
from public.posts p
where not exists (select 1 from public.post_versions v where v.post_id = p.id);

insert into public.work_versions (work_id, version, title, slug, year, role, services, excerpt, content, cover_image_url, status, editor_id)
select w.id, 1, w.title, w.slug, w.year, w.role, w.services, w.excerpt, w.content, w.cover_image_url, w.status, w.author_id
from public.works w
where not exists (select 1 from public.work_versions v where v.work_id = w.id);

-- Optional sample leads and audit logs
insert into public.leads (name, email, message)
values
  ('Jordan Miles', 'jordan@example.com', 'Need a premium redesign with CMS controls.'),
  ('Priya Das', 'priya@example.com', 'Looking for website + analytics implementation.')
on conflict do nothing;
