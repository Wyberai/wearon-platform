import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendPushToSeller } from '@/lib/push/fcm'

interface CartItemInput {
  product_id: string
  quantity: number
  size?: string
}

interface CheckoutBody {
  seller_id: string
  // Single-item shape (existing PDP "buy now" flow) — kept unchanged.
  product_id?: string
  quantity?: number
  size?: string
  // Multi-item shape (cart-based checkout, e.g. the January theme) — either
  // this or product_id/quantity must be present, not both.
  items?: CartItemInput[]
  payment_method: 'razorpay' | 'cod'
  device_token: string
  buyer_phone?: string
  buyer_name?: string
  buyer_email?: string
  shipping_address?: { name?: string; line1?: string; line2?: string; city?: string; state?: string; pincode?: string; country?: string }
}

interface OrderItem {
  product_id: string
  name: string
  quantity: number
  price_inr: number
  cost_price_inr?: number
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

  const { seller_id, payment_method, device_token, buyer_phone, buyer_name, buyer_email, shipping_address } = body

  if (!seller_id || typeof seller_id !== 'string') return badRequest('seller_id is required')
  if (payment_method !== 'razorpay' && payment_method !== 'cod') {
    return badRequest('payment_method must be "razorpay" or "cod"')
  }
  if (!device_token || typeof device_token !== 'string') return badRequest('device_token is required')

  const supabase = createAdminClient()

  // --- 1. Normalize into a cart of {product_id, quantity, size?} ---
  const cart: CartItemInput[] = Array.isArray(body.items) && body.items.length > 0
    ? body.items
    : (body.product_id ? [{ product_id: body.product_id, quantity: body.quantity ?? 1, size: body.size }] : [])

  if (cart.length === 0) return badRequest('items (or product_id) is required')
  for (const item of cart) {
    if (!item.product_id || typeof item.product_id !== 'string') return badRequest('each item requires product_id')
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
      return badRequest('each item requires a positive integer quantity')
    }
  }

  // --- 2. Fetch and validate every product in one query ---
  const productIds = [...new Set(cart.map(i => i.product_id))]
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, seller_id, name, price_inr, cost_price_inr, is_active, sizes')
    .in('id', productIds)
    .eq('seller_id', seller_id)

  if (productError || !products || products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more products were not found' }, { status: 404 })
  }
  const inactive = products.find(p => !p.is_active)
  if (inactive) {
    return NextResponse.json({ error: `${inactive.name} is no longer available` }, { status: 410 })
  }
  const productById = new Map(products.map(p => [p.id, p]))

  // --- 3. Fetch tenant_config for payment credentials ---
  const { data: tenantConfig, error: configError } = await supabase
    .from('tenant_config')
    .select('payment_config, payment_method, slug, brand_name, primary_color')
    .eq('seller_id', seller_id)
    .single()

  if (configError || !tenantConfig) {
    return NextResponse.json({ error: 'Store configuration not found' }, { status: 404 })
  }

  const paymentConfig: Record<string, string> = tenantConfig.payment_config ?? {}

  // --- 4. Build order items + total ---
  // Snapshot cost/price at order time so margin stays accurate even if the
  // seller edits a product's price or cost later.
  const orderItems: OrderItem[] = cart.map(item => {
    const product = productById.get(item.product_id)!
    return {
      product_id: item.product_id,
      name: product.name,
      quantity: item.quantity,
      price_inr: product.price_inr,
      ...(product.cost_price_inr != null ? { cost_price_inr: product.cost_price_inr } : {}),
      ...(item.size ? { size: item.size } : {}),
    }
  })
  const total = orderItems.reduce((sum, i) => sum + i.price_inr * i.quantity, 0)
  const summaryLabel = orderItems.length === 1 ? orderItems[0].name : `${orderItems.length} items`

  const orderId = crypto.randomUUID()

  const buyerNotes = {
    ...(buyer_name ? { buyer_name } : {}),
    ...(buyer_phone ? { buyer_phone } : {}),
    ...(buyer_email ? { buyer_email } : {}),
    device_token,
  }

  async function sendBuyerEmail(orderId: string) {
    if (!buyer_email) return
    try {
      const { sendEmail } = await import('@/lib/email/resend')
      const { buyerConfirmationEmail } = await import('@/lib/email/templates/buyer-confirmation')
      const tpl = buyerConfirmationEmail({
        brandName: tenantConfig!.brand_name ?? 'Our Boutique',
        primaryColor: tenantConfig!.primary_color ?? '#F72585',
        orderId,
        items: orderItems.map(i => ({ name: i.name, qty: i.quantity, price: i.price_inr })),
        totalInr: total,
        size: orderItems.length === 1 ? orderItems[0].size : undefined,
        storeSlug: tenantConfig!.slug,
      })
      await sendEmail({ to: buyer_email, subject: tpl.subject, html: tpl.html })
    } catch { /* email is best-effort */ }
  }

  async function sendSellerOrderEmail(orderId: string) {
    try {
      const { sendEmail } = await import('@/lib/email/resend')
      const { orderEmail } = await import('@/lib/email/templates/order')
      const { data: sellerProfile } = await supabase.from('profiles').select('email').eq('id', seller_id).single()
      if (!sellerProfile?.email) return
      const tpl = orderEmail({
        brandName: tenantConfig!.brand_name ?? 'Your Store',
        orderId,
        slug: tenantConfig!.slug,
        items: orderItems.map(i => ({ name: i.name, qty: i.quantity, price: i.price_inr })),
        totalInr: total,
        buyerPhone: buyer_phone,
      })
      await sendEmail({ to: sellerProfile.email, subject: tpl.subject, html: tpl.html })
    } catch { /* email is best-effort */ }
  }

  // --- 5a. Razorpay payment flow ---
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
            product_ids: productIds.join(','),
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
      items: orderItems,
      total_inr: total,
      payment_method: 'razorpay',
      razorpay_order_id: razorpayOrder.id,
      whatsapp_confirmed: false,
      shipping_address: shipping_address ?? null,
      buyer_email: buyer_email ?? null,
      buyer_phone: buyer_phone ?? null,
      buyer_notes: Object.keys(buyerNotes).length > 0 ? JSON.stringify(buyerNotes) : null,
    })

    if (insertError) {
      console.error('[checkout] DB insert error (razorpay):', insertError)
      return NextResponse.json({ error: 'Failed to record order' }, { status: 500 })
    }

    sendPushToSeller(seller_id, 'New order! 🎉', `₹${total.toLocaleString('en-IN')} — ${summaryLabel}`, { url: `/admin/${tenantConfig.slug}/orders` }).catch(() => {})
    sendBuyerEmail(orderId).catch(() => {})
    sendSellerOrderEmail(orderId).catch(() => {})

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      razorpay_key_id,
      amount: total * 100,
      order_id: orderId,
    })
  }

  // --- 5b. COD payment flow ---
  const { error: insertError } = await supabase.from('orders').insert({
    id: orderId,
    seller_id,
    status: 'pending',
    items: orderItems,
    total_inr: total,
    payment_method: 'cod',
    whatsapp_confirmed: false,
    shipping_address: shipping_address ?? null,
    buyer_email: buyer_email ?? null,
    buyer_phone: buyer_phone ?? null,
    buyer_notes: Object.keys(buyerNotes).length > 0 ? JSON.stringify(buyerNotes) : null,
  })

  if (insertError) {
    console.error('[checkout] DB insert error (cod):', insertError)
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 })
  }

  sendPushToSeller(seller_id, 'New order! 🎉', `₹${total.toLocaleString('en-IN')} — ${summaryLabel} (COD)`, { url: `/admin/${tenantConfig.slug}/orders` }).catch(() => {})
  sendBuyerEmail(orderId).catch(() => {})
  sendSellerOrderEmail(orderId).catch(() => {})

  return NextResponse.json({
    order_id: orderId,
    status: 'pending',
    message: 'COD order placed. Seller will confirm via WhatsApp.',
  })
}
