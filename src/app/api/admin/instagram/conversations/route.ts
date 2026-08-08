import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET /api/admin/instagram/conversations — list all conversations for seller
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const [convsRes, connectionRes, agentRes] = await Promise.all([
    admin
      .from('instagram_conversations')
      .select('*')
      .eq('seller_id', user.id)
      .order('last_message_at', { ascending: false })
      .limit(50),
    admin
      .from('instagram_connections')
      .select('ig_username, ig_business_account_id, token_expires_at')
      .eq('seller_id', user.id)
      .single(),
    admin
      .from('instagram_agent_config')
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
