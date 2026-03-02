-- Seed posts and works as published

with seed_author as (
  select id from public.profiles order by created_at asc limit 1
)
insert into public.works (title, slug, year, role, services, excerpt, content, cover_image_url, status, author_id)
values
  (
    'Northline Enterprise Replatform',
    'northline-enterprise-replatform',
    2025,
    'Lead Product Partner',
    array['Research','UX','Engineering'],
    'Unified marketing and CMS stack with measurable conversion lift.',
    'Enterprise replatform case study with measurable improvements in velocity and performance.',
    '/assets/work-1.svg',
    'published',
    (select id from seed_author)
  ),
  (
    'Vertex Brand Operations',
    'vertex-brand-operations',
    2025,
    'Design Systems',
    array['Brand','Design System'],
    'Brand governance toolkit for multi-team campaign delivery.',
    'Cross-functional design and engineering operations case study.',
    '/assets/work-2.svg',
    'published',
    (select id from seed_author)
  ),
  (
    'Axis Growth Platform',
    'axis-growth-platform',
    2024,
    'Full-Stack Delivery',
    array['Web','CMS','Analytics'],
    'Performance-first website and publishing model for growth teams.',
    'Content operations platform built with governance and measurement.',
    '/assets/work-3.svg',
    'published',
    (select id from seed_author)
  ),
  (
    'Orion SaaS Relaunch',
    'orion-saas-relaunch',
    2024,
    'Platform Engineering',
    array['Platform','SEO','CRO'],
    'Rebuilt acquisition funnel and CMS governance for faster campaign velocity.',
    'Detailed implementation showcasing role-based workflows and content QA.',
    '/assets/work-fallback.svg',
    'published',
    (select id from seed_author)
  ),
  (
    'Solace Investor Relations Portal',
    'solace-investor-relations-portal',
    2023,
    'Systems Integration',
    array['Architecture','UI','Data'],
    'High-trust information architecture for investor and press workflows.',
    'Case study focused on compliance-safe publishing and approval operations.',
    '/assets/work-fallback.svg',
    'published',
    (select id from seed_author)
  ),
  (
    'Kite Commerce Experience Refresh',
    'kite-commerce-experience-refresh',
    2023,
    'Experience Design',
    array['UX','Motion','Performance'],
    'Modernized the front-end experience with strict Lighthouse targets.',
    'Case study describing SSR-first architecture and selective hydration.',
    '/assets/work-fallback.svg',
    'published',
    (select id from seed_author)
  )
on conflict (slug) do nothing;

with seed_author as (
  select id from public.profiles order by created_at asc limit 1
)
insert into public.testimonials (id, quote, name, role, image_url, status, sort_order, author_id)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'Graphxify turned our ideas into a sharp, clean brand. Fast, easy, and right on point.',
    'Ethan Moore',
    'Co-founder, NovaTech',
    '/assets/work-1.svg',
    'published',
    0,
    (select id from seed_author)
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'The design and build loop was seamless. We launched with clarity, speed, and a system our team can manage.',
    'Leah Mendez',
    'Head of Digital, Northline',
    '/assets/work-2.svg',
    'published',
    1,
    (select id from seed_author)
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'Our site feels premium now, and the CMS structure means we can publish confidently without design drift.',
    'Omar Rahim',
    'Operations Director, Axis Group',
    '/assets/work-3.svg',
    'published',
    2,
    (select id from seed_author)
  )
on conflict (id) do nothing;

with seed_author as (
  select id from public.profiles order by created_at asc limit 1
)
insert into public.testimonial_metrics (id, value, label, sort_order, author_id)
values
  ('00000000-0000-0000-0000-000000000201', '26+', 'Finalized Projects', 0, (select id from seed_author)),
  ('00000000-0000-0000-0000-000000000202', '98%', 'Client satisfaction rate', 1, (select id from seed_author)),
  ('00000000-0000-0000-0000-000000000203', '10M', 'Gross Revenue', 2, (select id from seed_author))
on conflict (id) do nothing;

with seed_author as (
  select id from public.profiles order by created_at asc limit 1
)
insert into public.posts (title, slug, excerpt, content, cover_image_url, status, author_id)
values
  (
    'Enterprise Website Governance in 2026',
    'enterprise-website-governance-2026',
    'A practical model for balancing delivery speed with content quality at scale.',
    'In this guide, we break down governance foundations for enterprise content pipelines.',
    '/assets/post-1.svg',
    'published',
    (select id from seed_author)
  ),
  (
    'How to Design an Audit-Ready CMS',
    'how-to-design-an-audit-ready-cms',
    'Auditability is a product feature. Here is how to implement it cleanly.',
    'From role boundaries to event metadata, this article covers implementation details.',
    '/assets/post-2.svg',
    'published',
    (select id from seed_author)
  ),
  (
    'Performance Patterns for Premium Agency Sites',
    'performance-patterns-premium-agency-sites',
    'A concise set of patterns that push Lighthouse scores into production-safe territory.',
    'Server components, selective hydration, and query discipline.',
    '/assets/post-3.svg',
    'published',
    (select id from seed_author)
  )
on conflict (slug) do nothing;

-- Initial version rows for seeded records
insert into public.post_versions (post_id, version, title, slug, excerpt, content, cover_image_url, status, editor_id)
select p.id, 1, p.title, p.slug, p.excerpt, p.content, p.cover_image_url, p.status, p.author_id
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

insert into public.audit_logs (actor_id, actor_email, actor_role, action, entity_type, metadata, ip, user_agent)
values
  ((select id from public.profiles limit 1), 'admin@graphxify.com', 'admin', 'post.publish', 'post', '{"seed":true}'::jsonb, '127.0.0.1', 'seed-script'),
  ((select id from public.profiles limit 1), 'admin@graphxify.com', 'admin', 'work.publish', 'work', '{"seed":true}'::jsonb, '127.0.0.1', 'seed-script')
on conflict do nothing;
