import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import {
  buildSellerContext,
  generateDMReply,
  generateMessengerReply,
  isEscalation,
  sendInstagramMessage,
  sendMessengerMessage,
  shouldAutoReply,
} from '@/lib/instagram-agent'
import { classifyIntent, notifySellerOfMessage } from '@/lib/social-agent'

type Channel = 'instagram' | 'messenger'

// Meta webhook verification — shared by both the Instagram and Page (Messenger)
// webhook subscriptions, same verify token either way.
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

interface MetaWebhookBody {
  object: string
  entry: {
    id: string
    messaging?: {
      sender: { id: string }
      recipient: { id: string }
      timestamp: number
      message?: { mid: string; text?: string }
      read?: { watermark: number }
    }[]
  }[]
}

type MessagingEvent = NonNullable<MetaWebhookBody['entry'][number]['messaging']>[number]

// Receive Instagram DMs (object: 'instagram') and Facebook Messenger messages
// (object: 'page') — same connected Page for both, so they share one handler.
export async function POST(req: Request) {
  const body = (await req.json()) as MetaWebhookBody

  const channel: Channel | null = body.object === 'instagram' ? 'instagram' : body.object === 'page' ? 'messenger' : null

  // Always respond 200 immediately — Meta retries on timeout
  if (!channel) {
    return NextResponse.json({ ok: true })
  }

  // Process async so we don't block Meta
  processWebhook(body, channel).catch(err => console.error(`[${channel}-webhook]`, err))

  return NextResponse.json({ ok: true })
}

async function processWebhook(body: MetaWebhookBody, channel: Channel) {
  const admin = createAdminClient()

  for (const entry of body.entry ?? []) {
    // For Instagram, entry.id is the IG business account ID. For Messenger,
    // entry.id is the Facebook Page ID — same instagram_connections row
    // covers both since one connection = one Page + its linked IG account.
    const lookupColumn = channel === 'instagram' ? 'ig_business_account_id' : 'page_id'
    const { data: connection } = await admin
      .from('instagram_connections')
      .select('seller_id, page_id, ig_business_account_id, page_access_token')
      .eq(lookupColumn, entry.id)
      .single()

    if (!connection) continue

    for (const event of entry.messaging ?? []) {
      if (!event.message?.text) continue // skip reads, echoes, non-text

      // Isolated per message — one failure (send error, transient API
      // issue) must not abort the rest of this batch's messages.
      try {
        await handleInboundMessage(admin, connection, channel, event)
      } catch (err) {
        console.error(`[${channel}-webhook] failed to process message`, event.message?.mid, err)
      }
    }
  }
}

async function handleInboundMessage(
  admin: ReturnType<typeof createAdminClient>,
  connection: { seller_id: string; page_id: string; ig_business_account_id: string; page_access_token: string },
  channel: Channel,
  event: MessagingEvent
) {
  const senderId = event.sender.id
  const messageText = event.message!.text!
  const messageId = event.message!.mid
  const sentAt = new Date(event.timestamp).toISOString()

  // Upsert conversation (channel column distinguishes IG vs Messenger
  // threads even though they share this table)
  const { data: conversation } = await admin
    .from('instagram_conversations')
    .upsert(
      {
        seller_id: connection.seller_id,
        ig_sender_id: senderId,
        channel,
        last_message_at: sentAt,
        last_message_preview: messageText.slice(0, 100),
        unread_count: 1,
      },
      { onConflict: 'seller_id,ig_sender_id', ignoreDuplicates: false }
    )
    .select('id, unread_count')
    .single()

  if (!conversation) return

  await admin
    .from('instagram_conversations')
    .update({ unread_count: (conversation.unread_count ?? 0) + 1 })
    .eq('id', conversation.id)

  // Load agent config (Messenger reuses the Instagram agent config —
  // same Page, same seller preference) — needed before intent tagging below
  const { data: agentCfg } = await admin
    .from('instagram_agent_config')
    .select('*')
    .eq('seller_id', connection.seller_id)
    .single()

  const config = agentCfg ?? {
    mode: 'suggest',
    brand_voice: 'friendly, warm, and helpful',
    auto_keywords: ['price', 'cost', 'size', 'available', 'order', 'buy', 'cod', 'deliver'],
    escalation_keywords: ['refund', 'cancel', 'complaint', 'damaged'],
  }

  // Save inbound message (dedup by ig_message_id)
  await admin.from('instagram_messages').upsert(
    {
      conversation_id: conversation.id,
      seller_id: connection.seller_id,
      ig_message_id: messageId,
      direction: 'inbound',
      content: messageText,
      is_ai_generated: false,
      is_sent: true,
      intent: classifyIntent(messageText, config),
      sent_at: sentAt,
    },
    { onConflict: 'ig_message_id', ignoreDuplicates: true }
  )

  notifySellerOfMessage(connection.seller_id, senderId.slice(0, 12), messageText, channel).catch(() => {})

  if (config.mode === 'off') return
  if (isEscalation(messageText, config)) return
  if (!shouldAutoReply(messageText, config)) return

  // Enforce the seller's monthly AI reply quota (see PLAN_AI_REPLY_LIMITS) —
  // both auto-send and suggest-draft cost an OpenAI call, so both consume it.
  // Message is already saved above; if the quota's spent, it just sits in
  // the inbox for the seller to answer manually rather than generating a reply.
  const { data: withinQuota } = await admin.rpc('deduct_ai_reply', { p_seller_id: connection.seller_id })
  if (!withinQuota) return

  // Fetch recent conversation history for context
  const { data: history } = await admin
    .from('instagram_messages')
    .select('direction, content')
    .eq('conversation_id', conversation.id)
    .order('sent_at', { ascending: true })
    .limit(10)

  const conversationHistory = (history ?? []).map(m => ({
    role: m.direction === 'inbound' ? ('user' as const) : ('assistant' as const),
    content: m.content,
  }))

  // Generate AI reply
  const ctx = await buildSellerContext(connection.seller_id)
  const reply = channel === 'instagram'
    ? await generateDMReply(messageText, ctx, conversationHistory)
    : await generateMessengerReply(messageText, ctx, conversationHistory)

  const replyAt = new Date().toISOString()

  if (config.mode === 'auto') {
    if (channel === 'instagram') {
      await sendInstagramMessage(connection.ig_business_account_id, senderId, reply, connection.page_access_token)
    } else {
      await sendMessengerMessage(connection.page_id, senderId, reply, connection.page_access_token)
    }

    await admin.from('instagram_messages').insert({
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
    await admin.from('instagram_messages').insert({
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
    .from('instagram_conversations')
    .update({ last_message_at: replyAt })
    .eq('id', conversation.id)
}
