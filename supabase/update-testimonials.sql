-- Update testimonials with real client data.
-- Run this in the Supabase SQL Editor to update the live database.
-- Safe to run multiple times (upsert on fixed UUIDs).

-- Remove any placeholder / test testimonials that may exist
delete from public.testimonials
where name in (
  'Ethan Moore', 'Leah Mendez', 'Omar Rahim',
  'Sophia Chen', 'Marcus Johnson', 'Test Reviewer'
)
and id not in (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000104'
);

-- Upsert the four real client testimonials
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
  quote      = excluded.quote,
  name       = excluded.name,
  role       = excluded.role,
  image_url  = excluded.image_url,
  rating     = excluded.rating,
  status     = excluded.status,
  sort_order = excluded.sort_order;
