-- Set your first admin after signup (Option A)
-- Replace the email value before executing.

update public.profiles
set
  role = 'admin',
  role_id = 1
where email = 'founder@graphxify.com';

-- Optional safety check
select id, email, role from public.profiles where role = 'admin';
