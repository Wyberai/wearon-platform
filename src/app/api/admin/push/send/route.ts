import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendPushNotification } from '@/lib/push/fcm'

// POST /api/admin/push/send — admin-only: send push to all of a seller's devices
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.email !== process.env.PLATFORM_OWNER_EMAIL) {
    return NextResponse.json({ error: 'Forbidden — platform owner only' }, { status: 403 })
  }

  const adminClient = createAdminClient()

  const body = await req.json()
  const { title, body: messageBody, seller_id } = body as {
    title?: string
    body?: string
    seller_id?: string
  }

  if (!title || !messageBody || !seller_id) {
    return NextResponse.json(
      { error: 'title, body, and seller_id are required' },
      { status: 400 }
    )
  }

  const { data: subscriptions, error: subError } = await adminClient
    .from('push_subscriptions')
    .select('token, platform')
    .eq('seller_id', seller_id)

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 })
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No subscriptions found for this seller' })
  }

  let sent = 0
  const errors: string[] = []

  for (const sub of subscriptions) {
    try {
      await sendPushNotification({ token: sub.token, platform: sub.platform, title, body: messageBody })
      sent++
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err))
    }
  }

  return NextResponse.json({ sent, total: subscriptions.length, errors })
}
