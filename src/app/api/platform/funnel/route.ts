import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { FLAGSHIP_DEMO_SLUG } from '@/lib/themes'

function isPlatformOwner(email: string | undefined) {
  return email && email === process.env.PLATFORM_OWNER_EMAIL
}

// GET /api/platform/funnel — real funnel + theme-popularity + outbound
// snapshot, all from data that already exists (leads = preview requests,
// tenant_config = actual signups, orders = revenue, outbound_prospects =
// the scraped-seller pipeline). No invented numbers.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [leadsRes, tenantsRes, profilesRes, ordersRes, outboundRes] = await Promise.all([
    admin.from('leads').select('theme_id, created_at').gte('created_at', thirtyDaysAgo),
    admin.from('tenant_config').select('theme_id, seller_id, created_at'),
    admin.from('profiles').select('id, plan, created_at'),
    admin.from('orders').select('total_inr, created_at').gte('created_at', thirtyDaysAgo),
    admin.from('outbound_prospects').select('status, detected_language, phone, email'),
  ])

  const leads = leadsRes.data ?? []
  const tenants = tenantsRes.data ?? []
  const profiles = profilesRes.data ?? []
  const orders = ordersRes.data ?? []
  const outbound = outboundRes.data ?? []

  const funnel = {
    previews_30d: leads.length,
    signups_total: profiles.length,
    paying_total: profiles.filter(p => p.plan !== 'free').length,
    revenue_30d_inr: orders.reduce((sum, o) => sum + (o.total_inr ?? 0), 0),
  }

  // Theme popularity: preview interest (leads) vs actual adoption
  // (tenant_config). theme_id stored on both is the CALENDAR id
  // (january..december, or reelrack/thegrid/tryiton) — FLAGSHIP_DEMO_SLUG
  // maps that to the actual flagship name shown everywhere else (e.g.
  // calendar "august" -> demo slug "dhamaka", NOT demo slug "august").
  const previewCounts: Record<string, number> = {}
  leads.forEach(l => { if (l.theme_id) previewCounts[l.theme_id] = (previewCounts[l.theme_id] ?? 0) + 1 })
  const adoptionCounts: Record<string, number> = {}
  tenants.forEach(t => { if (t.theme_id) adoptionCounts[t.theme_id] = (adoptionCounts[t.theme_id] ?? 0) + 1 })

  const themePopularity = Object.entries(FLAGSHIP_DEMO_SLUG).map(([calendarId, demoSlug]) => ({
    id: calendarId,
    name: demoSlug.toUpperCase(),
    previews_30d: previewCounts[calendarId] ?? 0,
    adoptions_total: adoptionCounts[calendarId] ?? 0,
  })).sort((a, b) => (b.previews_30d + b.adoptions_total) - (a.previews_30d + a.adoptions_total))

  const outboundSnapshot = {
    total: outbound.length,
    with_contact: outbound.filter(p => p.phone || p.email).length,
    by_status: Object.fromEntries(
      Object.entries(outbound.reduce((acc: Record<string, number>, p) => {
        acc[p.status] = (acc[p.status] ?? 0) + 1
        return acc
      }, {}))
    ),
    by_language: Object.fromEntries(
      Object.entries(outbound.reduce((acc: Record<string, number>, p) => {
        const l = p.detected_language || 'en'
        acc[l] = (acc[l] ?? 0) + 1
        return acc
      }, {}))
    ),
  }

  return NextResponse.json({ funnel, themePopularity, outbound: outboundSnapshot })
}
