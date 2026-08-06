import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/admin/products?slug=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: products } = await admin.from('products').select('id, name, price_inr, category, garment_image_url, is_active, created_at')
    .eq('seller_id', user.id).order('created_at', { ascending: false })

  return NextResponse.json({ products: products ?? [] })
}

// POST /api/admin/products — multipart form upload
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const garmentFile = formData.get('garment') as File | null
  if (!garmentFile) return NextResponse.json({ error: 'No garment image' }, { status: 400 })

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const priceStr = formData.get('price_inr') as string
  const originalPriceStr = formData.get('original_price_inr') as string
  const category = formData.get('category') as string
  const sizesStr = formData.get('sizes') as string

  const priceInr = parseInt(priceStr)
  if (!name || isNaN(priceInr)) return NextResponse.json({ error: 'Name and price required' }, { status: 400 })

  const admin = createAdminClient()

  // Check product limit
  const { data: profile } = await admin.from('profiles').select('plan').eq('id', user.id).single()
  const LIMITS: Record<string, number> = { free: 10, starter: 50, growth: 200, pro: 9999, enterprise: 9999 }
  const limit = LIMITS[profile?.plan ?? 'free']
  const { count } = await admin.from('products').select('id', { count: 'exact' }).eq('seller_id', user.id)
  if ((count ?? 0) >= limit) {
    return NextResponse.json({ error: `Product limit reached for your plan (${limit}). Upgrade to add more.` }, { status: 403 })
  }

  // Upload garment image
  const buffer = Buffer.from(await garmentFile.arrayBuffer())
  const ext = garmentFile.type === 'image/png' ? 'png' : 'jpg'
  const path = `garments/${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await admin.storage.from('wearon-assets').upload(path, buffer, {
    contentType: garmentFile.type,
    upsert: false,
  })
  if (uploadError) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

  const { data: { publicUrl } } = admin.storage.from('wearon-assets').getPublicUrl(path)

  // Generate slug
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
  const productSlug = `${baseSlug}-${Date.now().toString(36)}`

  const sizes = sizesStr ? sizesStr.split(',').map((s: string) => s.trim()).filter(Boolean) : []

  const { data: product, error: insertError } = await admin.from('products').insert({
    seller_id: user.id,
    name,
    description: description || null,
    price_inr: priceInr,
    original_price_inr: originalPriceStr ? parseInt(originalPriceStr) : null,
    category: category || null,
    garment_image_url: publicUrl,
    slug: productSlug,
    sizes,
    is_active: true,
  }).select('id').single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  // Async: trigger garment preprocessing (background, non-blocking)
  if (process.env.WEARON_AI_URL) {
    fetch(`${process.env.WEARON_AI_URL}/preprocess/garment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Secret': process.env.WEARON_AI_SECRET! },
      body: JSON.stringify({ product_id: product?.id, garment_url: publicUrl }),
    }).catch(console.error)
  }

  return NextResponse.json({ ok: true, product_id: product?.id })
}
