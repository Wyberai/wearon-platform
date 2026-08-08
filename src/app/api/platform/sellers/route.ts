import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PLANS } from '@/lib/constants'

function isPlatformOwner(email: string | undefined) {
  return email && email === process.env.PLATFORM_OWNER_EMAIL
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [profilesRes, configsRes, productsRes, ordersRes] = await Promise.all([
    admin.from('profiles').select('id, email, plan, try_ons_used, try_ons_limit, subscription_status, created_at').order('created_at', { ascending: false }),
    admin.from('tenant_config').select('seller_id, brand_name, slug, primary_color'),
    admin.from('products').select('seller_id').eq('is_active', true),
    admin.from('orders').select('seller_id, total_inr, created_at').gte('created_at', thirtyDaysAgo),
  ])

  const profiles = profilesRes.data ?? []
  const configs = configsRes.data ?? []
  const products = productsRes.data ?? []
  const orders = ordersRes.data ?? []

  // Index configs and aggregate counts
  const configBySellerMap = new Map(configs.map(c => [c.seller_id, c]))
  const productCounts: Record<string, number> = {}
  const orderCounts: Record<string, number> = {}
  const orderRevenue: Record<string, number> = {}

  for (const p of products) {
    productCounts[p.seller_id] = (productCounts[p.seller_id] ?? 0) + 1
  }
  for (const o of orders) {
    orderCounts[o.seller_id] = (orderCounts[o.seller_id] ?? 0) + 1
    orderRevenue[o.seller_id] = (orderRevenue[o.seller_id] ?? 0) + (o.total_inr ?? 0)
  }

  const sellers = profiles.map(p => ({
    id: p.id,
    email: p.email,
    plan: p.plan,
    subscription_status: p.subscription_status,
    try_ons_used: p.try_ons_used ?? 0,
    try_ons_limit: p.try_ons_limit ?? 20,
    created_at: p.created_at,
    brand_name: configBySellerMap.get(p.id)?.brand_name ?? 'Unknown',
    slug: configBySellerMap.get(p.id)?.slug ?? null,
    primary_color: configBySellerMap.get(p.id)?.primary_color ?? '#E91E63',
    product_count: productCounts[p.id] ?? 0,
    orders_30d: orderCounts[p.id] ?? 0,
    revenue_30d_inr: orderRevenue[p.id] ?? 0,
  }))

  // Platform aggregate stats
  const planPrices: Record<string, number> = {
    free: 0,
    starter: PLANS.starter.price_inr,
    growth: PLANS.growth.price_inr,
    pro: PLANS.pro.price_inr,
    enterprise: PLANS.enterprise.price_inr,
  }

  const activeSellers = sellers.filter(s => s.subscription_status === 'active' || s.plan === 'free')
  const mrr = sellers
    .filter(s => s.subscription_status === 'active')
    .reduce((sum, s) => sum + (planPrices[s.plan] ?? 0), 0)

  const stats = {
    total_sellers: sellers.length,
    active_sellers: activeSellers.length,
    paying_sellers: sellers.filter(s => s.plan !== 'free' && s.subscription_status === 'active').length,
    mrr_inr: mrr,
    total_products: Object.values(productCounts).reduce((a, b) => a + b, 0),
    total_orders_30d: Object.values(orderCounts).reduce((a, b) => a + b, 0),
    total_revenue_30d: Object.values(orderRevenue).reduce((a, b) => a + b, 0),
    by_plan: {
      free: sellers.filter(s => s.plan === 'free').length,
      starter: sellers.filter(s => s.plan === 'starter').length,
      growth: sellers.filter(s => s.plan === 'growth').length,
      pro: sellers.filter(s => s.plan === 'pro').length,
      enterprise: sellers.filter(s => s.plan === 'enterprise').length,
    },
  }

  return NextResponse.json({ sellers, stats })
}
