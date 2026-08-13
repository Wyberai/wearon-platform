-- Pillar 2c: AI Buyer / Seasonal Editor — store collections
-- Run in Supabase SQL Editor

create table if not exists store_collections (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  editorial_copy jsonb default null, -- { intro: string, product_captions: { [product_id]: string } }
  product_ids uuid[] not null default '{}',
  hero_image_url text,
  occasion_tags text[] default '{}',
  is_featured boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists store_collections_seller_id_idx on store_collections(seller_id);
create index if not exists store_collections_featured_idx on store_collections(seller_id, is_featured) where is_featured = true;

alter table store_collections enable row level security;

create policy "Sellers manage own collections"
  on store_collections for all
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

-- Public read for storefront
create policy "Public read featured collections"
  on store_collections for select
  using (true);

comment on table store_collections is 'AI-curated product collections (seasonal edits, occasion drops) for each store.';
