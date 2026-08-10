-- WearOn Platform — WhatsApp automation + multi-channel inbox
--
-- WhatsApp goes through Meta's Cloud API directly (one shared WhatsApp
-- Business Account under the platform's own Meta Business Manager), not a
-- third-party BSP — keeps per-seller marginal cost near zero. Each seller
-- gets a phone_number_id under that shared WABA, assigned by the platform
-- owner in /platform (self-serve number onboarding is a later iteration).

-- 1. WhatsApp connections (one per seller — which number they've been assigned)
create table if not exists whatsapp_connections (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null unique,
  waba_id text not null,
  phone_number_id text not null unique,
  display_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. WhatsApp conversations (one per unique buyer phone number per seller)
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

-- 3. WhatsApp messages
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

-- 4. WhatsApp agent config (per seller) — mirrors instagram_agent_config
create table if not exists whatsapp_agent_config (
  seller_id uuid primary key references profiles(id) on delete cascade,
  mode text default 'suggest' check (mode in ('suggest', 'auto', 'off')),
  brand_voice text default 'friendly, warm, and helpful',
  auto_keywords text[] default array['price', 'cost', 'rate', 'kitna', 'size', 'available', 'stock', 'order', 'buy', 'cod', 'deliver', 'shipping'],
  escalation_keywords text[] default array['refund', 'cancel', 'complaint', 'damaged', 'wrong', 'return'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Multi-channel inbox: tag Instagram conversations/messages with a channel
-- so Messenger events (same connected Page, same webhook) can share the same
-- tables instead of a parallel Facebook-specific schema.
alter table instagram_conversations add column if not exists channel text not null default 'instagram' check (channel in ('instagram', 'messenger'));
alter table instagram_messages add column if not exists intent text check (intent in ('sales', 'support', 'other'));

-- 6. RLS
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
