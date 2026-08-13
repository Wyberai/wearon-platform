import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/store/[slug]/orders?email=xxx — buyer self-service order lookup
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')?.toLowerCase().trim()

  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  // Basic email format guard
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: config } = await admin
    .from('tenant_config')
    .select('seller_id, brand_name, primary_color')
    .eq('slug', slug)
    .single()

  if (!config) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const { data: orders } = await admin
    .from('orders')
    .select('id, status, items, total_inr, payment_method, tracking_number, tracking_url, shipped_at, created_at, shipping_address')
    .eq('seller_id', config.seller_id)
    .eq('buyer_email', email)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json({
    orders: orders ?? [],
    brand_name: config.brand_name,
    primary_color: config.primary_color,
  })
}
