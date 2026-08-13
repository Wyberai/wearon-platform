import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/store/discount — validate a discount code at checkout
export async function POST(req: NextRequest) {
  const { seller_id, code, order_total_inr } = await req.json()
  if (!seller_id || !code) return NextResponse.json({ error: 'seller_id and code required' }, { status: 400 })

  const admin = createAdminClient()
  const { data: dc } = await admin
    .from('discount_codes')
    .select('*')
    .eq('seller_id', seller_id)
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single()

  if (!dc) return NextResponse.json({ valid: false, reason: 'Code not found or inactive' })
  if (dc.expires_at && new Date(dc.expires_at) < new Date()) return NextResponse.json({ valid: false, reason: 'Code has expired' })
  if (dc.max_uses && dc.uses_count >= dc.max_uses) return NextResponse.json({ valid: false, reason: 'Code has reached its usage limit' })
  if (dc.min_order_inr && order_total_inr < dc.min_order_inr) {
    return NextResponse.json({ valid: false, reason: `Minimum order of ₹${dc.min_order_inr} required for this code` })
  }

  const discount_amount = dc.discount_type === 'percent'
    ? Math.round((order_total_inr * dc.discount_value) / 100)
    : Math.min(dc.discount_value, order_total_inr)

  return NextResponse.json({ valid: true, discount_type: dc.discount_type, discount_value: dc.discount_value, discount_amount })
}
