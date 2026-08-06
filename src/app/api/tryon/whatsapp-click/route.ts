import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { tryon_id } = await request.json()
  if (!tryon_id) return NextResponse.json({ ok: false })

  const admin = createAdminClient()
  await admin.from('try_on_results').update({ whatsapp_clicked: true }).eq('id', tryon_id)

  return NextResponse.json({ ok: true })
}
