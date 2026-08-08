import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

interface CheckoutBody {
  seller_id: string
  product_id: string
  quantity: number
  payment_method: 'razorpay' | 'cod'
  device_token: string
  buyer_phone?: string
  buyer_name?: string
  size?: string
}

interface RazorpayOrderResponse {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Record<string, string>
  created_at: number
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody
  try {
    body = await req.json()
  } catch {
    return badRequest('Invalid JSON body')
  }

  const { seller_id, product_id, quantity, payment_method, device_token, buyer_phone, buyer_name, size } = body

  // --- Validate required fields ---
  if (!seller_id || typeof seller_id !== 'string') return badRequest('seller_id is required')
  if (!product_id || typeof product_id !== 'string') return badRequest('product_id is required')
  if (!quantity || typeof quantity !== 'number' || quantity < 1 || !Number.isInteger(quantity)) {
    return badRequest('quantity must be a positive integer')
  }
  if (payment_method !== 'razorpay' && payment_method !== 'cod') {
    return badRequest('payment_method must be "razorpay" or "cod"')
  }
  if (!device_token || typeof device_token !== 'string') return badRequest('device_token is required')

  const supabase = createAdminClient()

  // --- 1. Fetch and validate product ---
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, seller_id, name, price_inr, is_active, sizes')
    .eq('id', product_id)
    .eq('seller_id', seller_id)
    .single()

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  if (!product.is_active) {
    return NextResponse.json({ error: 'Product is no longer available' }, { status: 410 })
  }

  // --- 2. Fetch tenant_config for payment credentials ---
  const { data: tenantConfig, error: configError } = await supabase
    .from('tenant_config')
    .select('payment_config, payment_method')
    .eq('seller_id', seller_id)
    .single()

  if (configError || !tenantConfig) {
    return NextResponse.json({ error: 'Store configuration not found' }, { status: 404 })
  }

  const paymentConfig: Record<string, string> = tenantConfig.payment_config ?? {}

  // --- 3. Calculate total ---
  const total = product.price_inr * quantity

  // Build the order id upfront so it can be used as Razorpay receipt
  const orderId = crypto.randomUUID()

  const orderItem = {
    product_id,
    name: product.name,
    quantity,
    price_inr: product.price_inr,
    ...(size ? { size } : {}),
  }

  const buyerNotes = {
    ...(buyer_name ? { buyer_name } : {}),
    ...(buyer_phone ? { buyer_phone } : {}),
    device_token,
  }

  // --- 4a. Razorpay payment flow ---
  if (payment_method === 'razorpay') {
    const { razorpay_key_id, razorpay_key_secret } = paymentConfig

    if (!razorpay_key_id || !razorpay_key_secret) {
      return NextResponse.json(
        { error: 'Razorpay is not configured for this store' },
        { status: 422 }
      )
    }

    // Create Razorpay order via REST API (no SDK)
    const credentials = Buffer.from(`${razorpay_key_id}:${razorpay_key_secret}`).toString('base64')
    let razorpayOrder: RazorpayOrderResponse
    try {
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total * 100, // Razorpay expects paise
          currency: 'INR',
          receipt: orderId,
          notes: {
            product_id,
            seller_id,
            device_token,
          },
        }),
      })

      if (!rzpRes.ok) {
        const errBody = await rzpRes.text()
        console.error('[checkout] Razorpay order creation failed:', rzpRes.status, errBody)
        return NextResponse.json(
          { error: 'Failed to create Razorpay order. Check store payment settings.' },
          { status: 502 }
        )
      }

      razorpayOrder = (await rzpRes.json()) as RazorpayOrderResponse
    } catch (err) {
      console.error('[checkout] Razorpay fetch error:', err)
      return NextResponse.json({ error: 'Payment gateway unreachable' }, { status: 502 })
    }

    // Persist order in DB
    const { error: insertError } = await supabase.from('orders').insert({
      id: orderId,
      seller_id,
      status: 'pending',
      items: [orderItem],
      total_inr: total,
      payment_method: 'razorpay',
      razorpay_order_id: razorpayOrder.id,
      whatsapp_confirmed: false,
      buyer_notes: Object.keys(buyerNotes).length > 0 ? JSON.stringify(buyerNotes) : null,
    })

    if (insertError) {
      console.error('[checkout] DB insert error (razorpay):', insertError)
      return NextResponse.json({ error: 'Failed to record order' }, { status: 500 })
    }

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      razorpay_key_id,
      amount: total * 100,
      order_id: orderId,
    })
  }

  // --- 4b. COD payment flow ---
  const { error: insertError } = await supabase.from('orders').insert({
    id: orderId,
    seller_id,
    status: 'pending',
    items: [orderItem],
    total_inr: total,
    payment_method: 'cod',
    whatsapp_confirmed: false,
    buyer_notes: Object.keys(buyerNotes).length > 0 ? JSON.stringify(buyerNotes) : null,
  })

  if (insertError) {
    console.error('[checkout] DB insert error (cod):', insertError)
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 })
  }

  return NextResponse.json({
    order_id: orderId,
    status: 'pending',
    message: 'COD order placed. Seller will confirm via WhatsApp.',
  })
}
