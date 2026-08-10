-- WearOn Platform — Content upload + manual publish to Instagram/Facebook

create table if not exists content_posts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade not null,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  caption text,
  platforms text[] not null default '{}', -- subset of {'instagram','facebook'}
  status text not null default 'draft' check (status in ('draft', 'publishing', 'published', 'failed')),
  -- one external id per published platform, e.g. {"instagram": "179...", "facebook": "122..."}
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
