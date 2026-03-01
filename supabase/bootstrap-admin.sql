-- Set your first admin after signup (Option A)
-- Replace the email value before executing.

update public.profiles
set role = 'admin'
where email = 'founder@graphxify.com';

-- Optional safety check
select id, email, role from public.profiles where role = 'admin';
