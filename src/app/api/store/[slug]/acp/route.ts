// ACP (Agent Commerce Protocol) — OpenAI + Stripe compatible
// Allows ChatGPT and other OpenAI-based agents to initiate purchases from WearOn stores.
// Follows the OpenAI Agent Commerce spec: purchase intent → payment URL.

import { NextResponse } from 'next/server'
import { getStoreContext } from '@/lib/store-agent-tools'

type Params = Promise<{ slug: string }>

// GET /api/store/{slug}/acp — ACP store manifest
export async function GET(request: Request, { params }: { params: Params }) {
  const { slug } = await params
  const ctx = await getStoreContext(slug)
  if (!ctx) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const baseUrl = new URL(request.url).origin

  return NextResponse.json({
    schema_version: '2024-11',
    protocol: 'acp',
    merchant: {
      id: slug,
      name: ctx.config?.brand_name ?? slug,
      currency: ctx.config?.currency ?? 'INR',
      locale: 'en-IN',
    },
    capabilities: ['browse', 'purchase_intent', 'order_status'],
    endpoints: {
      browse: `${baseUrl}/api/store/${slug}/ucp`,
      purchase_intent: `${baseUrl}/api/store/${slug}/acp`,
      mcp: `${baseUrl}/api/store/${slug}/mcp`,
      openapi: `${baseUrl}/api/store/${slug}/openapi.json`,
    },
    payment_methods: ['card', 'upi'],
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}

// POST /api/store/{slug}/acp — ACP purchase intent
export async function POST(request: Request, { params }: { params: Params }) {
  const { slug } = await params
  const body = await request.json()
  const { action, product_id, size, quantity = 1, buyer_email, agent_id } = body as {
    action: 'purchase_intent' | 'order_status'
    product_id?: string
    size?: string
    quantity?: number
    buyer_email?: string
    agent_id?: string
    order_id?: string
  }

  const ctx = await getStoreContext(slug)
  if (!ctx) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  if (action === 'purchase_intent') {
    if (!product_id) return NextResponse.json({ error: 'product_id required for purchase_intent' }, { status: 400 })

    const product = ctx.products.find(p => p.id === product_id || p.slug === product_id)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const total = product.price_inr * quantity
    const baseUrl = new URL(request.url).origin
    const checkoutUrl = new URL(`${baseUrl}/store/${slug}/checkout`)
    checkoutUrl.searchParams.set('product', product_id)
    checkoutUrl.searchParams.set('qty', String(quantity))
    if (size) checkoutUrl.searchParams.set('size', size)
    if (buyer_email) checkoutUrl.searchParams.set('email', buyer_email)
    if (agent_id) checkoutUrl.searchParams.set('agent', agent_id)
    checkoutUrl.searchParams.set('source', 'acp')

    return NextResponse.json({
      schema_version: '2024-11',
      protocol: 'acp',
      intent_id: crypto.randomUUID(),
      status: 'created',
      action: 'redirect_to_checkout',
      checkout_url: checkoutUrl.toString(),
      order_preview: {
        merchant: ctx.config?.brand_name ?? slug,
        items: [{
          product_id,
          name: product.name,
          size: size ?? null,
          quantity,
          unit_price: product.price_inr,
          currency: ctx.config?.currency ?? 'INR',
          image_url: product.garment_image_url,
        }],
        subtotal: total,
        total,
        currency: ctx.config?.currency ?? 'INR',
      },
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      instructions_for_agent: 'Share the checkout_url with the buyer. They complete payment there. No further agent action is required.',
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function OPTIONS() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  })
}
