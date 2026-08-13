-- Pillar 4b: Discount codes
-- Run in Supabase SQL Editor

create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  code text not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  min_order_inr numeric(10,2) default null,
  max_uses int default null,
  uses_count int not null default 0,
  expires_at timestamptz default null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(seller_id, code)
);

create index if not exists discount_codes_seller_idx on discount_codes(seller_id, is_active);

alter table discount_codes enable row level security;

create policy "Sellers manage own discounts"
  on discount_codes for all
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

-- Track which discount was applied to each order
alter table orders
  add column if not exists discount_code text default null,
  add column if not exists discount_amount_inr numeric(10,2) default null;
