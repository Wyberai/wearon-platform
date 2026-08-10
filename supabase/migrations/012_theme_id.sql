-- Store theme: bundles color palette + font + layout into one named preset.
-- Sellers still get full color/font override via existing columns; theme_id
-- just picks sane defaults for those and selects a layout mode (see
-- src/lib/themes.ts for the registry).
alter table tenant_config add column if not exists theme_id text not null default 'editorial';
