import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let body: { seller_id?: string; device_token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { seller_id, device_token } = body

  if (!seller_id) {
    return NextResponse.json({ error: 'seller_id is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // If device_token provided, try to find an existing session for this seller+device
  if (device_token) {
    const { data: existing } = await supabase
      .from('buyer_sessions')
      .select('id, device_token')
      .eq('seller_id', seller_id)
      .eq('device_token', device_token)
      .single()

    if (existing) {
      return NextResponse.json({ session_id: existing.id, device_token: existing.device_token })
    }
  }

  // Create a new session — generate a fresh token if none was supplied
  const newToken = device_token ?? crypto.randomUUID()

  const { data, error } = await supabase
    .from('buyer_sessions')
    .insert({ seller_id, device_token: newToken })
    .select('id, device_token')
    .single()

  if (error) {
    // Race-condition: another request already inserted the same token
    if (error.code === '23505') {
      const { data: race } = await supabase
        .from('buyer_sessions')
        .select('id, device_token')
        .eq('seller_id', seller_id)
        .eq('device_token', newToken)
        .single()
      if (race) {
        return NextResponse.json({ session_id: race.id, device_token: race.device_token })
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ session_id: data.id, device_token: data.device_token })
}
