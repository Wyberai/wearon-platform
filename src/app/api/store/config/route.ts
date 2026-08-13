import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Never cache — see products/route.ts for why this matters.
export const dynamic = 'force-dynamic'

const US_DEMO_CONFIG = {
  seller_id: 'demo', slug: 'demo',
  brand_name: 'Luna Boutique', tagline: 'Curated fashion for the modern woman',
  logo_url: null, favicon_url: null,
  primary_color: '#1A1A1A', secondary_color: '#F5F5F5', accent_color: '#A6134A',
  background_color: '#FFFFFF', font_family: 'poppins', theme_id: 'editorial',
  dark_mode_default: false, currency: 'USD', payment_method: 'stripe',
  whatsapp_number: null, instagram_handle: '@lunaboutique',
  try_on_enabled: true, reviews_enabled: true, wishlist_enabled: true,
  categories: ['Dresses', 'Tops', 'Denim', 'Outerwear', 'Accessories'],
  size_guide_url: null, banners: [], custom_domain: null, play_store_url: null,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  // Demo store always returns the US fallback — never the DB record
  if (slug === 'demo') return NextResponse.json({ config: US_DEMO_CONFIG })

  const admin = createAdminClient()
  // Explicit column list — deliberately excludes payment_config, which can
  // hold a Razorpay key_secret. This endpoint is unauthenticated and public.
  const { data: config } = await admin
    .from('tenant_config')
    .select(`
      seller_id, slug, brand_name, tagline, logo_url, favicon_url,
      primary_color, secondary_color, accent_color, background_color,
      font_family, theme_id, dark_mode_default, currency, payment_method,
      whatsapp_number, instagram_handle, try_on_enabled, reviews_enabled,
      wishlist_enabled, categories, size_guide_url, banners, custom_domain,
      play_store_url, created_at, updated_at
    `)
    .eq('slug', slug)
    .single()

  return NextResponse.json({ config: config ?? null })
}
