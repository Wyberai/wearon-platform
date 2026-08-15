import type { Product } from '@/lib/types'
import type { ThemeProduct, ThemeBrand } from './types'

// Config shape returned by /api/store/config and /api/store/product — a
// subset of the full TenantConfig (some fields, like payment_config, are
// deliberately excluded from those public endpoints).
export interface ThemeConfigInput {
  seller_id?: string | null
  brand_name: string
  tagline?: string | null
  currency?: string | null
  categories?: string[] | null
  whatsapp_number?: string | null
  instagram_handle?: string | null
  payment_method?: string | null
  razorpay_available?: boolean
  slug?: string
}

export function productToThemeProduct(p: Product): ThemeProduct {
  return {
    id: p.id,
    slug: p.slug || p.id,
    name: p.name,
    category: p.category ?? 'Collection',
    price: p.price_inr,
    originalPrice: p.original_price_inr ?? undefined,
    description: p.description ?? '',
    sizes: p.sizes ?? [],
    colors: p.colors ?? [],
    tags: p.tags ?? [],
    image: p.garment_image_url,
  }
}

export function configToThemeBrand(c: ThemeConfigInput, slug: string): ThemeBrand {
  return {
    name: c.brand_name,
    tagline: c.tagline || 'Shop the collection.',
    description: c.tagline || `${c.brand_name} — an online store built with WearOn.`,
    slug: c.slug ?? slug,
    currency: c.currency ?? 'USD',
    categories: c.categories?.length ? c.categories : [],
    sellerId: c.seller_id ?? null,
    whatsappNumber: c.whatsapp_number ?? null,
    instagramHandle: c.instagram_handle ?? null,
    paymentMethod: c.payment_method ?? null,
    razorpayAvailable: c.razorpay_available ?? false,
  }
}
