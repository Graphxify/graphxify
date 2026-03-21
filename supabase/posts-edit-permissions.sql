-- Patch blog post edit permissions to match the current CMS role model.
-- Run this in Supabase SQL Editor if blog saves return "Forbidden" or fail under RLS.

create or replace function public.can_edit_posts(post_author_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'moderator'
    )
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'editor'
        and (post_author_id is null or auth.uid() = post_author_id)
    );
$$;

grant execute on function public.can_edit_posts(uuid) to anon, authenticated, service_role;

drop policy if exists "posts_update_staff_owned" on public.posts;

create policy "posts_update_staff_owned"
on public.posts
for update
using (public.can_edit_posts(author_id))
with check (public.can_edit_posts(author_id));
