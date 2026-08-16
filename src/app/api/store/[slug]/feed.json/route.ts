import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { US_DEMO_PRODUCTS, US_DEMO_CONFIG } from '@/lib/demo-products'
import { catalogToMerchantFeed } from '@/lib/schema-org'
import { logAgentEndpointHit } from '@/lib/agent-tracking'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (slug === 'demo') {
    const feed = catalogToMerchantFeed(US_DEMO_PRODUCTS, {
      brandName: US_DEMO_CONFIG.brand_name,
      currency: US_DEMO_CONFIG.currency,
      baseUrl: BASE_URL,
      storeSlug: slug,
    })
    return NextResponse.json(feed, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    })
  }

  const admin = createAdminClient()
  const { data: tenant } = await admin
    .from('tenant_config')
    .select('seller_id, brand_name, currency')
    .eq('slug', slug)
    .single()

  if (!tenant) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  void logAgentEndpointHit(tenant.seller_id, 'feed', req.headers.get('user-agent'))

  const { data: products } = await admin
    .from('products')
    .select('id, name, description, category, price_inr, original_price_inr, garment_image_url, slug, sizes, colors, tags')
    .eq('seller_id', tenant.seller_id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const feed = catalogToMerchantFeed(products ?? [], {
    brandName: tenant.brand_name,
    currency: tenant.currency ?? 'USD',
    baseUrl: BASE_URL,
    storeSlug: slug,
  })

  return NextResponse.json(feed, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json',
    },
  })
}
