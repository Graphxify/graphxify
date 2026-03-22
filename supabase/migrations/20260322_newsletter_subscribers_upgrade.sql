alter table public.newsletter_subscribers
  add column if not exists status text not null default 'subscribed',
  add column if not exists unsubscribe_token text,
  add column if not exists subscribed_at timestamptz not null default now(),
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists welcome_email_sent_at timestamptz;

update public.newsletter_subscribers
set
  status = coalesce(status, 'subscribed'),
  subscribed_at = coalesce(subscribed_at, created_at, now()),
  unsubscribe_token = coalesce(unsubscribe_token, md5(gen_random_uuid()::text || email || clock_timestamp()::text));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'newsletter_subscribers_status_check'
  ) then
    alter table public.newsletter_subscribers
      add constraint newsletter_subscribers_status_check
      check (status in ('subscribed', 'unsubscribed'));
  end if;
end $$;

create unique index if not exists newsletter_subscribers_unsubscribe_token_key
on public.newsletter_subscribers (unsubscribe_token);

alter table public.newsletter_subscribers
  alter column unsubscribe_token set not null;

drop policy if exists "newsletter_staff_select" on public.newsletter_subscribers;

create policy "newsletter_staff_select"
on public.newsletter_subscribers
for select
using (public.is_admin() or public.is_staff());
