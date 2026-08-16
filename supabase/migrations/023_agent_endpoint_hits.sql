-- Track AI-agent hits on the static discovery endpoints (openapi.json, feed.json).
-- Unlike /mcp (only ever called by an agent client), these are plain GET
-- endpoints any browser could hit, so we only log requests whose user-agent
-- matches a known agent/crawler pattern (see src/lib/agent-tracking.ts).
create table if not exists agent_endpoint_hits (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  endpoint text not null check (endpoint in ('openapi', 'feed')),
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists agent_endpoint_hits_seller_id_idx on agent_endpoint_hits(seller_id, created_at desc);

alter table agent_endpoint_hits enable row level security;

create policy "Sellers view own agent endpoint hits"
  on agent_endpoint_hits for select
  using (seller_id = auth.uid());
