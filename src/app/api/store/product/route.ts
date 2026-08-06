import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const DEMO_PRODUCTS: Record<string, object> = {
  p1: { id: 'p1', name: 'Floral Cotton Kurti', price_inr: 899, original_price_inr: 1499, garment_image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop', sizes: ['S', 'M', 'L', 'XL'], description: 'Light and breezy cotton fabric. Perfect for daily wear.' },
  p2: { id: 'p2', name: 'Embroidered Anarkali', price_inr: 2499, original_price_inr: 3999, garment_image_url: 'https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=400&h=400&fit=crop', sizes: ['S', 'M', 'L'], description: 'Festive embroidered anarkali for special occasions.' },
  p3: { id: 'p3', name: 'Silk Saree', price_inr: 4999, original_price_inr: null, garment_image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop', sizes: ['Free Size'], description: 'Premium pure silk saree with zari border.' },
  p4: { id: 'p4', name: 'Casual Palazzo Set', price_inr: 1299, original_price_inr: 1799, garment_image_url: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=400&fit=crop', sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Comfortable everyday palazzo set in soft fabric.' },
}

const DEMO_CONFIG = {
  brand_name: 'Demo Boutique',
  primary_color: '#E91E63',
  whatsapp_number: '+919876543210',
  payment_method: 'whatsapp_order',
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

  const [configResult, productResult] = await Promise.all([
    admin.from('tenant_config').select('brand_name, primary_color, whatsapp_number, payment_method').eq('slug', slug).single(),
    admin.from('products').select('id, name, price_inr, original_price_inr, garment_image_url, sizes, description').eq('id', productId).eq('is_active', true).single(),
  ])

  if (!productResult.data) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return NextResponse.json({
    product: productResult.data,
    config: configResult.data ?? DEMO_CONFIG,
  })
}
