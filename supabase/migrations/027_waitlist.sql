-- Pre-launch waitlist — separate from the live free signup flow on purpose
-- (confirmed with the founder): a lighter "join the waitlist" ask to build
-- a list to nurture/announce to, without pushing early traffic straight
-- into the live product before the founder is ready to formally launch.

create table waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  instagram_handle text,
  source text,
  created_at timestamptz not null default now()
);

create index waitlist_signups_created_at_idx on waitlist_signups(created_at);

alter table waitlist_signups enable row level security;

create policy "service role all waitlist_signups" on waitlist_signups
  for all to service_role using (true) with check (true);
