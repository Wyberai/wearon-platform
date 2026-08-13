import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { US_DEMO_PRODUCTS, US_DEMO_CONFIG } from '@/lib/demo-products'

export const dynamic = 'force-dynamic'

const DEMO_CONFIG = {
  seller_id: 'demo',
  brand_name: US_DEMO_CONFIG.brand_name,
  primary_color: US_DEMO_CONFIG.primary_color,
  whatsapp_number: US_DEMO_CONFIG.whatsapp_number,
  payment_method: US_DEMO_CONFIG.payment_method,
  currency: US_DEMO_CONFIG.currency,
  razorpay_available: false,
}

// GET /api/store/product?slug=xxx&productId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const productId = searchParams.get('productId')

  if (!slug || !productId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  if (slug === 'demo') {
    const p = US_DEMO_PRODUCTS.find(x => x.id === productId || x.slug === productId)
    if (p) return NextResponse.json({ product: p, config: DEMO_CONFIG })
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const admin = createAdminClient()

  const [configResult, productResult] = await Promise.all([
    admin.from('tenant_config').select('seller_id, brand_name, primary_color, whatsapp_number, payment_method, payment_config, currency').eq('slug', slug).single(),
    admin.from('products').select('id, seller_id, name, price_inr, original_price_inr, garment_image_url, sizes, colors, description, category, tags, slug, stock_by_variant').eq('id', productId).eq('is_active', true).single(),
  ])

  if (!productResult.data) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const paymentConfig = (configResult.data?.payment_config ?? {}) as Record<string, string>
  const razorpayAvailable = configResult.data?.payment_method === 'razorpay'
    && !!paymentConfig.razorpay_key_id && !!paymentConfig.razorpay_key_secret

  return NextResponse.json({
    product: productResult.data,
    config: configResult.data
      ? {
          seller_id: configResult.data.seller_id,
          brand_name: configResult.data.brand_name,
          primary_color: configResult.data.primary_color,
          whatsapp_number: configResult.data.whatsapp_number,
          payment_method: configResult.data.payment_method,
          currency: configResult.data.currency ?? 'USD',
          razorpay_available: razorpayAvailable,
        }
      : DEMO_CONFIG,
  })
}
