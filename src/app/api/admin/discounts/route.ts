import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/admin/discounts?slug=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: codes } = await admin
    .from('discount_codes')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ codes: codes ?? [] })
}

// POST /api/admin/discounts — create a code
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { slug, code, discount_type, discount_value, min_order_inr, max_uses, expires_at } = body

  if (!code || !discount_type || !discount_value) {
    return NextResponse.json({ error: 'code, discount_type, and discount_value are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('discount_codes')
    .insert({
      seller_id: user.id,
      code: code.toUpperCase().trim(),
      discount_type,
      discount_value,
      min_order_inr: min_order_inr || null,
      max_uses: max_uses || null,
      expires_at: expires_at || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ code: data })
}

// PATCH /api/admin/discounts — toggle active
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, is_active } = await request.json()
  const admin = createAdminClient()
  const { error } = await admin.from('discount_codes').update({ is_active }).eq('id', id).eq('seller_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE /api/admin/discounts?id=xxx
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { error } = await admin.from('discount_codes').delete().eq('id', id!).eq('seller_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
