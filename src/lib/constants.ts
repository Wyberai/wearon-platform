// Plan keys are unchanged from the original 5-tier system (free/starter/growth/pro/enterprise)
// to avoid a profiles.plan CHECK-constraint migration — only the economics, feature
// availability, and display names changed when this was re-tiered around three
// sellable products: Store, Store+App, and Store+App+AI Photoshoot.
//
// Design: the cheap-to-run feature (conversational AI replies) is available on every
// paid tier at increasing caps. The expensive-to-run features (buyer try-on, AI Studio
// cloth-to-model generation — both real fal.ai/Higgsfield compute) are entirely
// unavailable below the top tier, not just rate-limited — try_ons/ai_credits are 0,
// not small, for starter/growth.
export const PLANS = {
  free:       { name: 'Free',                          try_ons: 0,   ai_credits: 0,   price_inr: 0,     products: 10,   label: 'Get Started' },
  starter:    { name: 'Store',                          try_ons: 0,   ai_credits: 0,   price_inr: 3000,  products: 100,  label: 'Start Selling' },
  growth:     { name: 'Store + App',                    try_ons: 0,   ai_credits: 0,   price_inr: 9999,  products: 500,  label: 'Get the App' },
  pro:        { name: 'Store + App + AI Photoshoot',    try_ons: 300, ai_credits: 150, price_inr: 19999, products: 9999, label: 'Go All-In' },
  enterprise: { name: 'Enterprise',                     try_ons: 99999, ai_credits: 99999, price_inr: 39999, products: 9999, label: 'Contact Us' },
} as const

export type Plan = keyof typeof PLANS

// Features that cost Instastarz real setup/ops effort (custom domain DNS, a
// native Android build) rather than a per-call AI cost — gated to a binary
// plan check, same as APK_ELIGIBLE_PLANS in api/admin/apk-build/route.ts,
// rather than metered like conversational AI replies.
export const DOMAIN_ELIGIBLE_PLANS: Plan[] = ['starter', 'growth', 'pro', 'enterprise']

// AI shopping (the per-store MCP endpoint that lets ChatGPT/Gemini/Claude
// browse the catalog and check buyers out) — gated to Store + App (₹9,999)
// and above, not Free or Store (₹3,000). Confirmed with the founder.
export const MCP_ELIGIBLE_PLANS: Plan[] = ['growth', 'pro', 'enterprise']

export const PLAN_TRY_ON_LIMITS: Record<Plan, number> = {
  free: 0, starter: 0, growth: 0, pro: 300, enterprise: 99999,
}

// AI Studio (cloth-to-model photo/video generation) — same eligibility as try-on,
// both gated to the top tier since both carry real per-generation compute cost.
export const PLAN_AI_CREDIT_LIMITS: Record<Plan, number> = {
  free: 0, starter: 0, growth: 0, pro: 150, enterprise: 99999,
}

// Conversational AI replies (WhatsApp/Instagram/Messenger auto-reply +
// suggest-draft) — available at every paid tier, unlike try-on/AI Studio,
// since a single text reply is orders of magnitude cheaper than an image/video
// generation. Enforced via the deduct_ai_reply RPC.
export const PLAN_AI_REPLY_LIMITS: Record<Plan, number> = {
  free: 20, starter: 500, growth: 2500, pro: 8000, enterprise: 999999,
}

export const FONTS = {
  poppins:      { label: 'Poppins',       css: "'Poppins', sans-serif" },
  playfair:     { label: 'Playfair',      css: "'Playfair Display', serif" },
  inter:        { label: 'Inter',         css: "'Inter', sans-serif" },
  nunito:       { label: 'Nunito',        css: "'Nunito', sans-serif" },
  raleway:      { label: 'Raleway',       css: "'Raleway', sans-serif" },
  fraunces:     { label: 'Fraunces',      css: "'Fraunces', serif" },
  bebas:        { label: 'Bebas Neue',    css: "'Bebas Neue', sans-serif" },
  spacegrotesk: { label: 'Space Grotesk', css: "'Space Grotesk', sans-serif" },
  cormorant:    { label: 'Cormorant',     css: "'Cormorant', serif" },
} as const

export const OVERAGE_PRICE_PER_TRY_ON = 3 // ₹3 per extra try-on
