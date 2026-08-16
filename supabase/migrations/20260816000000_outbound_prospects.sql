-- Outbound CRM — cold Instagram-seller prospects sourced via hashtag scraping
-- (Apify), distinct from the `leads` table (011/013), which is inbound site
-- visitors. Prospects here are never signed up, never visited the site —
-- they're candidates for WhatsApp outreach and Meta Custom Audience export,
-- segmented by detected language/state since outreach and ad copy both need
-- to match the seller's actual regional language.

create table if not exists outbound_prospects (
  id uuid primary key default gen_random_uuid(),
  instagram_username text not null unique,
  full_name text,
  phone text,
  email text,
  bio text,
  detected_language text,
  detected_city text,
  detected_state text,
  source_hashtag text,
  source_post_url text,
  status text not null default 'new',
  whatsapp_template_sent text,
  last_contacted_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists outbound_prospects_status_idx on outbound_prospects(status);
create index if not exists outbound_prospects_language_idx on outbound_prospects(detected_language);
create index if not exists outbound_prospects_state_idx on outbound_prospects(detected_state);

alter table outbound_prospects enable row level security;
create policy "service role all outbound_prospects" on outbound_prospects for all to service_role using (true) with check (true);
