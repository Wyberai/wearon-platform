-- Optional video (an imported Instagram Reel) alongside a product's
-- required static image — additive, every existing read/write path that
-- only knows garment_image_url keeps working unchanged.
alter table products add column if not exists garment_video_url text;
