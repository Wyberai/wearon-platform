-- WearOn Supabase Storage Buckets
-- Run this in Supabase Dashboard → SQL Editor AFTER running migrations 001, 002, 003

-- 1. Product/garment images (public read, seller-only write)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wearon-assets',
  'wearon-assets',
  true,
  10485760, -- 10 MB
  array['image/jpeg','image/png','image/webp','image/gif']
) on conflict (id) do nothing;

-- 2. Virtual try-on results (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'try-on-results',
  'try-on-results',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp']
) on conflict (id) do nothing;

-- 3. Tenant brand assets — logos, banners (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tenant-assets',
  'tenant-assets',
  true,
  5242880, -- 5 MB
  array['image/jpeg','image/png','image/webp','image/svg+xml']
) on conflict (id) do nothing;

-- RLS policies for wearon-assets
create policy "Public read wearon-assets"
  on storage.objects for select
  using (bucket_id = 'wearon-assets');

create policy "Authenticated sellers upload to wearon-assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'wearon-assets');

create policy "Sellers update own assets"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'wearon-assets' and owner = auth.uid());

create policy "Sellers delete own assets"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'wearon-assets' and owner = auth.uid());

-- RLS policies for try-on-results (service role writes, anyone reads)
create policy "Public read try-on-results"
  on storage.objects for select
  using (bucket_id = 'try-on-results');

create policy "Service role writes try-on-results"
  on storage.objects for insert
  to service_role
  with check (bucket_id = 'try-on-results');

-- RLS policies for tenant-assets
create policy "Public read tenant-assets"
  on storage.objects for select
  using (bucket_id = 'tenant-assets');

create policy "Authenticated sellers upload tenant-assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tenant-assets');

create policy "Sellers update own tenant-assets"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'tenant-assets' and owner = auth.uid());

create policy "Sellers delete own tenant-assets"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'tenant-assets' and owner = auth.uid());
