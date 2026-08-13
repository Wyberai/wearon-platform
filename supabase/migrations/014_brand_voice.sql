-- Pillar 2: Brand DNA — store brand voice profile in tenant_config
-- Applied: 2026-08-13
-- Run in Supabase SQL Editor

alter table tenant_config
  add column if not exists brand_voice jsonb default null;

comment on column tenant_config.brand_voice is
  'Structured brand identity: { tone, aesthetic[], buyer_philosophy, occasion_tags[] }. Used by AI to keep all generated content on-brand.';
