-- WearOn Platform — Growth Features

-- 1. Wishlists (device-token based, anonymous buyers)
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  device_token text not null,
  product_id uuid not null references products(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(device_token, product_id)
);
create index if not exists wishlists_device_idx on wishlists(device_token);

-- 2. Reviews (device-token based, one per product per device)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  device_token text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 500),
  created_at timestamptz not null default now(),
  unique(device_token, product_id)
);
create index if not exists reviews_product_idx on reviews(product_id);

-- 3. Push subscriptions (FCM / APNS tokens per seller)
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  token text not null,
  platform text not null default 'fcm' check (platform in ('fcm','apns')),
  created_at timestamptz not null default now(),
  unique(seller_id, token)
);

-- 4. Domain verifications (one active domain per seller)
create table if not exists domain_verifications (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  domain text not null,
  verification_token text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(seller_id)
);

-- 5. APK builds (build queue per seller)
create table if not exists apk_builds (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','building','complete','failed')),
  apk_url text,
  build_log text,
  triggered_at timestamptz not null default now(),
  completed_at timestamptz
);

-- 6. Additional columns on products (3D mesh support + stock)
alter table products add column if not exists meshy_job_id text;
alter table products add column if not exists mesh_url text;
alter table products add column if not exists stock_count integer;

-- 7. Additional columns on orders (Razorpay + buyer info)
alter table orders add column if not exists razorpay_order_id text;
alter table orders add column if not exists razorpay_payment_id text;
alter table orders add column if not exists buyer_name text;
alter table orders add column if not exists buyer_phone text;
alter table orders add column if not exists size_selected text;
alter table orders add column if not exists delivery_address text;

-- 8. RLS on all new tables

alter table wishlists enable row level security;
alter table reviews enable row level security;
alter table push_subscriptions enable row level security;
alter table domain_verifications enable row level security;
alter table apk_builds enable row level security;

-- Service role bypass (full access for backend operations)
create policy "service role all wishlists" on wishlists for all to service_role using (true) with check (true);
create policy "service role all reviews" on reviews for all to service_role using (true) with check (true);
create policy "service role all push_subscriptions" on push_subscriptions for all to service_role using (true) with check (true);
create policy "service role all domain_verifications" on domain_verifications for all to service_role using (true) with check (true);
create policy "service role all apk_builds" on apk_builds for all to service_role using (true) with check (true);

-- Anon buyers can read and write reviews and wishlists
create policy "anon read reviews" on reviews for select to anon using (true);
create policy "anon insert reviews" on reviews for insert to anon with check (true);
create policy "anon read wishlists" on wishlists for select to anon using (true);
create policy "anon insert wishlists" on wishlists for insert to anon with check (true);
create policy "anon delete wishlists" on wishlists for delete to anon using (true);

-- 9. RPC: grant referral credit to both parties
create or replace function grant_referral_credit(referrer_id uuid, referred_id uuid)
returns void language plpgsql security definer as $$
begin
  -- Give referrer 200 extra try-ons
  update profiles set try_ons_limit = try_ons_limit + 200 where id = referrer_id;
  -- Set referred_by on new user
  update profiles set referred_by = referrer_id where id = referred_id and referred_by is null;
end;
$$;
