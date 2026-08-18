import { createAdminClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''

// Razorpay server-to-server webhooks sign the raw request body, NOT the
// orderId|paymentId string (that format is for client-side capture verification).
function verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) return false
  const expected = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex')
  const expectedBuf = Buffer.from(expected, 'utf8')
  const actualBuf = Buffer.from(signatureHeader, 'utf8')
  if (expectedBuf.length !== actualBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, actualBuf)
}

export async function POST(request: Request) {
  const rawBody = await request.text()

  let event: {
    entity: string
    event: string
    payload?: {
      payment?: {
        entity?: {
          id?: string
          order_id?: string
        }
      }
    }
  }

  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response('OK', { status: 200 })
  }

  if (event.event !== 'payment.captured') {
    return new Response('OK', { status: 200 })
  }

  const paymentEntity = event.payload?.payment?.entity ?? {}
  const razorpayPaymentId = paymentEntity.id ?? ''
  const razorpayOrderId = paymentEntity.order_id ?? ''

  if (!razorpayPaymentId || !razorpayOrderId) {
    return new Response('OK', { status: 200 })
  }

  const signatureHeader = request.headers.get('x-razorpay-signature') ?? ''

  if (!verifyWebhookSignature(rawBody, signatureHeader)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const admin = createAdminClient()

  // Idempotency — use payment ID as the unique webhook event key
  const webhookId = `razorpay_${razorpayPaymentId}`
  const { data: existing } = await admin
    .from('processed_webhooks')
    .select('id')
    .eq('id', webhookId)
    .maybeSingle()

  if (existing) {
    return new Response('OK', { status: 200 })
  }

  // Find the order by the Razorpay order ID stored at order creation —
  // checkout writes razorpay_order_id, not the legacy payment_id column,
  // so this used to never match and orders never auto-confirmed.
  const { data: order } = await admin
    .from('orders')
    .select('id')
    .eq('razorpay_order_id', razorpayOrderId)
    .eq('payment_method', 'razorpay')
    .maybeSingle()

  if (order) {
    await admin
      .from('orders')
      .update({
        status: 'confirmed',
        razorpay_payment_id: razorpayPaymentId,
      })
      .eq('id', order.id)

    try {
      const { sendEmail } = await import('@/lib/email/resend')
      const { buyerConfirmationEmail } = await import('@/lib/email/templates/buyer-confirmation')
      const { data: fullOrder } = await admin
        .from('orders')
        .select('id, items, total_inr, buyer_email, seller_id')
        .eq('id', order.id)
        .single()
      if (fullOrder?.buyer_email) {
        const { data: config } = await admin
          .from('tenant_config')
          .select('brand_name, slug, primary_color')
          .eq('seller_id', fullOrder.seller_id)
          .single()
        if (config) {
          const tpl = buyerConfirmationEmail({
            brandName: config.brand_name,
            primaryColor: config.primary_color ?? undefined,
            orderId: fullOrder.id,
            items: (fullOrder.items ?? []) as Array<{ name: string; qty: number; price: number }>,
            totalInr: fullOrder.total_inr,
            storeSlug: config.slug,
          })
          await sendEmail({ to: fullOrder.buyer_email, subject: tpl.subject, html: tpl.html })
        }
      }
    } catch { /* best-effort */ }
  }

  try {
    await admin.from('processed_webhooks').insert({ id: webhookId, source: 'razorpay' })
  } catch { /* duplicate — safe to ignore */ }

  return new Response('OK', { status: 200 })
}
