-- Founder-fulfilled change requests (design/product/mobile-app tweaks a
-- seller asks Instastarz to hand-build, distinct from self-serve dashboard
-- edits). Counted per calendar month against PLAN_CHANGE_REQUEST_LIMITS in
-- constants.ts; requests past the free monthly allowance are flagged
-- billable at CHANGE_REQUEST_OVERAGE_PRICE_INR (₹500), collected manually
-- for now (no automated one-time-charge flow yet).

create table change_requests (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  request_type text not null default 'design' check (request_type in ('design', 'product', 'mobile_app')),
  description text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'rejected')),
  billable boolean not null default false,
  charge_amount_inr integer,
  payment_status text check (payment_status in ('pending', 'paid')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index change_requests_seller_month_idx on change_requests(seller_id, created_at);

alter table change_requests enable row level security;

create policy "service role all change_requests" on change_requests
  for all to service_role using (true) with check (true);

create policy "sellers view own change_requests" on change_requests
  for select to authenticated using (seller_id = auth.uid());

create policy "sellers insert own change_requests" on change_requests
  for insert to authenticated with check (seller_id = auth.uid());
