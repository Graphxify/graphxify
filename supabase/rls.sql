-- Enable RLS
alter table public.app_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.works enable row level security;
alter table public.testimonials enable row level security;
alter table public.testimonial_metrics enable row level security;
alter table public.leads enable row level security;
alter table public.newsletter_subscribers enable row level security;
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

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'editor'
  );
$$;

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'moderator'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('editor', 'moderator')
  );
$$;

create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_moderator();
$$;

create or replace function public.is_author()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_editor();
$$;

create or replace function public.can_access_posts(post_author_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or public.is_moderator()
    or (public.is_editor() and auth.uid() = post_author_id);
$$;

create or replace function public.can_edit_posts(post_author_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or public.is_moderator()
    or (public.is_editor() and auth.uid() = post_author_id);
$$;

create or replace function public.can_access_works()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or public.is_staff();
$$;

create or replace function public.can_manage_testimonials()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or public.is_moderator();
$$;

create or replace function public.can_manage_testimonial_metrics()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or public.is_moderator();
$$;

create or replace function public.can_view_leads()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or public.is_moderator();
$$;

create or replace function public.can_upload_media()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or public.is_staff();
$$;

grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_editor() to anon, authenticated, service_role;
grant execute on function public.is_moderator() to anon, authenticated, service_role;
grant execute on function public.is_staff() to anon, authenticated, service_role;
grant execute on function public.is_reviewer() to anon, authenticated, service_role;
grant execute on function public.is_author() to anon, authenticated, service_role;
grant execute on function public.can_access_posts(uuid) to anon, authenticated, service_role;
grant execute on function public.can_edit_posts(uuid) to anon, authenticated, service_role;
grant execute on function public.can_access_works() to anon, authenticated, service_role;
grant execute on function public.can_manage_testimonials() to anon, authenticated, service_role;
grant execute on function public.can_manage_testimonial_metrics() to anon, authenticated, service_role;
grant execute on function public.can_view_leads() to anon, authenticated, service_role;
grant execute on function public.can_upload_media() to anon, authenticated, service_role;

-- App roles policies
drop policy if exists "app_roles_authenticated_read" on public.app_roles;

create policy "app_roles_authenticated_read"
on public.app_roles
for select
using (auth.role() = 'authenticated');

-- Profile triggers for high-risk protections
create or replace function public.prevent_last_admin_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_count int;
begin
  if tg_op = 'UPDATE' then
    if old.role = 'admin' and (new.role <> 'admin' or new.status <> 'active') then
      select count(*) into admin_count from public.profiles where role = 'admin';
      if admin_count <= 1 then
        raise exception 'Cannot remove or disable the last admin';
      end if;
    end if;

    if auth.uid() = old.id and not public.is_admin() then
      if new.role is distinct from old.role
        or new.status is distinct from old.status
        or new.force_password_reset is distinct from old.force_password_reset
        or new.force_logout_at is distinct from old.force_logout_at then
        raise exception 'Only admins can change role or security status';
      end if;
    end if;

    return new;
  end if;

  if tg_op = 'DELETE' then
    if auth.uid() = old.id then
      raise exception 'Admins cannot delete themselves';
    end if;

    if old.role = 'admin' then
      select count(*) into admin_count from public.profiles where role = 'admin';
      if admin_count <= 1 then
        raise exception 'Cannot delete the last admin';
      end if;
    end if;

    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists profiles_prevent_last_admin_change on public.profiles;
create trigger profiles_prevent_last_admin_change
before update or delete on public.profiles
for each row execute function public.prevent_last_admin_change();

-- Profiles policies
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_insert_self" on public.profiles;
drop policy if exists "profiles_update_self_or_admin" on public.profiles;
drop policy if exists "profiles_delete_admin" on public.profiles;

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

create policy "profiles_delete_admin"
on public.profiles
for delete
using (public.is_admin());

-- Posts policies
drop policy if exists "posts_public_read_published" on public.posts;
drop policy if exists "posts_staff_read_all" on public.posts;
drop policy if exists "posts_insert_staff" on public.posts;
drop policy if exists "posts_update_staff_owned" on public.posts;
drop policy if exists "posts_delete_admin" on public.posts;

create policy "posts_public_read_published"
on public.posts
for select
using (status = 'published');

create policy "posts_staff_read_all"
on public.posts
for select
using (public.can_access_posts(author_id));

create policy "posts_insert_staff"
on public.posts
for insert
with check (public.is_admin() or public.is_moderator() or public.is_editor());

create policy "posts_update_staff_owned"
on public.posts
for update
using (public.can_edit_posts(author_id))
with check (
  public.can_edit_posts(author_id)
  and (status <> 'published' or public.is_admin() or public.is_moderator())
);

create policy "posts_delete_admin"
on public.posts
for delete
using (public.is_admin());

-- Works policies
drop policy if exists "works_public_read_published" on public.works;
drop policy if exists "works_staff_read_all" on public.works;
drop policy if exists "works_insert_staff" on public.works;
drop policy if exists "works_update_staff_owned" on public.works;
drop policy if exists "works_delete_admin" on public.works;

create policy "works_public_read_published"
on public.works
for select
using (status = 'published');

create policy "works_staff_read_all"
on public.works
for select
using (public.can_access_works());

create policy "works_insert_staff"
on public.works
for insert
with check (public.can_access_works());

create policy "works_update_staff_owned"
on public.works
for update
using (public.can_access_works())
with check (
  public.can_access_works()
  and (status <> 'published' or public.is_admin() or public.is_moderator())
);

create policy "works_delete_admin"
on public.works
for delete
using (public.is_admin());

-- Testimonials policies
drop policy if exists "testimonials_public_read_published" on public.testimonials;
drop policy if exists "testimonials_public_insert_pending_review" on public.testimonials;
drop policy if exists "testimonials_staff_read_all" on public.testimonials;
drop policy if exists "testimonials_insert_staff" on public.testimonials;
drop policy if exists "testimonials_update_staff_owned" on public.testimonials;
drop policy if exists "testimonials_delete_staff_owned" on public.testimonials;

create policy "testimonials_public_read_published"
on public.testimonials
for select
using (status = 'published');

create policy "testimonials_public_insert_pending_review"
on public.testimonials
for insert
with check (
  status = 'pending'
  and sort_order = 0
  and author_id is null
  and rating between 1 and 5
);

create policy "testimonials_staff_read_all"
on public.testimonials
for select
using (public.can_manage_testimonials());

create policy "testimonials_insert_staff"
on public.testimonials
for insert
with check (public.can_manage_testimonials());

create policy "testimonials_update_staff_owned"
on public.testimonials
for update
using (public.can_manage_testimonials())
with check (public.can_manage_testimonials());

create policy "testimonials_delete_staff_owned"
on public.testimonials
for delete
using (public.is_admin());

-- Testimonial metrics policies
drop policy if exists "testimonial_metrics_public_read" on public.testimonial_metrics;
drop policy if exists "testimonial_metrics_staff_select" on public.testimonial_metrics;
drop policy if exists "testimonial_metrics_staff_insert" on public.testimonial_metrics;
drop policy if exists "testimonial_metrics_staff_update" on public.testimonial_metrics;
drop policy if exists "testimonial_metrics_staff_delete" on public.testimonial_metrics;

create policy "testimonial_metrics_public_read"
on public.testimonial_metrics
for select
using (true);

create policy "testimonial_metrics_staff_select"
on public.testimonial_metrics
for select
using (public.can_manage_testimonial_metrics());

create policy "testimonial_metrics_staff_insert"
on public.testimonial_metrics
for insert
with check (public.can_manage_testimonial_metrics());

create policy "testimonial_metrics_staff_update"
on public.testimonial_metrics
for update
using (public.can_manage_testimonial_metrics())
with check (public.can_manage_testimonial_metrics());

create policy "testimonial_metrics_staff_delete"
on public.testimonial_metrics
for delete
using (public.can_manage_testimonial_metrics());

-- Versions policies
drop policy if exists "post_versions_select_staff" on public.post_versions;
drop policy if exists "post_versions_insert_staff" on public.post_versions;
drop policy if exists "work_versions_select_staff" on public.work_versions;
drop policy if exists "work_versions_insert_staff" on public.work_versions;

create policy "post_versions_select_staff"
on public.post_versions
for select
using (
  public.is_admin() or exists (
    select 1 from public.posts p
    where p.id = post_versions.post_id
      and public.can_edit_posts(p.author_id)
  )
);

create policy "post_versions_insert_staff"
on public.post_versions
for insert
with check (
  public.is_admin() or exists (
    select 1 from public.posts p
    where p.id = post_versions.post_id
      and public.can_edit_posts(p.author_id)
  )
);

create policy "work_versions_select_staff"
on public.work_versions
for select
using (public.can_access_works());

create policy "work_versions_insert_staff"
on public.work_versions
for insert
with check (public.can_access_works());

-- Leads policies
drop policy if exists "leads_public_insert" on public.leads;
drop policy if exists "leads_staff_select" on public.leads;
drop policy if exists "leads_delete_admin" on public.leads;

create policy "leads_public_insert"
on public.leads
for insert
with check (true);

create policy "leads_staff_select"
on public.leads
for select
using (public.can_view_leads());

create policy "leads_delete_admin"
on public.leads
for delete
using (public.is_admin());

-- Newsletter policies
drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
drop policy if exists "newsletter_staff_select" on public.newsletter_subscribers;

create policy "newsletter_public_insert"
on public.newsletter_subscribers
for insert
with check (true);

create policy "newsletter_staff_select"
on public.newsletter_subscribers
for select
using (public.is_admin() or public.is_editor());

-- Audit policies
drop policy if exists "audit_logs_staff_select" on public.audit_logs;
drop policy if exists "audit_logs_staff_insert" on public.audit_logs;

create policy "audit_logs_staff_select"
on public.audit_logs
for select
using (public.is_admin());

create policy "audit_logs_staff_insert"
on public.audit_logs
for insert
with check (public.is_admin());

-- Page view policies
drop policy if exists "page_views_public_insert" on public.page_views;
drop policy if exists "page_views_staff_select" on public.page_views;

create policy "page_views_public_insert"
on public.page_views
for insert
with check (true);

create policy "page_views_staff_select"
on public.page_views
for select
using (public.is_admin() or public.is_editor());

-- Storage policies for media bucket
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
with check (bucket_id = 'media' and public.can_upload_media());

create policy "media_staff_update"
on storage.objects
for update
using (bucket_id = 'media' and public.can_upload_media())
with check (bucket_id = 'media' and public.can_upload_media());

create policy "media_staff_delete"
on storage.objects
for delete
using (bucket_id = 'media' and public.can_upload_media());
