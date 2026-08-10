import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendWhatsAppMessage } from '@/lib/whatsapp-agent'

// GET /api/admin/whatsapp/messages?conversation_id=xxx
export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const conversationId = url.searchParams.get('conversation_id')
  if (!conversationId) return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 })

  const admin = createAdminClient()

  const [messagesRes, conversationRes] = await Promise.all([
    admin
      .from('whatsapp_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('seller_id', user.id)
      .order('sent_at', { ascending: true })
      .limit(100),
    admin
      .from('whatsapp_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('seller_id', user.id)
      .single(),
  ])

  // Mark conversation as read
  await admin
    .from('whatsapp_conversations')
    .update({ unread_count: 0 })
    .eq('id', conversationId)
    .eq('seller_id', user.id)

  return NextResponse.json({
    messages: messagesRes.data ?? [],
    conversation: conversationRes.data,
  })
}

// POST /api/admin/whatsapp/messages — send a reply (manual or approve AI draft)
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversation_id, message_id, text } = await req.json()
  if (!conversation_id || !text) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = createAdminClient()

  const { data: conversation } = await admin
    .from('whatsapp_conversations')
    .select('buyer_phone, seller_id')
    .eq('id', conversation_id)
    .eq('seller_id', user.id)
    .single()

  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })

  const { data: connection } = await admin
    .from('whatsapp_connections')
    .select('phone_number_id')
    .eq('seller_id', user.id)
    .single()

  if (!connection) return NextResponse.json({ error: 'WhatsApp number not assigned yet' }, { status: 400 })

  await sendWhatsAppMessage(connection.phone_number_id, conversation.buyer_phone, text)

  const now = new Date().toISOString()

  if (message_id) {
    await admin
      .from('whatsapp_messages')
      .update({ is_sent: true, sent_at: now })
      .eq('id', message_id)
      .eq('seller_id', user.id)
  } else {
    await admin.from('whatsapp_messages').insert({
      conversation_id,
      seller_id: user.id,
      direction: 'outbound',
      content: text,
      is_ai_generated: false,
      is_sent: true,
      sent_at: now,
    })
  }

  await admin
    .from('whatsapp_conversations')
    .update({ last_message_at: now, last_message_preview: text.slice(0, 100) })
    .eq('id', conversation_id)

  return NextResponse.json({ ok: true })
}
