import { createAdminClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''

function verifySignature(orderId: string, paymentId: string, signatureHeader: string): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) return false
  const payload = `${orderId}|${paymentId}`
  const expected = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(payload, 'utf8')
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

  if (!verifySignature(razorpayOrderId, razorpayPaymentId, signatureHeader)) {
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

  // Find the order by the Razorpay order ID stored in payment_id at order creation
  const { data: order } = await admin
    .from('orders')
    .select('id')
    .eq('payment_id', razorpayOrderId)
    .eq('payment_method', 'razorpay')
    .maybeSingle()

  if (order) {
    await admin
      .from('orders')
      .update({
        status: 'confirmed',
        payment_id: razorpayPaymentId,
      })
      .eq('id', order.id)
  }

  try {
    await admin.from('processed_webhooks').insert({ id: webhookId, source: 'razorpay' })
  } catch { /* duplicate — safe to ignore */ }

  return new Response('OK', { status: 200 })
}
