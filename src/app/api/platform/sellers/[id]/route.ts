import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function isPlatformOwner(email: string | undefined) {
  return email && email === process.env.PLATFORM_OWNER_EMAIL
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const admin = createAdminClient()

  const [profileRes, configRes, ordersRes, buildsRes, whatsappRes] = await Promise.all([
    admin.from('profiles').select('*').eq('id', id).single(),
    admin.from('tenant_config').select('*').eq('seller_id', id).single(),
    admin.from('orders').select('id, status, total_inr, payment_method, created_at, items').eq('seller_id', id).order('created_at', { ascending: false }).limit(20),
    admin.from('apk_builds').select('*').eq('seller_id', id).order('triggered_at', { ascending: false }).limit(5),
    admin.from('whatsapp_connections').select('*').eq('seller_id', id).single(),
  ])

  if (!profileRes.data) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

  return NextResponse.json({
    profile: profileRes.data,
    config: configRes.data,
    recent_orders: ordersRes.data ?? [],
    apk_builds: buildsRes.data ?? [],
    whatsapp_connection: whatsappRes.data,
  })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const admin = createAdminClient()

  const allowedProfileFields = ['plan', 'ai_credits', 'ai_reply_limit', 'subscription_status', 'is_suspended']
  const profileUpdates: Record<string, unknown> = {}
  for (const key of allowedProfileFields) {
    if (key in body) profileUpdates[key] = body[key]
  }

  if (Object.keys(profileUpdates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { error } = await admin.from('profiles').update(profileUpdates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
