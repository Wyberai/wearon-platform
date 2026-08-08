import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import {
  buildSellerContext,
  generateDMReply,
  isEscalation,
  sendInstagramMessage,
  shouldAutoReply,
} from '@/lib/instagram-agent'

// Meta webhook verification
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

// Receive Instagram DMs
export async function POST(req: Request) {
  const body = await req.json()

  // Always respond 200 immediately — Meta retries on timeout
  if (body.object !== 'instagram') {
    return NextResponse.json({ ok: true })
  }

  // Process async so we don't block Meta
  processWebhook(body).catch(err => console.error('[ig-webhook]', err))

  return NextResponse.json({ ok: true })
}

async function processWebhook(body: {
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
}) {
  const admin = createAdminClient()

  for (const entry of body.entry ?? []) {
    const igBusinessAccountId = entry.id

    // Find which seller owns this IG account
    const { data: connection } = await admin
      .from('instagram_connections')
      .select('seller_id, page_access_token, ig_username')
      .eq('ig_business_account_id', igBusinessAccountId)
      .single()

    if (!connection) continue

    for (const event of entry.messaging ?? []) {
      if (!event.message?.text) continue // skip reads, echoes, non-text

      const senderIgsid = event.sender.id
      const messageText = event.message.text
      const messageId = event.message.mid
      const sentAt = new Date(event.timestamp).toISOString()

      // Upsert conversation
      const { data: conversation } = await admin
        .from('instagram_conversations')
        .upsert(
          {
            seller_id: connection.seller_id,
            ig_sender_id: senderIgsid,
            last_message_at: sentAt,
            last_message_preview: messageText.slice(0, 100),
            unread_count: 1,
          },
          { onConflict: 'seller_id,ig_sender_id', ignoreDuplicates: false }
        )
        .select('id, unread_count')
        .single()

      if (!conversation) continue

      // Increment unread_count
      await admin
        .from('instagram_conversations')
        .update({ unread_count: (conversation.unread_count ?? 0) + 1 })
        .eq('id', conversation.id)

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
          sent_at: sentAt,
        },
        { onConflict: 'ig_message_id', ignoreDuplicates: true }
      )

      // Load agent config
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

      if (config.mode === 'off') continue
      if (isEscalation(messageText, config)) continue

      if (!shouldAutoReply(messageText, config)) continue

      // Fetch recent conversation history for context
      const { data: history } = await admin
        .from('instagram_messages')
        .select('direction, content')
        .eq('conversation_id', conversation.id)
        .order('sent_at', { ascending: true })
        .limit(10)

      const conversationHistory = (history ?? []).map(m => ({
        role: m.direction === 'inbound' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }))

      // Generate AI reply
      const ctx = await buildSellerContext(connection.seller_id)
      const reply = await generateDMReply(messageText, ctx, conversationHistory)

      const replyAt = new Date().toISOString()

      if (config.mode === 'auto') {
        // Send immediately
        await sendInstagramMessage(
          igBusinessAccountId,
          senderIgsid,
          reply,
          connection.page_access_token
        )

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

      // Update conversation preview
      await admin
        .from('instagram_conversations')
        .update({ last_message_at: replyAt })
        .eq('id', conversation.id)
    }
  }
}
