-- Retire the legacy try_ons_used/try_ons_limit quota system. It duplicated
-- the ai_credits pool that the live storefront try-on flow and AI Studio
-- actually enforce, and had drifted out of sync with it (pricing copy
-- claimed 300 try-ons/mo for Pro from this counter, while the real
-- ai_credits pool only ever supported ~50 image try-ons at 150 credits).
-- One metered pool now, ai_credits, everywhere a try-on happens.

-- Referral bonus previously added +200 to try_ons_limit ("200 free AI
-- try-ons" in marketing copy) — now adds the equivalent in ai_credits
-- (200 try-ons * 3 credits/image try-on = 600 credits) so the promised
-- number stays literally true under the unified system.
create or replace function grant_referral_credit(referrer_id uuid, referred_id uuid)
returns void language plpgsql security definer as $$
begin
  update profiles set ai_credits = ai_credits + 600 where id = referrer_id;
  update profiles set referred_by = referrer_id where id = referred_id and referred_by is null;
end;
$$;

drop function if exists deduct_try_on(uuid);
drop function if exists increment_try_ons(uuid, integer);

alter table profiles drop column if exists try_ons_used;
alter table profiles drop column if exists try_ons_limit;
