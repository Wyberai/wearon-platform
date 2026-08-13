import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Never cache — see store/products/route.ts for why this matters.
export const dynamic = 'force-dynamic'

const DEMO_PRODUCTS: Record<string, object> = {
  p1: { id: 'p1', name: 'Satin Slip Maxi Dress', price_inr: 89, original_price_inr: 120, category: 'Dresses', garment_image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Champagne', 'Black', 'Sage'], description: 'Fluid satin with adjustable straps. Runs true to size.' },
  p2: { id: 'p2', name: 'Floral Wrap Midi Dress', price_inr: 72, original_price_inr: null, category: 'Dresses', garment_image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop', sizes: ['XS', 'S', 'M', 'L'], colors: ['Floral Print'], description: 'Lightweight wrap silhouette, adjustable tie waist.' },
  p3: { id: 'p3', name: 'High-Rise Straight Jeans', price_inr: 98, original_price_inr: null, category: 'Denim', garment_image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop', sizes: ['24', '25', '26', '27', '28', '29', '30'], colors: ['Mid Wash', 'Dark Wash', 'Light Wash'], description: 'Classic high-rise with a straight leg. 98% cotton, slight stretch.' },
  p4: { id: 'p4', name: 'Camel Trench Coat', price_inr: 195, original_price_inr: null, category: 'Outerwear', garment_image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=1000&fit=crop', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Camel', 'Khaki'], description: 'Belted trench in a water-repellent shell. Timeless silhouette.' },
}

const DEMO_CONFIG = {
  seller_id: 'demo',
  brand_name: 'Demo Boutique',
  primary_color: '#E91E63',
  whatsapp_number: '+12125551234',
  payment_method: 'whatsapp_order',
  currency: 'USD',
  razorpay_available: false,
}

// GET /api/store/product?slug=xxx&productId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const productId = searchParams.get('productId')

  if (!slug || !productId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  // Serve demo data without hitting DB
  if (slug === 'demo' && DEMO_PRODUCTS[productId]) {
    return NextResponse.json({ product: DEMO_PRODUCTS[productId], config: DEMO_CONFIG })
  }

  const admin = createAdminClient()

  // payment_config is fetched here (server-only) purely to compute the
  // razorpay_available boolean below — it never goes into the response, so
  // a Razorpay key_secret can't leak to the buyer's browser.
  const [configResult, productResult] = await Promise.all([
    admin.from('tenant_config').select('seller_id, brand_name, primary_color, whatsapp_number, payment_method, payment_config').eq('slug', slug).single(),
    admin.from('products').select('id, seller_id, name, price_inr, original_price_inr, garment_image_url, sizes, description').eq('id', productId).eq('is_active', true).single(),
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
          razorpay_available: razorpayAvailable,
        }
      : DEMO_CONFIG,
  })
}
