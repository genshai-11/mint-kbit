-- KBIT Membership Platform
-- Created: 2026-06-19 20:45 GMT+7

create extension if not exists pgcrypto;

do $$ begin
  create type public.profile_role as enum ('member', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.membership_status as enum ('pending', 'active', 'suspended', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.application_status as enum ('submitted', 'in_review', 'needs_info', 'approved_pending_payment', 'approved_active', 'rejected', 'withdrawn');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('unpaid', 'pending_confirmation', 'paid', 'waived', 'refunded');
exception when duplicate_object then null; end $$;

create table if not exists public.admin_email_allowlist (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admin_email_allowlist (email)
values ('jolly@kbitassociation.com'), ('le.ntmkh@gmail.com')
on conflict (email) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.profile_role not null default 'member',
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tiers (
  id text primary key,
  name text not null,
  rank integer not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.membership_plans (
  id text primary key,
  tier_id text not null references public.tiers(id),
  name text not null,
  duration_months integer,
  price_amount numeric(12,2) not null,
  price_currency text not null default 'USD',
  is_lifetime boolean not null default false,
  slot_limit integer,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint membership_plans_duration_check check (is_lifetime or duration_months is not null)
);

create table if not exists public.members (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  tier_id text not null references public.tiers(id),
  plan_id text references public.membership_plans(id),
  status public.membership_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  is_lifetime boolean not null default false,
  joined_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_email text not null,
  applicant_name text,
  applicant_phone text,
  tier_id text not null references public.tiers(id),
  plan_id text references public.membership_plans(id),
  payload jsonb not null default '{}'::jsonb,
  status public.application_status not null default 'submitted',
  payment_status public.payment_status not null default 'unpaid',
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_notes text
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  required_tier_id text not null references public.tiers(id),
  required_plan_id text references public.membership_plans(id),
  life_only boolean not null default false,
  storage_path text not null unique,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_downloads (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_table text,
  target_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.tiers (id, name, rank) values
  ('standard', 'Standard Member', 10),
  ('professional', 'Professional Member', 20),
  ('strategic', 'Strategic Partner', 30)
on conflict (id) do update set name = excluded.name, rank = excluded.rank;

insert into public.membership_plans (id, tier_id, name, duration_months, price_amount, price_currency, is_lifetime, slot_limit, sort_order) values
  ('standard_6m', 'standard', 'Standard Member — 6 months', 6, 300, 'USD', false, null, 10),
  ('standard_1y', 'standard', 'Standard Member — 1 year', 12, 500, 'USD', false, null, 20),
  ('professional_1y', 'professional', 'Professional Member — 1 year', 12, 700, 'USD', false, null, 30),
  ('professional_life', 'professional', 'Professional Life Member', null, 2000, 'USD', true, null, 40),
  ('strategic_1y', 'strategic', 'Strategic Partner — 1 year', 12, 1000, 'USD', false, null, 50),
  ('strategic_life', 'strategic', 'Strategic Life Partner', null, 3000, 'USD', true, null, 60)
on conflict (id) do update set
  tier_id = excluded.tier_id,
  name = excluded.name,
  duration_months = excluded.duration_months,
  price_amount = excluded.price_amount,
  price_currency = excluded.price_currency,
  is_lifetime = excluded.is_lifetime,
  slot_limit = excluded.slot_limit,
  sort_order = excluded.sort_order,
  updated_at = now();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists membership_plans_touch_updated_at on public.membership_plans;
create trigger membership_plans_touch_updated_at before update on public.membership_plans for each row execute function public.touch_updated_at();
drop trigger if exists members_touch_updated_at on public.members;
create trigger members_touch_updated_at before update on public.members for each row execute function public.touch_updated_at();
drop trigger if exists documents_touch_updated_at on public.documents;
create trigger documents_touch_updated_at before update on public.documents for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer set search_path = public as $$
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

drop trigger if exists on_auth_user_created_kbit_profile on auth.users;
create trigger on_auth_user_created_kbit_profile
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_user_profile();

insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  case when exists (select 1 from public.admin_email_allowlist a where lower(a.email) = lower(u.email)) then 'admin'::public.profile_role else 'member'::public.profile_role end
from auth.users u
where lower(u.email) in ('jolly@kbitassociation.com', 'le.ntmkh@gmail.com')
on conflict (id) do update set role = 'admin', email = excluded.email, updated_at = now();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

create or replace function public.can_access_document(doc_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
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

alter table public.admin_email_allowlist enable row level security;
alter table public.profiles enable row level security;
alter table public.tiers enable row level security;
alter table public.membership_plans enable row level security;
alter table public.members enable row level security;
alter table public.membership_applications enable row level security;
alter table public.documents enable row level security;
alter table public.document_downloads enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists "Admins manage allowlist" on public.admin_email_allowlist;
create policy "Admins manage allowlist" on public.admin_email_allowlist for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
drop policy if exists "Admins insert profiles" on public.profiles;
create policy "Admins insert profiles" on public.profiles for insert with check (public.is_admin());

drop policy if exists "Anyone reads tiers" on public.tiers;
create policy "Anyone reads tiers" on public.tiers for select using (true);
drop policy if exists "Admins manage tiers" on public.tiers;
create policy "Admins manage tiers" on public.tiers for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone reads active membership plans" on public.membership_plans;
create policy "Anyone reads active membership plans" on public.membership_plans for select using (active = true or public.is_admin());
drop policy if exists "Admins manage membership plans" on public.membership_plans;
create policy "Admins manage membership plans" on public.membership_plans for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Members read own membership" on public.members;
create policy "Members read own membership" on public.members for select using (profile_id = auth.uid() or public.is_admin());
drop policy if exists "Admins manage members" on public.members;
create policy "Admins manage members" on public.members for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read applications" on public.membership_applications;
create policy "Admins read applications" on public.membership_applications for select using (public.is_admin());
drop policy if exists "Admins update applications" on public.membership_applications;
create policy "Admins update applications" on public.membership_applications for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins insert applications" on public.membership_applications;
create policy "Admins insert applications" on public.membership_applications for insert with check (public.is_admin());

drop policy if exists "Members read entitled documents" on public.documents;
create policy "Members read entitled documents" on public.documents for select using (public.is_admin() or public.can_access_document(id));
drop policy if exists "Admins manage documents" on public.documents;
create policy "Admins manage documents" on public.documents for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Members read own downloads" on public.document_downloads;
create policy "Members read own downloads" on public.document_downloads for select using (member_id = auth.uid() or public.is_admin());
drop policy if exists "Members insert own downloads" on public.document_downloads;
create policy "Members insert own downloads" on public.document_downloads for insert with check (member_id = auth.uid() or public.is_admin());
drop policy if exists "Admins manage downloads" on public.document_downloads;
create policy "Admins manage downloads" on public.document_downloads for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read audit log" on public.audit_log;
create policy "Admins read audit log" on public.audit_log for select using (public.is_admin());
drop policy if exists "Admins insert audit log" on public.audit_log;
create policy "Admins insert audit log" on public.audit_log for insert with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit)
values ('member-documents', 'member-documents', false, 52428800)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit;
