-- Lead nurture sequence state — tracks which of the 4 weekly emails a
-- landing-page lead has received, so a cron job can pick up where it left
-- off without re-sending or double-sending.
alter table leads add column if not exists theme_id text;
alter table leads add column if not exists sequence_step int not null default 0;
alter table leads add column if not exists last_email_sent_at timestamptz;
alter table leads add column if not exists unsubscribed boolean not null default false;
alter table leads add column if not exists converted boolean not null default false;
