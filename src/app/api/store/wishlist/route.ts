import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/store/wishlist?seller_id=...&device_token=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seller_id = searchParams.get('seller_id')
  const device_token = searchParams.get('device_token')

  if (!seller_id || !device_token) {
    return NextResponse.json({ error: 'seller_id and device_token are required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id, products(*)')
    .eq('seller_id', seller_id)
    .eq('device_token', device_token)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

// POST /api/store/wishlist — add item; on conflict do nothing
export async function POST(req: NextRequest) {
  let body: { seller_id?: string; product_id?: string; device_token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { seller_id, product_id, device_token } = body

  if (!seller_id || !product_id || !device_token) {
    return NextResponse.json(
      { error: 'seller_id, product_id and device_token are required' },
      { status: 400 },
    )
  }

  const supabase = createAdminClient()

  // upsert with ignoreDuplicates implements "ON CONFLICT DO NOTHING"
  const { error } = await supabase
    .from('wishlists')
    .upsert(
      { device_token, product_id, seller_id },
      { onConflict: 'device_token,product_id', ignoreDuplicates: true },
    )

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ added: true })
}

// DELETE /api/store/wishlist — remove item
export async function DELETE(req: NextRequest) {
  let body: { product_id?: string; device_token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { product_id, device_token } = body

  if (!product_id || !device_token) {
    return NextResponse.json({ error: 'product_id and device_token are required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('product_id', product_id)
    .eq('device_token', device_token)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ removed: true })
}
