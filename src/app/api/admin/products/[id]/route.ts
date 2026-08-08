import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

type Params = Promise<{ id: string }>

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  if (body.price_inr !== undefined && body.price_inr <= 0)
    return NextResponse.json({ error: 'price_inr must be positive' }, { status: 400 })
  if (body.sizes !== undefined && !Array.isArray(body.sizes))
    return NextResponse.json({ error: 'sizes must be an array' }, { status: 400 })

  const allowed = ['name', 'description', 'category', 'price_inr', 'original_price_inr',
    'sizes', 'colors', 'tags', 'is_active', 'stock_by_variant', 'stock_count']
  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) update[key] = body[key]
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('products')
    .update(update)
    .eq('id', id)
    .eq('seller_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  await admin.from('product_images').delete().eq('product_id', id)
  const { error } = await admin
    .from('products')
    .update({ is_active: false })
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
