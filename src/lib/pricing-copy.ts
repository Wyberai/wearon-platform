import { PLANS, PLAN_AI_REPLY_LIMITS, PLAN_TRY_ON_LIMITS, PLAN_AI_CREDIT_LIMITS, DOMAIN_ELIGIBLE_PLANS, type Plan } from './constants'

export interface PricingCardCopy {
  key: Plan
  description: string
  featured?: boolean
  inclusions: string[]
}

// Every number here comes straight from constants.ts (the same limits the
// backend actually enforces) — no invented marketing bullets. Confirmed with
// the founder: domain + professional email are included on every paid tier
// (Store and above), fulfilled manually per upgrade for now, not automated.
export const PRICING_COPY: PricingCardCopy[] = [
  {
    key: 'free',
    description: 'Try it, no card required.',
    inclusions: [
      `${PLANS.free.products} products`,
      'Branded storefront (instastarz.in/store/yourslug)',
      'WhatsApp + Razorpay checkout',
      'Basic analytics',
      `${PLAN_AI_REPLY_LIMITS.free.toLocaleString('en-IN')} AI auto-replies/mo`,
    ],
  },
  {
    key: 'starter',
    description: 'A real store, fully checked out.',
    inclusions: [
      `${PLANS.starter.products} products`,
      'Full storefront + checkout',
      DOMAIN_ELIGIBLE_PLANS.includes('starter') ? '1 custom domain + 1 professional email, included' : 'Branded storefront',
      'Razorpay + WhatsApp ordering',
      'Analytics dashboard',
      `${PLAN_AI_REPLY_LIMITS.starter.toLocaleString('en-IN')} AI auto-replies/mo`,
    ],
  },
  {
    key: 'growth',
    description: 'Everything in Store, plus the app.',
    featured: true,
    inclusions: [
      `${PLANS.growth.products} products`,
      'Everything in Store',
      'Native Android app + Play Store listing',
      'Priority support',
      `${PLAN_AI_REPLY_LIMITS.growth.toLocaleString('en-IN')} AI auto-replies/mo`,
    ],
  },
  {
    key: 'pro',
    description: 'For sellers who want it all.',
    inclusions: [
      'Unlimited products',
      'Everything in Store + App',
      `${PLAN_TRY_ON_LIMITS.pro} AI try-ons/mo`,
      `${PLAN_AI_CREDIT_LIMITS.pro} AI photoshoot credits/mo`,
      `${PLAN_AI_REPLY_LIMITS.pro.toLocaleString('en-IN')} AI auto-replies/mo`,
    ],
  },
]
