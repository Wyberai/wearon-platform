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

  const [analyticsRes, ordersRes, tryOnsRes] = await Promise.all([
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

  return NextResponse.json({
    rows,
    totals,
    conversionRate,
    recentOrders: ordersRes.data ?? [],
    days,
  })
}
