import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function isPlatformOwner(email: string | undefined) {
  return email && email === process.env.PLATFORM_OWNER_EMAIL
}

// PUT /api/platform/sellers/[id]/whatsapp — assign a phone number under the
// platform's shared WhatsApp Business Account to this seller
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { waba_id, phone_number_id, display_number } = await req.json()
  if (!waba_id || !phone_number_id) {
    return NextResponse.json({ error: 'waba_id and phone_number_id are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('whatsapp_connections').upsert(
    { seller_id: id, waba_id, phone_number_id, display_number: display_number || null, updated_at: new Date().toISOString() },
    { onConflict: 'seller_id' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from('whatsapp_agent_config').upsert({ seller_id: id }, { onConflict: 'seller_id', ignoreDuplicates: true })

  return NextResponse.json({ ok: true })
}

// DELETE /api/platform/sellers/[id]/whatsapp — unassign
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const admin = createAdminClient()
  const { error } = await admin.from('whatsapp_connections').delete().eq('seller_id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
