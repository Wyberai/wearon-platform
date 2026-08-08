import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — list push subscriptions for this seller
export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, token, platform, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ subscriptions })
}

// POST — register a push token
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { token, platform } = body as { token?: string; platform?: 'fcm' | 'apns' }

  if (!token || !platform) {
    return NextResponse.json({ error: 'token and platform are required' }, { status: 400 })
  }

  if (platform !== 'fcm' && platform !== 'apns') {
    return NextResponse.json({ error: "platform must be 'fcm' or 'apns'" }, { status: 400 })
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { seller_id: user.id, token, platform, updated_at: new Date().toISOString() },
      { onConflict: 'token' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ registered: true })
}

// DELETE — remove a push token
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { token } = body as { token?: string }

  if (!token) {
    return NextResponse.json({ error: 'token is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('seller_id', user.id)
    .eq('token', token)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ removed: true })
}
