-- Harden KBIT membership helper functions and legacy open registration policy
-- Created: 2026-06-19 21:03 GMT+7

create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

create or replace function private.can_access_document(doc_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.documents d
    join public.tiers rt on rt.id = d.required_tier_id
    left join public.members m on m.profile_id = auth.uid()
    left join public.tiers mt on mt.id = m.tier_id
    where d.id = doc_id
      and d.published = true
      and m.status = 'active'
      and (m.is_lifetime or m.expires_at is null or m.expires_at > now())
      and mt.rank >= rt.rank
      and (d.required_plan_id is null or d.required_plan_id = m.plan_id)
      and (d.life_only = false or m.is_lifetime = true)
  )
$$;

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
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    case when exists (select 1 from public.admin_email_allowlist where lower(email) = lower(new.email)) then 'admin'::public.profile_role else 'member'::public.profile_role end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    role = case when exists (select 1 from public.admin_email_allowlist where lower(email) = lower(new.email)) then 'admin'::public.profile_role else public.profiles.role end,
    updated_at = now();
  return new;
end;
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.can_access_document(uuid) from public;
revoke all on function private.handle_new_user_profile() from public;
grant execute on function private.is_admin() to anon, authenticated, service_role;
grant execute on function private.can_access_document(uuid) to anon, authenticated, service_role;
grant execute on function private.handle_new_user_profile() to service_role;

drop trigger if exists on_auth_user_created_kbit_profile on auth.users;
create trigger on_auth_user_created_kbit_profile
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function private.handle_new_user_profile();

-- Recreate membership policies to call helpers from private schema, which is not exposed as an API schema.
drop policy if exists "Admins manage allowlist" on public.admin_email_allowlist;
create policy "Admins manage allowlist" on public.admin_email_allowlist for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select using (id = auth.uid() or private.is_admin());
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update using (id = auth.uid() or private.is_admin()) with check (id = auth.uid() or private.is_admin());
drop policy if exists "Admins insert profiles" on public.profiles;
create policy "Admins insert profiles" on public.profiles for insert with check (private.is_admin());

drop policy if exists "Anyone reads tiers" on public.tiers;
create policy "Anyone reads tiers" on public.tiers for select using (true);
drop policy if exists "Admins manage tiers" on public.tiers;
create policy "Admins manage tiers" on public.tiers for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists "Anyone reads active membership plans" on public.membership_plans;
create policy "Anyone reads active membership plans" on public.membership_plans for select using (active = true or private.is_admin());
drop policy if exists "Admins manage membership plans" on public.membership_plans;
create policy "Admins manage membership plans" on public.membership_plans for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists "Members read own membership" on public.members;
create policy "Members read own membership" on public.members for select using (profile_id = auth.uid() or private.is_admin());
drop policy if exists "Admins manage members" on public.members;
create policy "Admins manage members" on public.members for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists "Admins read applications" on public.membership_applications;
create policy "Admins read applications" on public.membership_applications for select using (private.is_admin());
drop policy if exists "Admins update applications" on public.membership_applications;
create policy "Admins update applications" on public.membership_applications for update using (private.is_admin()) with check (private.is_admin());
drop policy if exists "Admins insert applications" on public.membership_applications;
create policy "Admins insert applications" on public.membership_applications for insert with check (private.is_admin());

drop policy if exists "Members read entitled documents" on public.documents;
create policy "Members read entitled documents" on public.documents for select using (private.is_admin() or private.can_access_document(id));
drop policy if exists "Admins manage documents" on public.documents;
create policy "Admins manage documents" on public.documents for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists "Members read own downloads" on public.document_downloads;
create policy "Members read own downloads" on public.document_downloads for select using (member_id = auth.uid() or private.is_admin());
drop policy if exists "Members insert own downloads" on public.document_downloads;
create policy "Members insert own downloads" on public.document_downloads for insert with check (member_id = auth.uid() or private.is_admin());
drop policy if exists "Admins manage downloads" on public.document_downloads;
create policy "Admins manage downloads" on public.document_downloads for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists "Admins read audit log" on public.audit_log;
create policy "Admins read audit log" on public.audit_log for select using (private.is_admin());
drop policy if exists "Admins insert audit log" on public.audit_log;
create policy "Admins insert audit log" on public.audit_log for insert with check (private.is_admin());

-- Remove unrestricted legacy public insert path; new applications go through submit-membership-application.
drop policy if exists "Public can submit registration" on public.registration_requests;

-- Prevent direct RPC execution of public SECURITY DEFINER compatibility functions.
revoke all on function public.is_admin() from anon, authenticated, public;
revoke all on function public.can_access_document(uuid) from anon, authenticated, public;
revoke all on function public.handle_new_user_profile() from anon, authenticated, public;
