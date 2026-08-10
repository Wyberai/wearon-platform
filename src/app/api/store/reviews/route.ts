import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('product_id')
  if (!productId) return NextResponse.json({ error: 'Missing product_id' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('reviews')
    .select('id, rating, comment, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { product_id, seller_id, device_token, rating, comment } = body

  if (!product_id || !seller_id || !device_token) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'rating must be 1–5' }, { status: 400 })
  }
  if (comment && comment.length > 500) {
    return NextResponse.json({ error: 'comment max 500 characters' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('reviews')
    .select('id')
    .eq('product_id', product_id)
    .eq('device_token', device_token)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 })
  }

  const { data, error } = await admin
    .from('reviews')
    .insert({ product_id, seller_id, device_token, rating, comment: comment ?? null })
    .select('id, rating, comment, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
