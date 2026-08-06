export const PLANS = {
  free:       { name: 'Free',       try_ons: 20,   price_inr: 0,     products: 10,   label: 'Get Started' },
  starter:    { name: 'Starter',    try_ons: 200,  price_inr: 999,   products: 50,   label: 'Start Selling' },
  growth:     { name: 'Growth',     try_ons: 500,  price_inr: 1999,  products: 200,  label: 'Grow Faster' },
  pro:        { name: 'Pro',        try_ons: 2000, price_inr: 3999,  products: 9999, label: 'Go Pro' },
  enterprise: { name: 'Enterprise', try_ons: 99999,price_inr: 9999,  products: 9999, label: 'Contact Us' },
} as const

export type Plan = keyof typeof PLANS

export const PLAN_TRY_ON_LIMITS: Record<Plan, number> = {
  free: 20, starter: 200, growth: 500, pro: 2000, enterprise: 99999,
}

export const FONTS = {
  poppins:  { label: 'Poppins',   css: "'Poppins', sans-serif" },
  playfair: { label: 'Playfair',  css: "'Playfair Display', serif" },
  inter:    { label: 'Inter',     css: "'Inter', sans-serif" },
  nunito:   { label: 'Nunito',    css: "'Nunito', sans-serif" },
  raleway:  { label: 'Raleway',   css: "'Raleway', sans-serif" },
} as const

export const OVERAGE_PRICE_PER_TRY_ON = 3 // ₹3 per extra try-on
