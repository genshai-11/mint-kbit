-- Harden legacy update_updated_at helper search_path
-- Created: 2026-06-19 21:03 GMT+7

create or replace function public.update_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
