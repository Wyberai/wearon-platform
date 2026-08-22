import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { notifySellerOfMessage } from '@/lib/social-agent'
import { buildSellerContext, classifyIntent, generateWhatsAppReply, isEscalation, sendWhatsAppMessage, shouldAutoReply } from '@/lib/whatsapp-agent'

// ── Conversational Checkout helpers ─────────────────────────────────────────

const PURCHASE_INTENT_KEYWORDS = [
  'buy', 'order', 'purchase', 'want to buy', 'i\'ll take', 'add to cart',
  'how to pay', 'how do i pay', 'book', 'place order', 'checkout',
  'want this', 'i want', 'lena hai', 'kharidna', 'order karna',
]

const SIZE_WORDS = new Set(['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'free', 'free size'])

function hasPurchaseIntent(text: string): boolean {
  const lower = text.toLowerCase()
  return PURCHASE_INTENT_KEYWORDS.some(kw => lower.includes(kw))
}

function extractSize(text: string, validSizes: string[]): string | null {
  const lower = text.toLowerCase().trim()
  // Exact match first
  for (const s of validSizes) {
    if (lower === s.toLowerCase() || lower === s.toLowerCase() + ' size') return s
  }
  // Word in message
  const words = lower.split(/\s+/)
  for (const w of words) {
    if (SIZE_WORDS.has(w)) {
      const matched = validSizes.find(s => s.toLowerCase() === w) ?? validSizes.find(s => s.toLowerCase().startsWith(w[0]))
      if (matched) return matched
    }
  }
  return null
}

function findProductInMessage(text: string, products: { id: string; name: string; price_inr: number; sizes: string[] | null; slug: string }[]): (typeof products)[0] | null {
  const lower = text.toLowerCase()
  return products.find(p => lower.includes(p.name.toLowerCase()) || (p.name.split(' ').filter(w => w.length > 4).some(w => lower.includes(w.toLowerCase())))) ?? null
}

interface PendingCheckout {
  state: 'awaiting_size' | 'link_sent'
  product_id: string
  product_name: string
  price_inr: number
  sizes: string[]
  slug: string
}

// Meta webhook verification (same shared Meta App/verify token as Instagram)
export async function GET(req: Request) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

interface WhatsAppWebhookBody {
  object: string
  entry?: {
    id: string
    changes?: {
      field: string
      value: {
        metadata?: { phone_number_id: string }
        contacts?: { profile?: { name?: string }; wa_id: string }[]
        messages?: { from: string; id: string; timestamp: string; type: string; text?: { body: string } }[]
      }
    }[]
  }[]
}

// Receive WhatsApp messages
export async function POST(req: Request) {
  const body = (await req.json()) as WhatsAppWebhookBody

  // Always respond 200 immediately — Meta retries on timeout
  if (body.object !== 'whatsapp_business_account') {
    return NextResponse.json({ ok: true })
  }

  // Must await — Vercel freezes the function once a response is sent, so a
  // fire-and-forget call here gets killed mid-flight before any DB write
  // lands. Meta tolerates several seconds before it considers delivery
  // failed, well within what this processing takes.
  try {
    await processWebhook(body)
  } catch (err) {
    console.error('[whatsapp-webhook]', err)
  }

  return NextResponse.json({ ok: true })
}

async function processWebhook(body: WhatsAppWebhookBody) {
  const admin = createAdminClient()

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'messages') continue
      const phoneNumberId = change.value.metadata?.phone_number_id
      if (!phoneNumberId) continue

      // Find which seller owns this WhatsApp number
      const { data: connection } = await admin
        .from('whatsapp_connections')
        .select('seller_id, phone_number_id')
        .eq('phone_number_id', phoneNumberId)
        .single()

      if (!connection) continue

      const contactsByPhone = new Map((change.value.contacts ?? []).map(c => [c.wa_id, c.profile?.name ?? null]))

      for (const message of change.value.messages ?? []) {
        if (message.type !== 'text' || !message.text?.body) continue // skip media/reactions for now

        // Isolated per message — one failure (send error, transient API
        // issue) must not abort the rest of this batch's messages.
        try {
          await handleInboundMessage(admin, connection, phoneNumberId, message, contactsByPhone)
        } catch (err) {
          console.error('[whatsapp-webhook] failed to process message', message.id, err)
        }
      }
    }
  }
}

async function handleInboundMessage(
  admin: ReturnType<typeof createAdminClient>,
  connection: { seller_id: string },
  phoneNumberId: string,
  message: { from: string; id: string; timestamp: string; text?: { body: string } },
  contactsByPhone: Map<string, string | null>
) {
  const buyerPhone = message.from
  const messageText = message.text!.body
  const messageId = message.id
  const sentAt = new Date(Number(message.timestamp) * 1000).toISOString()
  const buyerName = contactsByPhone.get(buyerPhone) ?? null

  // Upsert conversation
  const { data: conversation } = await admin
    .from('whatsapp_conversations')
    .upsert(
      {
        seller_id: connection.seller_id,
        buyer_phone: buyerPhone,
        buyer_name: buyerName,
        last_message_at: sentAt,
        last_message_preview: messageText.slice(0, 100),
        unread_count: 1,
      },
      { onConflict: 'seller_id,buyer_phone', ignoreDuplicates: false }
    )
    .select('id, unread_count')
    .single()

  if (!conversation) return

  await admin
    .from('whatsapp_conversations')
    .update({ unread_count: (conversation.unread_count ?? 0) + 1 })
    .eq('id', conversation.id)

  // Load agent config (needed before intent classification below)
  const { data: agentCfg } = await admin
    .from('whatsapp_agent_config')
    .select('*')
    .eq('seller_id', connection.seller_id)
    .single()

  const config = agentCfg ?? {
    mode: 'suggest',
    brand_voice: 'friendly, warm, and helpful',
    auto_keywords: ['price', 'cost', 'rate', 'kitna', 'size', 'available', 'stock', 'order', 'buy', 'cod', 'deliver', 'shipping'],
    escalation_keywords: ['refund', 'cancel', 'complaint', 'damaged', 'wrong', 'return'],
  }

  // Save inbound message (dedup by wa_message_id)
  await admin.from('whatsapp_messages').upsert(
    {
      conversation_id: conversation.id,
      seller_id: connection.seller_id,
      wa_message_id: messageId,
      direction: 'inbound',
      content: messageText,
      is_ai_generated: false,
      is_sent: true,
      intent: classifyIntent(messageText, config),
      sent_at: sentAt,
    },
    { onConflict: 'wa_message_id', ignoreDuplicates: true }
  )

  notifySellerOfMessage(connection.seller_id, buyerName ?? buyerPhone, messageText, 'whatsapp').catch(() => {})

  if (config.mode === 'off') return
  if (isEscalation(messageText, config)) return

  // ── Conversational Checkout flow ─────────────────────────────────────────
  // Read conversation with pending_checkout
  const { data: convRow } = await admin
    .from('whatsapp_conversations')
    .select('pending_checkout')
    .eq('id', conversation.id)
    .single()

  const pending = convRow?.pending_checkout as PendingCheckout | null

  if (pending?.state === 'awaiting_size') {
    const chosenSize = extractSize(messageText, pending.sizes)
    if (chosenSize) {
      // Generate checkout URL and create a pending order
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in'
      const checkoutUrl = `${baseUrl}/store/${pending.slug}/checkout?product=${pending.product_id}&size=${encodeURIComponent(chosenSize)}&source=whatsapp`
      const confirmMsg = `Perfect! Here's your secure checkout link for *${pending.product_name}* (Size: ${chosenSize}) — ₹${pending.price_inr.toLocaleString('en-IN')}:\n\n${checkoutUrl}\n\nComplete payment there and we'll confirm your order right away! 🛍️`

      if (config.mode === 'auto') {
        await sendWhatsAppMessage(phoneNumberId, buyerPhone, confirmMsg)
        await admin.from('whatsapp_messages').insert({
          conversation_id: conversation.id, seller_id: connection.seller_id,
          direction: 'outbound', content: confirmMsg, is_ai_generated: true, is_sent: true,
          sent_at: new Date().toISOString(),
        })
      } else {
        await admin.from('whatsapp_messages').insert({
          conversation_id: conversation.id, seller_id: connection.seller_id,
          direction: 'outbound', content: confirmMsg, is_ai_generated: true, is_sent: false,
          sent_at: new Date().toISOString(),
        })
      }

      await admin.from('whatsapp_conversations').update({
        pending_checkout: { ...pending, state: 'link_sent', size: chosenSize },
        last_message_at: new Date().toISOString(),
      }).eq('id', conversation.id)

      return // handled — skip normal AI reply
    }
    // Unrecognised size — fall through to normal AI reply which will ask again
  }

  if (hasPurchaseIntent(messageText) && config.mode !== 'off') {
    // Load products to find which one they want
    const { data: products } = await admin
      .from('products')
      .select('id, name, price_inr, sizes, slug')
      .eq('seller_id', connection.seller_id)
      .eq('is_active', true)
      .limit(60)

    const matched = findProductInMessage(messageText, (products ?? []) as { id: string; name: string; price_inr: number; sizes: string[] | null; slug: string }[])
    if (matched && (matched.sizes?.length ?? 0) > 0) {
      const sizeList = (matched.sizes as string[]).join(', ')
      const sizePrompt = `Great choice! 🛍️ *${matched.name}* is ₹${matched.price_inr.toLocaleString('en-IN')}.\n\nWhich size would you like? Available: *${sizeList}*`

      if (config.mode === 'auto') {
        await sendWhatsAppMessage(phoneNumberId, buyerPhone, sizePrompt)
        await admin.from('whatsapp_messages').insert({
          conversation_id: conversation.id, seller_id: connection.seller_id,
          direction: 'outbound', content: sizePrompt, is_ai_generated: true, is_sent: true,
          sent_at: new Date().toISOString(),
        })
      } else {
        await admin.from('whatsapp_messages').insert({
          conversation_id: conversation.id, seller_id: connection.seller_id,
          direction: 'outbound', content: sizePrompt, is_ai_generated: true, is_sent: false,
          sent_at: new Date().toISOString(),
        })
      }

      // Look up the store slug
      const { data: tc } = await admin.from('tenant_config').select('slug').eq('seller_id', connection.seller_id).single()
      await admin.from('whatsapp_conversations').update({
        pending_checkout: {
          state: 'awaiting_size',
          product_id: matched.id,
          product_name: matched.name,
          price_inr: matched.price_inr,
          sizes: matched.sizes as string[],
          slug: tc?.slug ?? '',
        } satisfies PendingCheckout,
        last_message_at: new Date().toISOString(),
      }).eq('id', conversation.id)

      return // handled — skip normal AI reply
    }
  }
  // ── End conversational checkout ────────────────────────────────────────────

  if (!shouldAutoReply(messageText, config)) return

  // Enforce the seller's monthly AI reply quota (see PLAN_AI_REPLY_LIMITS) —
  // both auto-send and suggest-draft cost an OpenAI call, so both consume it.
  // Message is already saved above; if the quota's spent, it just sits in
  // the inbox for the seller to answer manually rather than generating a reply.
  const { data: withinQuota } = await admin.rpc('deduct_ai_reply', { p_seller_id: connection.seller_id })
  if (!withinQuota) return

  // Fetch recent conversation history for context
  const { data: history } = await admin
    .from('whatsapp_messages')
    .select('direction, content')
    .eq('conversation_id', conversation.id)
    .order('sent_at', { ascending: true })
    .limit(10)

  const conversationHistory = (history ?? []).map(m => ({
    role: m.direction === 'inbound' ? ('user' as const) : ('assistant' as const),
    content: m.content,
  }))

  // Generate AI reply — buyerPhone lets the agent look up this
  // customer's own order history to answer "where's my order"
  const ctx = await buildSellerContext(connection.seller_id, buyerPhone)
  const reply = await generateWhatsAppReply(messageText, ctx, conversationHistory)

  const replyAt = new Date().toISOString()

  if (config.mode === 'auto') {
    await sendWhatsAppMessage(phoneNumberId, buyerPhone, reply)

    await admin.from('whatsapp_messages').insert({
      conversation_id: conversation.id,
      seller_id: connection.seller_id,
      direction: 'outbound',
      content: reply,
      is_ai_generated: true,
      is_sent: true,
      sent_at: replyAt,
    })
  } else {
    // suggest mode — save draft, seller reviews in inbox
    await admin.from('whatsapp_messages').insert({
      conversation_id: conversation.id,
      seller_id: connection.seller_id,
      direction: 'outbound',
      content: reply,
      is_ai_generated: true,
      is_sent: false,
      sent_at: replyAt,
    })
  }

  await admin
    .from('whatsapp_conversations')
    .update({ last_message_at: replyAt })
    .eq('id', conversation.id)
}
