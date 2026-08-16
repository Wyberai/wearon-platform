import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function isPlatformOwner(email: string | undefined) {
  return email && email === process.env.PLATFORM_OWNER_EMAIL
}

const ALLOWED_STATUSES = ['new', 'queued', 'sent', 'replied', 'converted', 'opted_out', 'invalid']

// PATCH /api/platform/outbound/[id] — update status and/or notes on one prospect
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const update: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: `status must be one of ${ALLOWED_STATUSES.join(', ')}` }, { status: 400 })
    }
    update.status = body.status
  }
  if (body.notes !== undefined) update.notes = body.notes

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('outbound_prospects').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ prospect: data })
}
