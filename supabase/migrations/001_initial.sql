-- WearOn Platform — Initial Schema

-- Seller profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  plan text not null default 'free' check (plan in ('free','starter','growth','pro','enterprise')),
  try_ons_used integer not null default 0,
  try_ons_limit integer not null default 20,
  referral_code text unique default lower(substring(md5(random()::text), 1, 8)),
  referred_by uuid references profiles(id),
  whatsapp_number text,
  subscription_status text not null default 'inactive' check (subscription_status in ('active','inactive','cancelled','past_due')),
  dodo_subscription_id text,
  dodo_customer_id text,
  created_at timestamptz not null default now()
);

-- Tenant branding & config
create table tenant_config (
  seller_id uuid primary key references profiles(id) on delete cascade,
  slug text unique not null,
  brand_name text not null,
  tagline text,
  logo_url text,
  favicon_url text,
  primary_color text not null default '#E91E63',
  secondary_color text not null default '#FCE4EC',
  accent_color text not null default '#880E4F',
  background_color text not null default '#FFFFFF',
  font_family text not null default 'poppins' check (font_family in ('poppins','playfair','inter','nunito','raleway')),
  dark_mode_default boolean not null default false,
  currency text not null default 'INR',
  payment_method text not null default 'whatsapp_order' check (payment_method in ('whatsapp_order','razorpay','dodo','cod')),
  payment_config jsonb default '{}',
  whatsapp_number text,
  instagram_handle text,
  try_on_enabled boolean not null default true,
  reviews_enabled boolean not null default true,
  wishlist_enabled boolean not null default true,
  categories jsonb default '["Kurtas","Sarees","Lehengas","Western","Accessories"]',
  size_guide_url text,
  banners jsonb default '[]',
  custom_domain text,
  play_store_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  category text,
  price_inr integer not null,
  original_price_inr integer,
  garment_image_url text not null,
  garment_preprocessed_url text,
  slug text not null,
  is_active boolean not null default true,
  sizes text[] default '{}',
  colors text[] default '{}',
  stock_by_variant jsonb default '{}',
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  unique(seller_id, slug)
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  position integer not null default 0,
  is_primary boolean not null default false
);

-- Buyer sessions (anonymous, device-token based)
create table buyer_sessions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  device_token text not null,
  whatsapp_number text,
  created_at timestamptz not null default now(),
  unique(seller_id, device_token)
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  buyer_session_id uuid references buyer_sessions(id),
  status text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  items jsonb not null default '[]',
  total_inr integer not null,
  payment_method text not null default 'whatsapp_order',
  payment_id text,
  whatsapp_confirmed boolean not null default false,
  buyer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Try-on results
create table try_on_results (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  buyer_session_id uuid references buyer_sessions(id),
  result_image_url text,
  hd_result_url text,
  cache_key text unique,
  processing_ms integer,
  model_version text not null default 'catvton-base',
  status text not null default 'pending' check (status in ('pending','processing','done','failed')),
  error_message text,
  whatsapp_clicked boolean not null default false,
  created_at timestamptz not null default now()
);

-- Analytics
create table daily_analytics (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  date date not null,
  store_visits integer not null default 0,
  try_ons integer not null default 0,
  whatsapp_clicks integer not null default 0,
  orders_placed integer not null default 0,
  revenue_inr integer not null default 0,
  unique(seller_id, date)
);

-- Idempotency for webhooks
create table processed_webhooks (
  id text primary key,
  source text not null,
  processed_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;
alter table tenant_config enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table buyer_sessions enable row level security;
alter table orders enable row level security;
alter table try_on_results enable row level security;
alter table daily_analytics enable row level security;

-- Profiles: sellers see only their own
create policy "seller own profile" on profiles for all using (auth.uid() = id);

-- Tenant config: sellers manage their own; public can read by slug (via service role)
create policy "seller own config" on tenant_config for all using (auth.uid() = seller_id);

-- Products: sellers manage their own; service role reads all (for public storefront)
create policy "seller own products" on products for all using (auth.uid() = seller_id);
create policy "public read active products" on products for select using (is_active = true);

-- Product images: follow product ownership
create policy "seller own product images" on product_images for all
  using (exists (select 1 from products p where p.id = product_images.product_id and p.seller_id = auth.uid()));
create policy "public read product images" on product_images for select using (true);

-- Buyer sessions: service role only
create policy "seller see buyer sessions" on buyer_sessions for select using (auth.uid() = seller_id);

-- Orders: sellers see their own
create policy "seller own orders" on orders for select using (auth.uid() = seller_id);
create policy "seller update orders" on orders for update using (auth.uid() = seller_id);

-- Try-on results: sellers see their own; service role inserts
create policy "seller see tryon results" on try_on_results for select using (auth.uid() = seller_id);

-- Analytics
create policy "seller own analytics" on daily_analytics for all using (auth.uid() = seller_id);

-- Functions
create or replace function deduct_try_on(p_seller_id uuid)
returns boolean language plpgsql security definer as $$
declare
  v_used integer;
  v_limit integer;
begin
  select try_ons_used, try_ons_limit into v_used, v_limit
  from profiles where id = p_seller_id for update;
  if v_used >= v_limit then return false; end if;
  update profiles set try_ons_used = try_ons_used + 1 where id = p_seller_id;
  return true;
end;
$$;

create or replace function update_tenant_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger tenant_config_updated_at before update on tenant_config
  for each row execute function update_tenant_updated_at();

-- Indexes
create index on products(seller_id, is_active);
create index on products(seller_id, slug);
create index on try_on_results(cache_key);
create index on daily_analytics(seller_id, date);
create index on orders(seller_id, created_at desc);
