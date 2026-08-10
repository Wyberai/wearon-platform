import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Never cache — see products/route.ts for why this matters.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

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
