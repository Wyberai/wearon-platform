import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: orders } = await admin
    .from('orders')
    .select('id, status, items, total_inr, payment_method, whatsapp_confirmed, buyer_phone, buyer_name, size_selected, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  return NextResponse.json({ orders: orders ?? [] })
}
