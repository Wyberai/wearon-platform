-- Pillar 4a: Stock per size variant
-- Run in Supabase SQL Editor

alter table products
  add column if not exists stock_by_variant jsonb default null;

comment on column products.stock_by_variant is
  'Stock per size variant: { "S": 5, "M": 3, "L": 0 }. null = in stock (unlimited). 0 = sold out for that size.';
