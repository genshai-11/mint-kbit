-- Fix Supabase Auth invite/profile trigger when no full name metadata is provided
-- Created: 2026-06-20 08:02 GMT+7

create or replace function private.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      nullif(split_part(new.email, '@', 1), ''),
      'KBIT Member'
    ),
    case when exists (select 1 from public.admin_email_allowlist where lower(email) = lower(new.email)) then 'admin'::public.profile_role else 'member'::public.profile_role end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
    role = case when exists (select 1 from public.admin_email_allowlist where lower(email) = lower(new.email)) then 'admin'::public.profile_role else public.profiles.role end,
    updated_at = now();
  return new;
end;
$$;
