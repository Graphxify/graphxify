update public.app_roles
set default_permissions = default_permissions - 'activity.view',
    updated_at = now()
where default_permissions ? 'activity.view';

update public.profiles
set permissions = permissions - 'activity.view'
where permissions ? 'activity.view';

delete from public.audit_logs
where action not in ('testimonial.snapshot', 'testimonial.metrics.snapshot');
