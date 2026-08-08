-- WearOn Platform — Instagram DM Integration

-- 1. Instagram connections (one per seller, stores OAuth token + page/IG account info)
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

-- 2. Instagram conversations (one per unique buyer per seller)
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

-- 3. Instagram messages
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

-- 4. Instagram agent config (per seller)
create table if not exists instagram_agent_config (
  seller_id uuid primary key references profiles(id) on delete cascade,
  mode text default 'suggest' check (mode in ('suggest', 'auto', 'off')),
  brand_voice text default 'friendly, warm, and helpful',
  auto_keywords text[] default array['price', 'cost', 'rate', 'kitna', 'size', 'available', 'stock', 'order', 'buy', 'cod', 'deliver', 'shipping'],
  escalation_keywords text[] default array['refund', 'cancel', 'complaint', 'damaged', 'wrong', 'return'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. RLS
alter table instagram_connections enable row level security;
alter table instagram_conversations enable row level security;
alter table instagram_messages enable row level security;
alter table instagram_agent_config enable row level security;

-- Service role gets full access (webhook handler runs as service role)
create policy "service role all ig_connections" on instagram_connections for all to service_role using (true) with check (true);
create policy "service role all ig_conversations" on instagram_conversations for all to service_role using (true) with check (true);
create policy "service role all ig_messages" on instagram_messages for all to service_role using (true) with check (true);
create policy "service role all ig_agent_config" on instagram_agent_config for all to service_role using (true) with check (true);

-- Sellers see only their own data
create policy "seller owns ig_connections" on instagram_connections for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns ig_conversations" on instagram_conversations for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns ig_messages" on instagram_messages for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns ig_agent_config" on instagram_agent_config for all to authenticated using (seller_id = auth.uid()) with check (seller_id = auth.uid());

-- 6. Platform registry (tracks per-seller deployments; stored in platform owner's Supabase)
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

-- Only service role can access the registry (platform console uses admin client)
alter table seller_deployments enable row level security;
create policy "service role all deployments" on seller_deployments for all to service_role using (true) with check (true);
