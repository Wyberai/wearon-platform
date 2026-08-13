-- Pillar 1b + 5c: AEO content on products + agent source tracking on orders
-- Run in Supabase SQL Editor

-- AEO (Answer Engine Optimization) content per product
alter table products
  add column if not exists aeo_content jsonb default null;

comment on column products.aeo_content is
  'AI-generated agent-answer content: { agent_answer: string, faqs: [{q, a}], generated_at: iso8601 }';

-- Agent source tracking on orders
alter table orders
  add column if not exists source text default ''human'' check (source in (''human'', ''mcp'', ''openapi'', ''whatsapp'', ''instagram''));

-- Query log for AI agent traffic dashboard
create table if not exists agent_queries (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  source text not null check (source in (''mcp'', ''openapi'')),
  tool text not null,
  query_text text,
  result_count int default 0,
  created_at timestamptz not null default now()
);

create index if not exists agent_queries_seller_id_idx on agent_queries(seller_id, created_at desc);

alter table agent_queries enable row level security;

create policy "Sellers view own agent queries"
  on agent_queries for select
  using (seller_id = auth.uid());
