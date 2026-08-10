-- WearOn Platform — Landing page lead capture
--
-- Captures email + requested brand name from the "see how your store would
-- look" flow on the landing page. Deliberately no password/account creation
-- at this step — the preview that follows is unauthenticated, reusing the
-- seeded demo dataset with the visitor's name swapped in. Converting a lead
-- into a real account is a separate, later step (real signup flow).

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  brand_name text not null,
  source text default 'landing_preview',
  created_at timestamptz not null default now()
);
create index if not exists leads_created_idx on leads(created_at desc);
create index if not exists leads_email_idx on leads(email);

alter table leads enable row level security;
create policy "service role all leads" on leads for all to service_role using (true) with check (true);
