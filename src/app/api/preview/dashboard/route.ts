import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/preview/dashboard — public, no auth. Powers the landing page's
// "see how your dashboard would look" flow. Always reads the seeded demo
// seller (Priya's Boutique) — the visitor's brand name is swapped in
// client-side from their lead-capture input, not stored per-visitor here.
const DEMO_SELLER_ID = 'ecdec8aa-46e8-48d7-8dfa-4af192fee42c'

export async function GET() {
  const admin = createAdminClient()

  const [profileRes, productsRes, ordersRes, analyticsRes, igConvRes, waConvRes] = await Promise.all([
    admin.from('profiles').select('plan, ai_credits, ai_replies_used, ai_reply_limit').eq('id', DEMO_SELLER_ID).single(),
    admin.from('products').select('id, name, price_inr, cost_price_inr, category, garment_image_url').eq('seller_id', DEMO_SELLER_ID).eq('is_active', true).order('created_at', { ascending: false }),
    admin.from('orders').select('id, status, total_inr, items, created_at').eq('seller_id', DEMO_SELLER_ID).order('created_at', { ascending: false }).limit(10),
    admin.from('daily_analytics').select('date, store_visits, try_ons, whatsapp_clicks, orders_placed, revenue_inr').eq('seller_id', DEMO_SELLER_ID).order('date', { ascending: true }),
    admin.from('instagram_conversations').select('id, ig_sender_username, channel, last_message_preview, last_message_at, unread_count').eq('seller_id', DEMO_SELLER_ID).order('last_message_at', { ascending: false }).limit(5),
    admin.from('whatsapp_conversations').select('id, buyer_name, last_message_preview, last_message_at, unread_count').eq('seller_id', DEMO_SELLER_ID).order('last_message_at', { ascending: false }).limit(5),
  ])

  const products = productsRes.data ?? []
  const orders = ordersRes.data ?? []
  const analytics = analyticsRes.data ?? []

  type OrderItem = { name: string; quantity: number; price_inr: number; cost_price_inr?: number }
  let revenue30d = 0
  let cost30d = 0
  for (const order of orders) {
    if (order.status === 'cancelled') continue
    revenue30d += order.total_inr
    for (const item of (order.items as OrderItem[]) ?? []) {
      if (item.cost_price_inr != null) cost30d += item.cost_price_inr * item.quantity
    }
  }

  const totalVisits = analytics.reduce((s, d) => s + (d.store_visits ?? 0), 0)
  const totalTryOns = analytics.reduce((s, d) => s + (d.try_ons ?? 0), 0)

  const productMargins = products
    .filter(p => p.cost_price_inr != null)
    .map(p => ({
      name: p.name,
      price_inr: p.price_inr,
      cost_price_inr: p.cost_price_inr,
      margin_pct: Math.round(((p.price_inr - p.cost_price_inr!) / p.price_inr) * 100),
    }))

  const inbox = [
    ...(igConvRes.data ?? []).map(c => ({
      channel: c.channel ?? 'instagram',
      name: c.ig_sender_username ? `@${c.ig_sender_username}` : 'buyer',
      preview: c.last_message_preview,
      unread: c.unread_count,
    })),
    ...(waConvRes.data ?? []).map(c => ({
      channel: 'whatsapp',
      name: c.buyer_name ?? 'buyer',
      preview: c.last_message_preview,
      unread: c.unread_count,
    })),
  ]

  return NextResponse.json({
    plan: profileRes.data?.plan ?? 'pro',
    products_count: products.length,
    orders_count: orders.length,
    revenue_30d_inr: revenue30d,
    cost_30d_inr: cost30d,
    margin_30d_inr: revenue30d - cost30d,
    margin_pct: revenue30d > 0 ? Math.round(((revenue30d - cost30d) / revenue30d) * 100) : 0,
    store_visits: totalVisits,
    try_ons: totalTryOns,
    analytics_chart: analytics,
    product_margins: productMargins,
    inbox,
  })
}
