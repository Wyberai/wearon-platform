import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function isPlatformOwner(email: string | undefined) {
  return email && email === process.env.PLATFORM_OWNER_EMAIL
}

// GET /api/platform/outbound?language=hi&state=Kerala&status=new
export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const language = searchParams.get('language')
  const state = searchParams.get('state')
  const status = searchParams.get('status')

  const admin = createAdminClient()
  let query = admin.from('outbound_prospects').select('*').order('created_at', { ascending: false })
  if (language) query = query.eq('detected_language', language)
  if (state) query = query.eq('detected_state', state)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const all = data ?? []
  const stats = {
    total: all.length,
    with_contact: all.filter(p => p.phone || p.email).length,
    by_language: Object.fromEntries(
      Object.entries(
        all.reduce((acc: Record<string, number>, p) => {
          const l = p.detected_language || 'en'
          acc[l] = (acc[l] ?? 0) + 1
          return acc
        }, {})
      )
    ),
    by_status: Object.fromEntries(
      Object.entries(
        all.reduce((acc: Record<string, number>, p) => {
          acc[p.status] = (acc[p.status] ?? 0) + 1
          return acc
        }, {})
      )
    ),
  }

  return NextResponse.json({ prospects: all, stats })
}
