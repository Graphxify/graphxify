-- Enable RLS
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.works enable row level security;
alter table public.leads enable row level security;
alter table public.audit_logs enable row level security;
alter table public.post_versions enable row level security;
alter table public.work_versions enable row level security;
alter table public.page_views enable row level security;

-- Role helper functions
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_mod()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'mod'
  );
$$;

create or replace function public.is_admin_or_mod()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or public.is_mod();
$$;

create or replace function public.can_edit_post(post_author_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or (public.is_mod() and auth.uid() = post_author_id);
$$;

create or replace function public.can_edit_work(work_author_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or (public.is_mod() and auth.uid() = work_author_id);
$$;

grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_mod() to anon, authenticated, service_role;
grant execute on function public.is_admin_or_mod() to anon, authenticated, service_role;
grant execute on function public.can_edit_post(uuid) to anon, authenticated, service_role;
grant execute on function public.can_edit_work(uuid) to anon, authenticated, service_role;

-- Profiles policies
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_self"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_self_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

-- Posts policies
create policy "posts_public_read_published"
on public.posts
for select
using (status = 'published');

create policy "posts_staff_read_all"
on public.posts
for select
using (public.is_admin_or_mod());

create policy "posts_insert_staff"
on public.posts
for insert
with check (public.is_admin_or_mod());

create policy "posts_update_staff_owned"
on public.posts
for update
using (public.can_edit_post(author_id))
with check (public.can_edit_post(author_id));

create policy "posts_delete_admin"
on public.posts
for delete
using (public.is_admin());

-- Works policies
create policy "works_public_read_published"
on public.works
for select
using (status = 'published');

create policy "works_staff_read_all"
on public.works
for select
using (public.is_admin_or_mod());

create policy "works_insert_staff"
on public.works
for insert
with check (public.is_admin_or_mod());

create policy "works_update_staff_owned"
on public.works
for update
using (public.can_edit_work(author_id))
with check (public.can_edit_work(author_id));

create policy "works_delete_admin"
on public.works
for delete
using (public.is_admin());

-- Versions policies
create policy "post_versions_select_staff"
on public.post_versions
for select
using (
  public.is_admin() or exists (
    select 1 from public.posts p
    where p.id = post_versions.post_id
      and public.can_edit_post(p.author_id)
  )
);

create policy "post_versions_insert_staff"
on public.post_versions
for insert
with check (
  public.is_admin() or exists (
    select 1 from public.posts p
    where p.id = post_versions.post_id
      and public.can_edit_post(p.author_id)
  )
);

create policy "work_versions_select_staff"
on public.work_versions
for select
using (
  public.is_admin() or exists (
    select 1 from public.works w
    where w.id = work_versions.work_id
      and public.can_edit_work(w.author_id)
  )
);

create policy "work_versions_insert_staff"
on public.work_versions
for insert
with check (
  public.is_admin() or exists (
    select 1 from public.works w
    where w.id = work_versions.work_id
      and public.can_edit_work(w.author_id)
  )
);

-- Leads policies
create policy "leads_public_insert"
on public.leads
for insert
with check (true);

create policy "leads_staff_select"
on public.leads
for select
using (public.is_admin_or_mod());

create policy "leads_delete_admin"
on public.leads
for delete
using (public.is_admin());

-- Audit policies
create policy "audit_logs_staff_select"
on public.audit_logs
for select
using (public.is_admin_or_mod());

create policy "audit_logs_staff_insert"
on public.audit_logs
for insert
with check (public.is_admin_or_mod());

-- Page view policies (optional analytics hook)
create policy "page_views_public_insert"
on public.page_views
for insert
with check (true);

create policy "page_views_staff_select"
on public.page_views
for select
using (public.is_admin_or_mod());

-- Storage policies for media bucket
-- NOTE:
-- `storage.objects` is managed by Supabase internals, and some SQL editor roles
-- are not table owners. Do not run `alter table storage.objects ...` here.
-- RLS is already enabled by Supabase for storage tables.

drop policy if exists "media_public_read" on storage.objects;
drop policy if exists "media_staff_insert" on storage.objects;
drop policy if exists "media_staff_update" on storage.objects;
drop policy if exists "media_staff_delete" on storage.objects;

create policy "media_public_read"
on storage.objects
for select
using (bucket_id = 'media');

create policy "media_staff_insert"
on storage.objects
for insert
with check (bucket_id = 'media' and public.is_admin_or_mod());

create policy "media_staff_update"
on storage.objects
for update
using (bucket_id = 'media' and public.is_admin_or_mod())
with check (bucket_id = 'media' and public.is_admin_or_mod());

create policy "media_staff_delete"
on storage.objects
for delete
using (bucket_id = 'media' and public.is_admin_or_mod());
