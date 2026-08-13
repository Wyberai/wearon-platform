import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/store/[slug]/collections — public: featured collections for the storefront
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (slug === 'demo') {
    return NextResponse.json({ collections: [] })
  }

  const admin = createAdminClient()

  const { data: config } = await admin
    .from('tenant_config')
    .select('seller_id')
    .eq('slug', slug)
    .single()

  if (!config) return NextResponse.json({ collections: [] })

  const { data: collections } = await admin
    .from('store_collections')
    .select('id, title, description, editorial_copy, product_ids, occasion_tags, hero_image_url')
    .eq('seller_id', config.seller_id)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(5)

  if (!collections?.length) return NextResponse.json({ collections: [] })

  // Hydrate product thumbnails for each collection
  const allProductIds = [...new Set(collections.flatMap(c => c.product_ids as string[]))]

  const { data: products } = await admin
    .from('products')
    .select('id, name, garment_image_url, price_inr')
    .in('id', allProductIds)
    .eq('is_active', true)

  const productMap = new Map((products ?? []).map(p => [p.id, p]))

  const hydrated = collections.map(c => ({
    ...c,
    products: (c.product_ids as string[])
      .map(id => productMap.get(id))
      .filter(Boolean)
      .slice(0, 6),
  }))

  return NextResponse.json({ collections: hydrated }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  })
}
