# WearOn — Morning Setup Checklist

Everything code-side is done. This is the remaining infra/ops work — buy and
configure accounts, then deploy. See the conversation/plan for the "why"
behind the shared-infra architecture (per-seller domain, but shared
Vercel/Supabase/Meta Business Account underneath — isolating those per
seller would erase margin at the ₹999–3,999 price point).

## 1. Buy

- [ ] **Domain** (.in via GoDaddy/Namecheap, or .com via Cloudflare Registrar if going global) — under the new entity's billing, not WyberAi's.
- [ ] **One email** on that domain (for the Meta Business verification step below, and as the account owner email for Vercel/Supabase/GitHub).

## 2. New accounts (new entity — do NOT reuse WyberAi's)

- [ ] **Vercel** — new team, Pro plan (~$20/mo). Import `wearon-platform` from GitHub. Attach the new domain.
- [ ] **Supabase** — new org + new project, Pro plan (~$25/mo + compute). Run all migrations in `supabase/migrations/` in order (001 → 010) via `supabase db push` or the SQL editor.
- [ ] **GitHub** — new org. Move (or re-push) the `wearon-platform`, `wearon-ai`, `wearon-app`, and new `wearon-seller-app` repos into it.
- [ ] **Google Cloud credits** (already have $2k from WyberAi) — nothing in the current stack runs on GCP (try-on is fal.ai/Higgsfield, agent replies are OpenAI, hosting is Vercel/Supabase). If you want to actually spend these credits, the natural fit is Cloud Run for the `wearon-ai` Python service if you ever bring the Modal.com CatVTON pipeline back in-house — otherwise there's no code path that consumes them today. Don't force a fit.

## 3. Meta (Instagram + Facebook Messenger + WhatsApp)

One Meta App covers all three products — do not create three separate apps.

- [ ] Create a Meta Business Manager account under the new entity, verify it (can take a few days — start this **today**, independent of everything else, since it's a real lead-time bottleneck).
- [ ] Create one Meta App. Add products: **Instagram Graph API**, **Messenger**, **WhatsApp Business Platform**.
- [ ] Set `META_APP_ID` / `META_APP_SECRET` from the app's Basic Settings.
- [ ] Set `META_VERIFY_TOKEN` to any random string — enter the same string in both webhook configs below.
- [ ] Webhook URLs (after Vercel deploy, once you have the real domain):
  - Instagram + Messenger: `https://<domain>/api/webhooks/instagram`
  - WhatsApp: `https://<domain>/api/webhooks/whatsapp`
- [ ] WhatsApp: create the platform's one shared WhatsApp Business Account (WABA) inside this Meta App. Generate a system-user access token → `WHATSAPP_ACCESS_TOKEN`.
- [ ] Per seller going forward: add their number to the shared WABA in Meta Business Manager, then assign it to them in `/platform/sellers/[id]` (the "WhatsApp automation" card built tonight) — this is a manual step per seller for now, not self-serve.
- [ ] Instagram/Messenger scopes now also request `instagram_content_publish` + `pages_manage_posts` (for the new Content tab) — this requires **Meta App Review** before it works for real (non-test) users. Submit for review once the app is live on the real domain; until approved, content publishing only works for accounts added as Meta App testers.

## 4. Env vars

Copy `.env.example` → `.env.local` (and into Vercel's project env vars). Every var is documented inline with where to get it. Nothing is a guess — if a var has no comment, it means it was already working before tonight.

## 5. Deploy

- [ ] `wearon-platform` → Vercel (web admin + storefront + all APIs).
- [ ] `wearon-ai` → only needed if keeping the legacy Modal.com path around; otherwise can be left undeployed.
- [ ] `wearon-app` (buyer app) → existing CI pipeline, per-seller branded builds.
- [ ] `wearon-seller-app` (new tonight) → **one** build, not per-seller (every seller logs into the same app, `/admin` resolves to their own store after login). Run `npm run setup-assets` once, then `npx expo prebuild` / EAS build when ready for a real device test.

## 6. Known issues to verify before relying on them

- [ ] **Push notifications are not yet functional.** The app registers an *Expo* push token (`getExpoPushTokenAsync()`), but the backend (`src/lib/push/fcm.ts`) sends via the raw FCM legacy HTTP API, which expects a native FCM device token — these are different token formats and the mismatch means sends will fail even once `FIREBASE_SERVER_KEY` is set. This predates tonight (the buyer app `wearon-app` has the identical gap) — fix by either (a) switching `fcm.ts` to POST to Expo's push service (`https://exp.host/--/api/v2/push/send`) instead of FCM directly, which accepts Expo tokens as-is, or (b) switching both apps to `getDevicePushTokenAsync()` + a real `google-services.json` per app. (a) is less work and doesn't need a per-app Firebase project.
- [ ] **`google-services.json` is a placeholder** in both `wearon-app` and `wearon-seller-app` — replace with a real Firebase project's config before building for real devices (only matters if you go with fix (b) above).
- [ ] Content publishing to Instagram/Facebook needs App Review (see §3) — test with a Meta-added tester account first.
