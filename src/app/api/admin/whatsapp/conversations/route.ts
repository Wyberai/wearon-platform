import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET /api/admin/whatsapp/conversations — list all conversations for seller
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const [convsRes, connectionRes, agentRes] = await Promise.all([
    admin
      .from('whatsapp_conversations')
      .select('*')
      .eq('seller_id', user.id)
      .order('last_message_at', { ascending: false })
      .limit(50),
    admin
      .from('whatsapp_connections')
      .select('display_number, phone_number_id, waba_id')
      .eq('seller_id', user.id)
      .single(),
    admin
      .from('whatsapp_agent_config')
      .select('mode, brand_voice')
      .eq('seller_id', user.id)
      .single(),
  ])

  return NextResponse.json({
    conversations: convsRes.data ?? [],
    connection: connectionRes.data,
    agentConfig: agentRes.data,
  })
}
