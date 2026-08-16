-- The buyer app is built per-seller (own branding/package name baked in at
-- build time). The seller app is a single shared build (one APK, /admin
-- resolves per logged-in user via cookie session — see wearon-seller-app's
-- AdminWebView.tsx) — app_type distinguishes the two build types sharing
-- this one table.
alter table apk_builds add column if not exists app_type text not null default 'buyer' check (app_type in ('buyer', 'seller'));

create index if not exists apk_builds_app_type_idx on apk_builds(app_type, status);
