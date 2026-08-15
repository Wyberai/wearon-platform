// Shared shapes for the "January" flagship theme. Every component in
// src/components/august/ works against these — never against the demo
// AUGUST_PRODUCTS/AUGUST_BRAND constants directly — so the exact same
// components render either the AUGUST showcase (fictional data) or any real
// seller's own store (their tenant_config + products, once they pick this
// theme). See src/lib/august/adapters.ts for the real-data → these shapes.

export interface ThemeProduct {
  id: string
  slug: string
  name: string
  category: string
  price: number
  originalPrice?: number | null
  description: string
  detail?: string
  fabric?: string
  fit?: string
  sizes: string[]
  colors: string[]
  tags: string[]
  image: string
}

export interface ThemeBrand {
  name: string
  tagline: string
  description: string
  slug: string
  currency: string
  categories: string[]
  sellerId?: string | null // absent for the fictional AUGUST demo
  whatsappNumber?: string | null
  instagramHandle?: string | null
  paymentMethod?: string | null
  razorpayAvailable?: boolean
}
