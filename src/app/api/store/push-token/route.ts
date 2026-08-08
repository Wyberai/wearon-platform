import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token, slug } = await request.json() as { token?: string; slug?: string }
  if (!token || !slug) return NextResponse.json({ error: 'token and slug required' }, { status: 400 })

  const admin = createAdminClient()

  // Resolve seller from slug
  const { data: config } = await admin
    .from('tenant_config')
    .select('seller_id')
    .eq('slug', slug)
    .single()

  if (!config) return NextResponse.json({ error: 'store not found' }, { status: 404 })

  // Upsert push subscription keyed on token (one device can update its token)
  await admin
    .from('push_subscriptions')
    .upsert(
      { seller_id: config.seller_id, token, platform: 'android', created_at: new Date().toISOString() },
      { onConflict: 'token' },
    )

  return NextResponse.json({ ok: true })
}
