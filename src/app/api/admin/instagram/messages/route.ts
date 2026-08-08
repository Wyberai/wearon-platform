import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendInstagramMessage } from '@/lib/instagram-agent'

// GET /api/admin/instagram/messages?conversation_id=xxx
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
      .from('instagram_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('seller_id', user.id)
      .order('sent_at', { ascending: true })
      .limit(100),
    admin
      .from('instagram_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('seller_id', user.id)
      .single(),
  ])

  // Mark conversation as read
  await admin
    .from('instagram_conversations')
    .update({ unread_count: 0 })
    .eq('id', conversationId)
    .eq('seller_id', user.id)

  return NextResponse.json({
    messages: messagesRes.data ?? [],
    conversation: conversationRes.data,
  })
}

// POST /api/admin/instagram/messages — send a reply (manual or approve AI draft)
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversation_id, message_id, text } = await req.json()
  if (!conversation_id || !text) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = createAdminClient()

  // Get conversation + connection
  const { data: conversation } = await admin
    .from('instagram_conversations')
    .select('ig_sender_id, seller_id')
    .eq('id', conversation_id)
    .eq('seller_id', user.id)
    .single()

  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })

  const { data: connection } = await admin
    .from('instagram_connections')
    .select('ig_business_account_id, page_access_token')
    .eq('seller_id', user.id)
    .single()

  if (!connection) return NextResponse.json({ error: 'Instagram not connected' }, { status: 400 })

  // Send via Instagram API
  await sendInstagramMessage(
    connection.ig_business_account_id,
    conversation.ig_sender_id,
    text,
    connection.page_access_token
  )

  const now = new Date().toISOString()

  if (message_id) {
    // Approving an AI draft — mark it sent
    await admin
      .from('instagram_messages')
      .update({ is_sent: true, sent_at: now })
      .eq('id', message_id)
      .eq('seller_id', user.id)
  } else {
    // Manual reply — insert new message
    await admin.from('instagram_messages').insert({
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
    .from('instagram_conversations')
    .update({ last_message_at: now, last_message_preview: text.slice(0, 100) })
    .eq('id', conversation_id)

  return NextResponse.json({ ok: true })
}
