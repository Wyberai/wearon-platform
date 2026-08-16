// UCP (Universal Commerce Protocol) — Shopify + Google AI Mode compatible
// Endpoint that lets Google AI Mode, Rufus, and UCP-aware agents browse and
// initiate checkout on Instastarz stores.
//
// Spec: GET = product catalog, POST = checkout intent
// Docs: universal-checkout-protocol.dev

import { NextResponse } from 'next/server'
import { getStoreContext, type RawProduct } from '@/lib/store-agent-tools'

type Params = Promise<{ slug: string }>

// GET /api/store/{slug}/ucp — UCP product catalog
export async function GET(request: Request, { params }: { params: Params }) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined
  const category = searchParams.get('category') ?? undefined

  const ctx = await getStoreContext(slug)
  if (!ctx) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const baseUrl = new URL(request.url).origin

  let products = ctx.products as RawProduct[]
  if (q) {
    const lower = q.toLowerCase()
    products = products.filter((p: RawProduct) =>
      p.name.toLowerCase().includes(lower) ||
      (p.description ?? '').toLowerCase().includes(lower) ||
      (p.category ?? '').toLowerCase().includes(lower) ||
      ((p.tags as string[] | null) ?? []).some((t: string) => t.toLowerCase().includes(lower))
    )
  }
  if (category) products = products.filter((p: RawProduct) => p.category?.toLowerCase() === category.toLowerCase())
  if (maxPrice) products = products.filter((p: RawProduct) => p.price_inr <= maxPrice)

  const currency = ctx.config?.currency ?? 'INR'

  return NextResponse.json({
    protocol: 'ucp/1.0',
    store: {
      id: slug,
      name: ctx.config?.brand_name ?? slug,
      currency,
      checkout_url: `${baseUrl}/api/store/${slug}/ucp`,
    },
    products: products.map((p: RawProduct) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price_inr,
      currency,
      available: true,
      image_url: p.garment_image_url,
      variants: (p.sizes as string[] | null)?.map(size => ({
        id: `${p.id}_${size}`,
        name: size,
        price: p.price_inr,
        available: true,
      })) ?? [],
      buy_url: `${baseUrl}/store/${slug}/product/${p.slug ?? p.id}`,
    })),
    metadata: {
      total: products.length,
      generated_at: new Date().toISOString(),
    },
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}

// POST /api/store/{slug}/ucp — UCP checkout intent
export async function POST(request: Request, { params }: { params: Params }) {
  const { slug } = await params
  const body = await request.json()
  const { product_id, variant_id, quantity = 1, buyer } = body as {
    product_id: string
    variant_id?: string
    quantity?: number
    buyer?: { email?: string; name?: string }
  }

  const ctx = await getStoreContext(slug)
  if (!ctx) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const product = (ctx.products as RawProduct[]).find((p: RawProduct) => p.id === product_id || p.slug === product_id)
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const size = variant_id?.replace(`${product_id}_`, '') ?? null
  const baseUrl = new URL(request.url).origin
  const total = product.price_inr * quantity

  const checkoutUrl = new URL(`${baseUrl}/store/${slug}/checkout`)
  checkoutUrl.searchParams.set('product', product_id)
  checkoutUrl.searchParams.set('qty', String(quantity))
  if (size) checkoutUrl.searchParams.set('size', size)
  if (buyer?.email) checkoutUrl.searchParams.set('email', buyer.email)

  return NextResponse.json({
    protocol: 'ucp/1.0',
    checkout_id: crypto.randomUUID(),
    status: 'created',
    checkout_url: checkoutUrl.toString(),
    order_preview: {
      items: [{ product_id, name: product.name, variant: size, quantity, unit_price: product.price_inr }],
      subtotal: total,
      total,
      currency: ctx.config?.currency ?? 'INR',
    },
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}

export async function OPTIONS() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  })
}
