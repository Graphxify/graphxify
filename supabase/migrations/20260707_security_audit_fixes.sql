-- ============================================================================
-- Security audit remediation — 2026-07-07
-- Addresses: C2 (self-escalation), H3 (disabled accounts), H5 (newsletter PII),
--            H6 (marquee writes), M4 (trigger fn RPC exposure), L5 (search_path).
--
-- Idempotent: safe to run more than once. Review before applying to production.
-- Apply with: supabase db execute -f this-file.sql  (or the SQL editor).
-- ============================================================================

begin;

-- ── C2: block self-escalation via role_id / permissions / disabled_until ──────
-- The previous guard only inspected role/status/force_* columns, so a non-admin
-- could change their own role_id (or permissions) and the sync trigger would
-- promote them to admin. Guard the raw columns directly.
create or replace function public.prevent_last_admin_change()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
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

    -- A non-admin editing their own row may not change any privileged column.
    -- The service-role backend path has auth.uid() = null and is unaffected.
    if auth.uid() = old.id and not public.is_admin() then
      if new.role is distinct from old.role
        or new.role_id is distinct from old.role_id
        or new.permissions is distinct from old.permissions
        or new.status is distinct from old.status
        or new.force_password_reset is distinct from old.force_password_reset
        or new.force_logout_at is distinct from old.force_logout_at
        or new.disabled_until is distinct from old.disabled_until then
        raise exception 'Only admins can change role, permissions, or security status';
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
$function$;

-- ── H3: disabled / timed-out accounts must not pass role checks ───────────────
-- can_*() and is_reviewer()/is_author() all delegate to these four base
-- functions, so adding the active-status predicate here covers every policy.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
      and p.status = 'active'
      and (p.disabled_until is null or p.disabled_until < now())
  );
$$;

create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'editor'
      and p.status = 'active'
      and (p.disabled_until is null or p.disabled_until < now())
  );
$$;

create or replace function public.is_moderator()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'moderator'
      and p.status = 'active'
      and (p.disabled_until is null or p.disabled_until < now())
  );
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('editor', 'moderator')
      and p.status = 'active'
      and (p.disabled_until is null or p.disabled_until < now())
  );
$$;

-- ── H5: editors must not read the newsletter subscriber PII list ──────────────
drop policy if exists "newsletter_staff_select" on public.newsletter_subscribers;
create policy "newsletter_staff_select"
on public.newsletter_subscribers
for select
using (public.is_admin() or public.is_moderator());

-- ── H6: gate marquee_items writes by role (was open to any authenticated user) ─
drop policy if exists "marquee_items_auth_write" on public.marquee_items;
create policy "marquee_items_staff_write"
on public.marquee_items
for all
using (public.can_access_works())
with check (public.can_access_works());

-- ── L5: pin search_path on the two flagged functions ──────────────────────────
alter function public.normalize_app_role(text) set search_path = public;
alter function public.set_updated_at() set search_path = public;

-- ── M4 (safe subset): trigger-only functions need not be callable via PostgREST.
-- (is_*/can_* are intentionally left executable — RLS policy evaluation needs it.)
-- Revoke from PUBLIC too: functions grant EXECUTE to PUBLIC by default, which
-- anon/authenticated inherit, so revoking only from those roles is a no-op.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_last_admin_change() from public, anon, authenticated;
revoke execute on function public.sync_profile_role_columns() from public, anon, authenticated;

commit;
