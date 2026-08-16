// Shared shapes for Instastarz's flagship theme series (one bespoke theme per
// month — January is "AUGUST", src/lib/august/, more to follow). Every
// flagship theme's components work against these, never against a specific
// demo brand's own constants directly — so the exact same components render
// either that theme's fictional showcase brand or any real seller's own
// store (their tenant_config + products, once they pick the theme). See
// adapters.ts for the real-data → these shapes conversion.

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
  video?: string | null
}

export interface ThemeBrand {
  name: string
  tagline: string
  description: string
  slug: string
  currency: string
  categories: string[]
  sellerId?: string | null // absent for a fictional demo brand
  whatsappNumber?: string | null
  instagramHandle?: string | null
  paymentMethod?: string | null
  razorpayAvailable?: boolean
}
