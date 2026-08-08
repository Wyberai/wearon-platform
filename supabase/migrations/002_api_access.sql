-- WearOn API access — add api_key to profiles + plan check for 'api' tier

-- Allow 'api' as a valid plan value
alter table profiles drop constraint if exists profiles_plan_check;
alter table profiles add constraint profiles_plan_check
  check (plan in ('free','starter','growth','pro','enterprise','api'));

-- API key column (unique per user, generated on signup)
alter table profiles add column if not exists
  api_key text unique default null;

-- Index for fast API key lookup
create index if not exists profiles_api_key_idx on profiles(api_key) where api_key is not null;

-- RPC: increment try_ons_used safely
create or replace function increment_try_ons(user_id uuid, amount integer default 1)
returns void
language sql
security definer
as $$
  update profiles
  set try_ons_used = try_ons_used + amount
  where id = user_id;
$$;

-- RPC: generate a fresh API key for a user (call from admin/signup flow)
create or replace function generate_api_key(user_id uuid)
returns text
language plpgsql
security definer
as $$
declare
  new_key text;
begin
  new_key := 'weon_live_' || encode(gen_random_bytes(24), 'hex');
  update profiles set api_key = new_key where id = user_id;
  return new_key;
end;
$$;
