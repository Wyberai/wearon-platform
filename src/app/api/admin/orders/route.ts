import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100)
  const before = url.searchParams.get('before')

  const admin = createAdminClient()
  let query = admin
    .from('orders')
    .select('id, status, items, total_inr, payment_method, whatsapp_confirmed, buyer_phone, buyer_name, buyer_email, buyer_notes, size_selected, shipping_address, tracking_number, tracking_url, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit + 1)

  if (before) {
    query = query.lt('created_at', before)
  }

  const { data: orders } = await query
  const hasMore = (orders?.length ?? 0) > limit
  const page = (orders ?? []).slice(0, limit)
  const nextCursor = hasMore ? page[page.length - 1]?.created_at : null

  return NextResponse.json({ orders: page, next_cursor: nextCursor })
}
