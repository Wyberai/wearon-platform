-- Pillar 4c: Shipping address + order tracking
-- Run in Supabase SQL Editor

alter table orders
  add column if not exists shipping_address jsonb default null,
  add column if not exists tracking_number text default null,
  add column if not exists tracking_url text default null,
  add column if not exists shipped_at timestamptz default null;

comment on column orders.shipping_address is
  'Buyer shipping address: { name, line1, line2?, city, state, pincode, country }';
