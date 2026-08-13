-- Pillar 3a: Conversational checkout state for WhatsApp DM flow
-- Run in Supabase SQL Editor

alter table whatsapp_conversations
  add column if not exists pending_checkout jsonb default null;

comment on column whatsapp_conversations.pending_checkout is
  'DM checkout flow state: { state: awaiting_size|link_sent, product_id, product_name, price_inr, sizes[] }';
