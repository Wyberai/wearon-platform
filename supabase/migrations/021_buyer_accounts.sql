-- Pillar 4e: Buyer accounts (lightweight) + Instagram DM checkout state
-- Run in Supabase SQL Editor

-- Buyer contact info on orders for order-lookup account feature
alter table orders
  add column if not exists buyer_email text default null,
  add column if not exists buyer_phone text default null;

create index if not exists orders_buyer_email_idx on orders(buyer_email) where buyer_email is not null;

comment on column orders.buyer_email is 'Buyer email collected at checkout; used for confirmation email + account order lookup';
comment on column orders.buyer_phone is 'Buyer WhatsApp/phone number when order originated from DM checkout';

-- Pending checkout state for Instagram DM conversational checkout
-- (WhatsApp already has this from migration 017; Instagram conversations need it too)
alter table instagram_conversations
  add column if not exists pending_checkout jsonb default null;

comment on column instagram_conversations.pending_checkout is
  'Transient checkout state: { state: "awaiting_size"|"link_sent", product_id, product_name, price_inr, sizes[], slug }';
