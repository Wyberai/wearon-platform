import { createAdminClient } from '@/lib/supabase/server'
import { PLAN_TRY_ON_LIMITS, type Plan } from '@/lib/constants'
import crypto from 'crypto'

const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET ?? ''

function verifySignature(rawBody: string, signatureHeader: string): boolean {
  if (!DODO_WEBHOOK_SECRET) return false
  const expected = crypto
    .createHmac('sha256', DODO_WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex')
  const expectedBuf = Buffer.from(expected, 'utf8')
  const actualBuf = Buffer.from(signatureHeader, 'utf8')
  if (expectedBuf.length !== actualBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, actualBuf)
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get('dodo-signature') ?? ''

  if (!verifySignature(rawBody, signatureHeader)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let event: {
    id: string
    type: string
    data: {
      object: {
        id: string
        customer_id?: string
        subscription_id?: string
        metadata?: Record<string, string>
      }
    }
  }

  try {
    event = JSON.parse(rawBody)
  } catch {
    // Always return 200 so Dodo does not retry a malformed payload
    return new Response('OK', { status: 200 })
  }

  const admin = createAdminClient()

  // Idempotency check — skip if already processed
  const { data: existing } = await admin
    .from('processed_webhooks')
    .select('id')
    .eq('id', event.id)
    .maybeSingle()

  if (existing) {
    return new Response('OK', { status: 200 })
  }

  const obj = event.data?.object ?? {}
  const metadata = obj.metadata ?? {}

  if (event.type === 'payment.succeeded') {
    const sellerId = metadata.seller_id
    const plan = metadata.plan as Plan | undefined

    if (sellerId && plan && plan in PLAN_TRY_ON_LIMITS) {
      await admin
        .from('profiles')
        .update({
          plan,
          subscription_status: 'active',
          try_ons_limit: PLAN_TRY_ON_LIMITS[plan],
          dodo_subscription_id: obj.subscription_id ?? null,
          dodo_customer_id: obj.customer_id ?? null,
        })
        .eq('id', sellerId)

      // Send welcome email — module may not exist yet in all envs
      try {
        const { sendEmail } = await import('@/lib/email/resend')
        const { welcomeEmail } = await import('@/lib/email/templates/welcome')
        const { data: profile } = await admin
          .from('profiles')
          .select('email')
          .eq('id', sellerId)
          .single()
        const { data: config } = await admin
          .from('tenant_config')
          .select('brand_name, slug')
          .eq('seller_id', sellerId)
          .single()
        if (profile?.email && config) {
          const tpl = welcomeEmail({
            brandName: config.brand_name,
            sellerName: profile.email,
            storeUrl: `https://wearon.in/store/${config.slug}`,
          })
          await sendEmail({ to: profile.email, subject: tpl.subject, html: tpl.html })
        }
      } catch {
        // Email is best-effort; do not fail the webhook
      }
    }
  } else if (event.type === 'subscription.cancelled') {
    const sellerId = metadata.seller_id
    if (sellerId) {
      await admin
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          plan: 'free',
          try_ons_limit: PLAN_TRY_ON_LIMITS.free,
        })
        .eq('id', sellerId)
    }
  } else if (event.type === 'subscription.past_due') {
    const sellerId = metadata.seller_id
    if (sellerId) {
      await admin
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('id', sellerId)
    }
  }

  // Record as processed (best-effort — ignore insert errors for unknown event types)
  try {
    await admin.from('processed_webhooks').insert({ id: event.id, source: 'dodo' })
  } catch { /* duplicate or unknown event — safe to ignore */ }

  return new Response('OK', { status: 200 })
}
