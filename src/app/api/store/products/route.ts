import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Never cache — a stale response here means every buyer sees an empty or
// out-of-date storefront until the cache happens to expire (this is exactly
// what masked the empty-production-env-var bug after a redeploy).
export const dynamic = 'force-dynamic'

// GET /api/store/products?slug=xxx — public, no auth. The storefront was
// calling /api/admin/products (seller-authenticated, returns 401 for every
// anonymous buyer) instead of a real public endpoint — this is that
// endpoint. Only returns active products; never exposes cost_price_inr.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const admin = createAdminClient()

  const { data: tenant } = await admin.from('tenant_config').select('seller_id').eq('slug', slug).single()
  if (!tenant) return NextResponse.json({ products: [] })

  const { data: products } = await admin
    .from('products')
    .select('id, name, description, category, price_inr, original_price_inr, garment_image_url, garment_preprocessed_url, slug, is_active, sizes, colors, tags, created_at')
    .eq('seller_id', tenant.seller_id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return NextResponse.json({ products: products ?? [] })
}
