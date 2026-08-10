import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = Math.min(Number(searchParams.get('days') ?? '30'), 90)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().split('T')[0]

  const [analyticsRes, ordersRes, marginOrdersRes, tryOnsRes] = await Promise.all([
    admin
      .from('daily_analytics')
      .select('date, store_visits, try_ons, whatsapp_clicks, orders_placed, revenue_inr')
      .eq('seller_id', user.id)
      .gte('date', sinceStr)
      .order('date', { ascending: true }),

    admin
      .from('orders')
      .select('id, status, total_inr, created_at')
      .eq('seller_id', user.id)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(5),

    // Full item detail for the period, used only for margin math below —
    // status='cancelled' is excluded since those orders never generated real COGS.
    admin
      .from('orders')
      .select('items, total_inr, status, created_at')
      .eq('seller_id', user.id)
      .neq('status', 'cancelled')
      .gte('created_at', since.toISOString()),

    admin
      .from('try_on_results')
      .select('id, created_at, whatsapp_clicked')
      .eq('seller_id', user.id)
      .gte('created_at', since.toISOString()),
  ])

  const rows = analyticsRes.data ?? []

  const totals = rows.reduce(
    (acc, r) => ({
      store_visits: acc.store_visits + (r.store_visits ?? 0),
      try_ons: acc.try_ons + (r.try_ons ?? 0),
      whatsapp_clicks: acc.whatsapp_clicks + (r.whatsapp_clicks ?? 0),
      orders_placed: acc.orders_placed + (r.orders_placed ?? 0),
      revenue_inr: acc.revenue_inr + (r.revenue_inr ?? 0),
    }),
    { store_visits: 0, try_ons: 0, whatsapp_clicks: 0, orders_placed: 0, revenue_inr: 0 },
  )

  const tryOnRows = tryOnsRes.data ?? []
  const whatsappClicks = tryOnRows.filter(t => t.whatsapp_clicked).length
  const conversionRate = tryOnRows.length > 0
    ? Math.round((whatsappClicks / tryOnRows.length) * 100)
    : 0

  // Margin: derived from each order's line-item cost snapshot, not live product
  // cost, so it reflects what COGS actually was at the time of sale.
  type OrderItem = { product_id: string; name: string; quantity: number; price_inr: number; cost_price_inr?: number }
  const marginRows = (marginOrdersRes.data ?? []) as Array<{ items: OrderItem[]; total_inr: number }>

  let revenueWithCost = 0
  let totalCost = 0
  let totalOrderRevenue = 0
  const byProduct = new Map<string, { name: string; revenue_inr: number; cost_inr: number; units: number }>()

  for (const order of marginRows) {
    totalOrderRevenue += order.total_inr ?? 0
    for (const item of order.items ?? []) {
      if (item.cost_price_inr == null) continue // seller never set a cost for this product
      const lineRevenue = item.price_inr * item.quantity
      const lineCost = item.cost_price_inr * item.quantity
      revenueWithCost += lineRevenue
      totalCost += lineCost

      const existing = byProduct.get(item.product_id) ?? { name: item.name, revenue_inr: 0, cost_inr: 0, units: 0 }
      existing.revenue_inr += lineRevenue
      existing.cost_inr += lineCost
      existing.units += item.quantity
      byProduct.set(item.product_id, existing)
    }
  }

  const marginInr = revenueWithCost - totalCost
  const marginPct = revenueWithCost > 0 ? Math.round((marginInr / revenueWithCost) * 100) : 0

  const productMargins = Array.from(byProduct.entries())
    .map(([product_id, p]) => ({
      product_id,
      name: p.name,
      units: p.units,
      revenue_inr: p.revenue_inr,
      cost_inr: p.cost_inr,
      margin_inr: p.revenue_inr - p.cost_inr,
      margin_pct: p.revenue_inr > 0 ? Math.round(((p.revenue_inr - p.cost_inr) / p.revenue_inr) * 100) : 0,
    }))
    .sort((a, b) => b.margin_inr - a.margin_inr)

  return NextResponse.json({
    rows,
    totals,
    conversionRate,
    recentOrders: ordersRes.data ?? [],
    days,
    margin: {
      revenue_inr: revenueWithCost,
      cost_inr: totalCost,
      margin_inr: marginInr,
      margin_pct: marginPct,
      // Revenue from orders (or line items) where the seller never entered a
      // cost price — not included in the margin math above, surfaced so the
      // UI can nudge them to fill it in.
      revenue_missing_cost_inr: Math.max(0, totalOrderRevenue - revenueWithCost),
      by_product: productMargins,
    },
  })
}
