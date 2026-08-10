-- ============================================================================
-- WearOn Platform — combined migrations 001–010, for pasting into the
-- Supabase SQL Editor in one run. Same content as the individual files in
-- this folder — this is just a convenience concatenation, not a new migration.
-- ============================================================================

-- ============================================================================
-- 001_initial.sql — Initial Schema
-- ============================================================================

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


-- ============================================================================
-- 002_api_access.sql — API access
-- ============================================================================

alter table profiles drop constraint if exists profiles_plan_check;
alter table profiles add constraint profiles_plan_check
  check (plan in ('free','starter','growth','pro','enterprise','api'));

alter table profiles add column if not exists
  api_key text unique default null;

create index if not exists profiles_api_key_idx on profiles(api_key) where api_key is not null;

create or replace function increment_try_ons(user_id uuid, amount integer default 1)
returns void
language sql
security definer
as $$
  update profiles
  set try_ons_used = try_ons_used + amount
  where id = user_id;
$$;

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


-- ============================================================================
-- 003_growth_features.sql — Growth Features
-- ============================================================================

create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  device_token text not null,
  product_id uuid not null references products(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(device_token, product_id)
);
create index if not exists wishlists_device_idx on wishlists(device_token);

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

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  token text not null,
  platform text not null default 'fcm' check (platform in ('fcm','apns')),
  created_at timestamptz not null default now(),
  unique(seller_id, token)
);

create table if not exists domain_verifications (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  domain text not null,
  verification_token text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(seller_id)
);

create table if not exists apk_builds (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','building','complete','failed')),
  apk_url text,
  build_log text,
  triggered_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table products add column if not exists meshy_job_id text;
alter table products add column if not exists mesh_url text;
alter table products add column if not exists stock_count integer;

alter table orders add column if not exists razorpay_order_id text;
alter table orders add column if not exists razorpay_payment_id text;
alter table orders add column if not exists buyer_name text;
alter table orders add column if not exists buyer_phone text;
alter table orders add column if not exists size_selected text;
alter table orders add column if not exists delivery_address text;

alter table wishlists enable row level security;
alter table reviews enable row level security;
alter table push_subscriptions enable row level security;
alter table domain_verifications enable row level security;
alter table apk_builds enable row level security;

create policy "service role all wishlists" on wishlists for all to service_role using (true) with check (true);
create policy "service role all reviews" on reviews for all to service_role using (true) with check (true);
create policy "service role all push_subscriptions" on push_subscriptions for all to service_role using (true) with check (true);
create policy "service role all domain_verifications" on domain_verifications for all to service_role using (true) with check (true);
create policy "service role all apk_builds" on apk_builds for all to service_role using (true) with check (true);

create policy "anon read reviews" on reviews for select to anon using (true);
create policy "anon insert reviews" on reviews for insert to anon with check (true);
create policy "anon read wishlists" on wishlists for select to anon using (true);
create policy "anon insert wishlists" on wishlists for insert to anon with check (true);
create policy "anon delete wishlists" on wishlists for delete to anon using (true);

create or replace function grant_referral_credit(referrer_id uuid, referred_id uuid)
returns void language plpgsql security definer as $$
begin
  update profiles set try_ons_limit = try_ons_limit + 200 where id = referrer_id;
  update profiles set referred_by = referrer_id where id = referred_id and referred_by is null;
end;
$$;


-- ============================================================================
-- 004_instagram_dm.sql — Instagram DM Integration
-- ============================================================================

create table if not exists instagram_connections (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null unique,
  ig_business_account_id text not null,
  ig_username text,
  page_id text not null,
  page_name text,
  page_access_token text not null,
  token_expires_at timestamptz,
  webhook_subscribed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists instagram_conversations (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null,
  ig_sender_id text not null,
  ig_sender_name text,
  ig_sender_username text,
  last_message_at timestamptz default now(),
  last_message_preview text,
  unread_count int default 0,
  status text default 'open' check (status in ('open', 'resolved', 'archived')),
  created_at timestamptz default now(),
  unique(seller_id, ig_sender_id)
);
create index if not exists ig_conversations_seller_idx on instagram_conversations(seller_id, last_message_at desc);

create table if not exists instagram_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references instagram_conversations(id) on delete cascade not null,
  seller_id uuid references profiles(id) on delete cascade not null,
  ig_message_id text unique,
  direction text not null check (direction in ('inbound', 'outbound')),
  content text not null,
  is_ai_generated boolean default false,
  is_sent boolean default true,
  sent_at timestamptz not null,
  created_at timestamptz default now()
);
create index if not exists ig_messages_conv_idx on instagram_messages(conversation_id, sent_at asc);

create table if not exists instagram_agent_config (
  seller_id uuid primary key references profiles(id) on delete cascade,
  mode text default 'suggest' check (mode in ('suggest', 'auto', 'off')),
  brand_voice text default 'friendly, warm, and helpful',
  auto_keywords text[] default array['price', 'cost', 'rate', 'kitna', 'size', 'available', 'stock', 'order', 'buy', 'cod', 'deliver', 'shipping'],
  escalation_keywords text[] default array['refund', 'cancel', 'complaint', 'damaged', 'wrong', 'return'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table instagram_connections enable row level security;
alter table instagram_conversations enable row level security;
alter table instagram_messages enable row level security;
alter table instagram_agent_config enable row level security;

create policy "service role all ig_connections" on instagram_connections for all to service_role using (true) with check (true);
create policy "service role all ig_conversations" on instagram_conversations for all to service_role using (true) with check (true);
create policy "service role all ig_messages" on instagram_messages for all to service_role using (true) with check (true);
create policy "service role all ig_agent_config" on instagram_agent_config for all to service_role using (true) with check (true);

create policy "seller owns ig_connections" on instagram_connections for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns ig_conversations" on instagram_conversations for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns ig_messages" on instagram_messages for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns ig_agent_config" on instagram_agent_config for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());

create table if not exists seller_deployments (
  id uuid primary key default gen_random_uuid(),
  seller_name text not null,
  seller_email text not null unique,
  domain text,
  supabase_project_ref text,
  supabase_project_url text,
  supabase_anon_key text,
  vercel_project_id text,
  vercel_project_url text,
  plan text default 'free',
  provisioned_at timestamptz default now(),
  status text default 'provisioning' check (status in ('provisioning', 'active', 'suspended')),
  notes text
);

alter table seller_deployments enable row level security;
create policy "service role all deployments" on seller_deployments for all to service_role using (true) with check (true);


-- ============================================================================
-- 005_ai_tryon.sql — AI Try-On & Model Shot
-- ============================================================================

alter table profiles add column if not exists ai_credits int not null default 0;

create table if not exists ai_model_shots (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade,
  garment_image_url text not null,
  preset_model_key text,
  result_image_url text,
  result_video_url text,
  higgsfield_request_id text,
  fal_request_id text,
  status text default 'pending' check (status in ('pending', 'generating_image', 'generating_video', 'completed', 'failed')),
  output_type text default 'image' check (output_type in ('image', 'video', 'both')),
  credits_used int default 0,
  error_message text,
  created_at timestamptz default now(),
  completed_at timestamptz
);
create index if not exists ai_shots_seller_idx on ai_model_shots(seller_id, created_at desc);
create index if not exists ai_shots_product_idx on ai_model_shots(product_id);

create table if not exists buyer_tryons (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade,
  garment_image_url text not null,
  buyer_image_temp_url text,
  result_image_url text,
  result_video_url text,
  higgsfield_request_id text,
  fal_request_id text,
  status text default 'pending' check (status in ('pending', 'generating_image', 'generating_video', 'completed', 'failed')),
  output_type text default 'both' check (output_type in ('image', 'video', 'both')),
  credits_used int default 0,
  error_message text,
  created_at timestamptz default now(),
  completed_at timestamptz
);
create index if not exists buyer_tryons_seller_idx on buyer_tryons(seller_id, created_at desc);

create table if not exists ai_credit_transactions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null,
  amount int not null,
  reason text not null,
  reference_id uuid,
  balance_after int not null,
  created_at timestamptz default now()
);
create index if not exists ai_txn_seller_idx on ai_credit_transactions(seller_id, created_at desc);

alter table ai_model_shots enable row level security;
alter table buyer_tryons enable row level security;
alter table ai_credit_transactions enable row level security;

create policy "service role all ai_model_shots" on ai_model_shots for all to service_role using (true) with check (true);
create policy "service role all buyer_tryons" on buyer_tryons for all to service_role using (true) with check (true);
create policy "service role all ai_credit_transactions" on ai_credit_transactions for all to service_role using (true) with check (true);

create policy "seller owns ai_model_shots" on ai_model_shots for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns buyer_tryons" on buyer_tryons for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns ai_credit_transactions" on ai_credit_transactions for select to authenticated using (seller_id = auth.uid());

create or replace function deduct_ai_credits(
  p_seller_id uuid,
  p_amount int,
  p_reason text,
  p_reference_id uuid default null
)
returns int
language plpgsql security definer as $$
declare
  v_current int;
  v_new int;
begin
  select ai_credits into v_current from profiles where id = p_seller_id for update;
  if v_current < p_amount then return -1; end if;
  v_new := v_current - p_amount;
  update profiles set ai_credits = v_new where id = p_seller_id;
  insert into ai_credit_transactions(seller_id, amount, reason, reference_id, balance_after)
    values (p_seller_id, -p_amount, p_reason, p_reference_id, v_new);
  return v_new;
end;
$$;

create or replace function grant_ai_credits(
  p_seller_id uuid,
  p_amount int,
  p_reason text
)
returns int
language plpgsql security definer as $$
declare
  v_new int;
begin
  update profiles set ai_credits = ai_credits + p_amount where id = p_seller_id returning ai_credits into v_new;
  insert into ai_credit_transactions(seller_id, amount, reason, balance_after)
    values (p_seller_id, p_amount, p_reason, v_new);
  return v_new;
end;
$$;


-- ============================================================================
-- 006_whatsapp_and_channels.sql — WhatsApp automation + multi-channel inbox
-- ============================================================================

create table if not exists whatsapp_connections (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null unique,
  waba_id text not null,
  phone_number_id text not null unique,
  display_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null,
  buyer_phone text not null,
  buyer_name text,
  last_message_at timestamptz default now(),
  last_message_preview text,
  unread_count int default 0,
  status text default 'open' check (status in ('open', 'resolved', 'archived')),
  created_at timestamptz default now(),
  unique(seller_id, buyer_phone)
);
create index if not exists wa_conversations_seller_idx on whatsapp_conversations(seller_id, last_message_at desc);

create table if not exists whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references whatsapp_conversations(id) on delete cascade not null,
  seller_id uuid references profiles(id) on delete cascade not null,
  wa_message_id text unique,
  direction text not null check (direction in ('inbound', 'outbound')),
  content text not null,
  is_ai_generated boolean default false,
  is_sent boolean default true,
  intent text check (intent in ('sales', 'support', 'other')),
  sent_at timestamptz not null,
  created_at timestamptz default now()
);
create index if not exists wa_messages_conv_idx on whatsapp_messages(conversation_id, sent_at asc);

create table if not exists whatsapp_agent_config (
  seller_id uuid primary key references profiles(id) on delete cascade,
  mode text default 'suggest' check (mode in ('suggest', 'auto', 'off')),
  brand_voice text default 'friendly, warm, and helpful',
  auto_keywords text[] default array['price', 'cost', 'rate', 'kitna', 'size', 'available', 'stock', 'order', 'buy', 'cod', 'deliver', 'shipping'],
  escalation_keywords text[] default array['refund', 'cancel', 'complaint', 'damaged', 'wrong', 'return'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table instagram_conversations add column if not exists channel text not null default 'instagram' check (channel in ('instagram', 'messenger'));
alter table instagram_messages add column if not exists intent text check (intent in ('sales', 'support', 'other'));

alter table whatsapp_connections enable row level security;
alter table whatsapp_conversations enable row level security;
alter table whatsapp_messages enable row level security;
alter table whatsapp_agent_config enable row level security;

create policy "service role all wa_connections" on whatsapp_connections for all to service_role using (true) with check (true);
create policy "service role all wa_conversations" on whatsapp_conversations for all to service_role using (true) with check (true);
create policy "service role all wa_messages" on whatsapp_messages for all to service_role using (true) with check (true);
create policy "service role all wa_agent_config" on whatsapp_agent_config for all to service_role using (true) with check (true);

create policy "seller owns wa_connections" on whatsapp_connections for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns wa_conversations" on whatsapp_conversations for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns wa_messages" on whatsapp_messages for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns wa_agent_config" on whatsapp_agent_config for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());


-- ============================================================================
-- 007_margins.sql — Margin Tracking
-- ============================================================================

alter table products add column if not exists cost_price_inr integer;


-- ============================================================================
-- 008_support_automation.sql — Support automation
-- ============================================================================

alter table tenant_config add column if not exists faq_policy text;


-- ============================================================================
-- 009_content.sql — Content upload + manual publish
-- ============================================================================

create table if not exists content_posts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  caption text,
  platforms text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'publishing', 'published', 'failed')),
  external_post_ids jsonb default '{}',
  source text default 'uploaded' check (source in ('uploaded', 'ai_studio')),
  ai_model_shot_id uuid references ai_model_shots(id) on delete set null,
  error_message text,
  published_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists content_posts_seller_idx on content_posts(seller_id, created_at desc);

alter table content_posts enable row level security;
create policy "service role all content_posts" on content_posts for all to service_role using (true) with check (true);
create policy "seller owns content_posts" on content_posts for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());


-- ============================================================================
-- 010_ai_reply_quota.sql — AI reply quota
-- ============================================================================

alter table profiles add column if not exists ai_replies_used integer not null default 0;
alter table profiles add column if not exists ai_reply_limit integer not null default 50;

create or replace function deduct_ai_reply(p_seller_id uuid)
returns boolean language plpgsql security definer as $$
declare
  v_used integer;
  v_limit integer;
begin
  select ai_replies_used, ai_reply_limit into v_used, v_limit
  from profiles where id = p_seller_id for update;
  if v_used >= v_limit then return false; end if;
  update profiles set ai_replies_used = ai_replies_used + 1 where id = p_seller_id;
  return true;
end;
$$;
