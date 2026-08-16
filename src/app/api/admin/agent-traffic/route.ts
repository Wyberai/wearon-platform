import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/admin/agent-traffic — recent AI-agent queries + agent-sourced orders
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const [queriesRes, hitsRes, ordersRes] = await Promise.all([
    admin.from('agent_queries').select('source, tool, query_text, result_count, created_at')
      .eq('seller_id', user.id).order('created_at', { ascending: false }).limit(50),
    admin.from('agent_endpoint_hits').select('endpoint, user_agent, created_at')
      .eq('seller_id', user.id).order('created_at', { ascending: false }).limit(50),
    admin.from('orders').select('id, items, total_inr, status, source, created_at')
      .eq('seller_id', user.id).in('source', ['mcp', 'openapi']).order('created_at', { ascending: false }).limit(50),
  ])

  return NextResponse.json({
    queries: queriesRes.data ?? [],
    endpoint_hits: hitsRes.data ?? [],
    orders: ordersRes.data ?? [],
  })
}
