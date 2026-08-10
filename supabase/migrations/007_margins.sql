-- WearOn Platform — Margin Tracking

-- Cost price per product (seller's own COGS input, never shown to buyers)
alter table products add column if not exists cost_price_inr integer;

-- Note: order line items already live in orders.items (jsonb) — no column
-- migration needed there. From this point forward the checkout/order-creation
-- code snapshots each item's cost_price_inr (and computed margin_inr) into
-- that jsonb array at order time, so historical margin stays accurate even if
-- a seller edits a product's cost later.
