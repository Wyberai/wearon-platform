import { createAdminClient } from '@/lib/supabase/server'
import { PLAN_AI_CREDIT_LIMITS, PLAN_AI_REPLY_LIMITS, type Plan } from '@/lib/constants'
import crypto from 'crypto'

const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET ?? ''

// Dodo follows the Standard Webhooks spec (https://www.standardwebhooks.com/),
// not a bare HMAC-over-body scheme: the secret is base64, prefixed `whsec_`;
// the signed content is `{webhook-id}.{webhook-timestamp}.{body}`; the
// signature is base64 HMAC-SHA256, sent as a space-delimited list of
// `v1,<sig>` values (supports key rotation, hence checking every entry).
function verifySignature(webhookId: string, timestamp: string, rawBody: string, signatureHeader: string): boolean {
  if (!DODO_WEBHOOK_SECRET || !webhookId || !timestamp || !signatureHeader) return false

  // Reject stale/replayed deliveries — 5 minute tolerance, same as Stripe's default.
  const timestampMs = Number(timestamp) * 1000
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) return false

  const secretKey = Buffer.from(DODO_WEBHOOK_SECRET.replace(/^whsec_/, ''), 'base64')
  const signedContent = `${webhookId}.${timestamp}.${rawBody}`
  const expected = crypto.createHmac('sha256', secretKey).update(signedContent, 'utf8').digest('base64')
  const expectedBuf = Buffer.from(expected, 'utf8')

  return signatureHeader.split(' ').some(entry => {
    const [version, value] = entry.split(',')
    if (version !== 'v1' || !value) return false
    const actualBuf = Buffer.from(value, 'utf8')
    return expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf)
  })
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const webhookId = request.headers.get('webhook-id') ?? ''
  const timestamp = request.headers.get('webhook-timestamp') ?? ''
  const signatureHeader = request.headers.get('webhook-signature') ?? ''

  if (!verifySignature(webhookId, timestamp, rawBody, signatureHeader)) {
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

    if (sellerId && plan && plan in PLAN_AI_CREDIT_LIMITS) {
      await admin
        .from('profiles')
        .update({
          plan,
          subscription_status: 'active',
          ai_credits: PLAN_AI_CREDIT_LIMITS[plan],
          ai_reply_limit: PLAN_AI_REPLY_LIMITS[plan],
          dodo_subscription_id: obj.subscription_id ?? null,
          dodo_customer_id: obj.customer_id ?? null,
        })
        .eq('id', sellerId)

      try {
        const { sendEmail } = await import('@/lib/email/resend')
        const { planUpgradeEmail } = await import('@/lib/email/templates/plan-upgrade')
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
          const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in'
          const tpl = planUpgradeEmail({
            brandName: config.brand_name,
            plan,
            dashboardUrl: `${appUrl}/admin/${config.slug}/billing`,
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
          ai_credits: PLAN_AI_CREDIT_LIMITS.free,
          ai_reply_limit: PLAN_AI_REPLY_LIMITS.free,
        })
        .eq('id', sellerId)

      try {
        const { sendEmail } = await import('@/lib/email/resend')
        const { subscriptionCancelledEmail } = await import('@/lib/email/templates/subscription-cancelled')
        const { data: profile } = await admin.from('profiles').select('email').eq('id', sellerId).single()
        const { data: config } = await admin.from('tenant_config').select('brand_name, slug').eq('seller_id', sellerId).single()
        if (profile?.email && config) {
          const tpl = subscriptionCancelledEmail({ brandName: config.brand_name, slug: config.slug })
          await sendEmail({ to: profile.email, subject: tpl.subject, html: tpl.html })
        }
      } catch { /* best-effort */ }
    }
  } else if (event.type === 'subscription.on_hold') {
    const sellerId = metadata.seller_id
    if (sellerId) {
      await admin
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('id', sellerId)

      try {
        const { sendEmail } = await import('@/lib/email/resend')
        const { subscriptionPastDueEmail } = await import('@/lib/email/templates/subscription-past-due')
        const { data: profile } = await admin.from('profiles').select('email').eq('id', sellerId).single()
        const { data: config } = await admin.from('tenant_config').select('brand_name, slug').eq('seller_id', sellerId).single()
        if (profile?.email && config) {
          const tpl = subscriptionPastDueEmail({ brandName: config.brand_name, slug: config.slug })
          await sendEmail({ to: profile.email, subject: tpl.subject, html: tpl.html })
        }
      } catch { /* best-effort */ }
    }
  }

  // Record as processed (best-effort — ignore insert errors for unknown event types)
  try {
    await admin.from('processed_webhooks').insert({ id: event.id, source: 'dodo' })
  } catch { /* duplicate or unknown event — safe to ignore */ }

  return new Response('OK', { status: 200 })
}
