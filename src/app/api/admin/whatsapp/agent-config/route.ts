import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// PATCH /api/admin/whatsapp/agent-config — update agent mode and settings
export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = ['mode', 'brand_voice', 'auto_keywords', 'escalation_keywords']
  const updates: Record<string, unknown> = { seller_id: user.id, updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('whatsapp_agent_config')
    .upsert(updates, { onConflict: 'seller_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
