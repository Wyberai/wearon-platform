-- WearOn Platform — AI reply quota
--
-- Conversational AI replies (WhatsApp/Instagram/Messenger) had no metering
-- at all — unlike buyer try-ons (try_ons_used/try_ons_limit) and AI Studio
-- (ai_credits), a seller on any plan including Free got unlimited OpenAI
-- calls. This adds the same enforcement shape as try-ons: a running counter
-- capped by a plan-based limit, hard-stopped at the cap (no billing/overage
-- plumbing — matches how try-ons actually work today, not the unused
-- OVERAGE_PRICE_PER_TRY_ON aspiration in constants.ts).

alter table profiles add column if not exists ai_replies_used integer not null default 0;
alter table profiles add column if not exists ai_reply_limit integer not null default 50;

create or replace function deduct_ai_reply(p_seller_id uuid)
returns boolean language plpgsql security definer as $$
declare
  v_used integer;
  v_limit integer;
begin
  select ai_replies_used, ai_reply_limit into v_used, v_limit
  from profiles where id = p_seller_id for update;
  if v_used >= v_limit then return false; end if;
  update profiles set ai_replies_used = ai_replies_used + 1 where id = p_seller_id;
  return true;
end;
$$;
