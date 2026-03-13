alter table public.posts
  add column if not exists category text not null default 'Web Design',
  add column if not exists author text,
  add column if not exists author_role text,
  add column if not exists author_bio text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists seo_title text,
  add column if not exists seo_description text;

update public.posts
set
  author = coalesce(nullif(author, ''), 'Graphxify Team'),
  author_role = coalesce(author_role, 'Editorial Team'),
  author_bio = coalesce(author_bio, 'Graphxify shares practical guidance on brand systems, websites, and content operations.'),
  tags = coalesce(tags, '{}'::text[])
where true;

alter table public.post_versions
  add column if not exists category text not null default 'Web Design',
  add column if not exists author text,
  add column if not exists author_role text,
  add column if not exists author_bio text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists seo_title text,
  add column if not exists seo_description text;

update public.post_versions pv
set
  category = p.category,
  author = p.author,
  author_role = p.author_role,
  author_bio = p.author_bio,
  tags = p.tags,
  seo_title = p.seo_title,
  seo_description = p.seo_description
from public.posts p
where p.id = pv.post_id;
