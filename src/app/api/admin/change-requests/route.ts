import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { PLAN_CHANGE_REQUEST_LIMITS, CHANGE_REQUEST_OVERAGE_PRICE_INR, type Plan } from '@/lib/constants'

function startOfMonthIso() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

// GET — this month's quota status + request history
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('plan').eq('id', user.id).single()
  const plan = (profile?.plan ?? 'free') as Plan
  const limit = PLAN_CHANGE_REQUEST_LIMITS[plan] ?? 0

  const { data: requests } = await admin
    .from('change_requests')
    .select('id, request_type, description, status, billable, charge_amount_inr, payment_status, created_at, completed_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const usedThisMonth = (requests ?? []).filter(r => r.created_at >= startOfMonthIso()).length

  return NextResponse.json({
    plan,
    limit,
    used_this_month: usedThisMonth,
    remaining_free: Math.max(0, limit - usedThisMonth),
    overage_price_inr: CHANGE_REQUEST_OVERAGE_PRICE_INR,
    requests: requests ?? [],
  })
}

// POST — submit a new change request
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await req.json()
  const { request_type, description } = body as { request_type?: string; description?: string }

  if (!description || !description.trim()) {
    return NextResponse.json({ error: 'Description is required' }, { status: 400 })
  }
  if (!['design', 'product', 'mobile_app'].includes(request_type ?? '')) {
    return NextResponse.json({ error: 'Invalid request_type' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('plan').eq('id', user.id).single()
  const plan = (profile?.plan ?? 'free') as Plan
  const limit = PLAN_CHANGE_REQUEST_LIMITS[plan] ?? 0

  const { count } = await admin
    .from('change_requests')
    .select('id', { count: 'exact', head: true })
    .eq('seller_id', user.id)
    .gte('created_at', startOfMonthIso())

  const usedThisMonth = count ?? 0
  const billable = usedThisMonth >= limit

  const { data: request, error } = await admin
    .from('change_requests')
    .insert({
      seller_id: user.id,
      request_type,
      description: description.trim(),
      billable,
      charge_amount_inr: billable ? CHANGE_REQUEST_OVERAGE_PRICE_INR : null,
      payment_status: billable ? 'pending' : null,
    })
    .select()
    .single()

  if (error || !request) return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })

  // Alert founder so no request goes unnoticed
  try {
    const { sendEmail } = await import('@/lib/email/resend')
    const { data: profile } = await admin.from('profiles').select('email').eq('id', user.id).single()
    const { data: config } = await admin.from('tenant_config').select('brand_name, slug').eq('seller_id', user.id).single()
    const sellerEmail = profile?.email ?? 'unknown'
    const brandName = config?.brand_name ?? 'Unknown store'
    const dashboardUrl = config ? `https://instastarz.in/admin/${config.slug}/change-requests` : 'https://instastarz.in/admin'
    await sendEmail({
      to: 'hello@instastarz.in',
      subject: `[Change Request] ${request_type} from ${brandName}${billable ? ' — BILLABLE' : ''}`,
      html: `<p>New change request from <strong>${brandName}</strong> (${sellerEmail}).</p>
<p><strong>Type:</strong> ${request_type}</p>
<p><strong>Description:</strong></p>
<blockquote style="border-left:3px solid #A6134A;margin:8px 0;padding:8px 12px;background:#FAF7F3;">${(description ?? '').replace(/\n/g, '<br/>')}</blockquote>
${billable ? `<p><strong style="color:#B45309;">⚠ Billable overage — ₹${CHANGE_REQUEST_OVERAGE_PRICE_INR}</strong></p>` : ''}
<p><a href="${dashboardUrl}">View in dashboard →</a></p>`,
    })
  } catch { /* best-effort */ }

  return NextResponse.json({ request, billable, charge_amount_inr: billable ? CHANGE_REQUEST_OVERAGE_PRICE_INR : null })
}
