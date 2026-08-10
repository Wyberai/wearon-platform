import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// POST /api/leads — landing page "see how your store would look" capture.
// No auth, no account created here — this just records the lead. The
// preview that follows reuses seeded demo data with the visitor's brand
// name swapped in, entirely client-side, so this route stays a simple insert.
export async function POST(req: Request) {
  const body = await req.json()
  const { email, brand_name, theme_id } = body as { email?: string; brand_name?: string; theme_id?: string }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  if (!brand_name || typeof brand_name !== 'string' || brand_name.trim().length < 2) {
    return NextResponse.json({ error: 'Brand name required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('leads').insert({
    email: email.trim().toLowerCase(),
    brand_name: brand_name.trim().slice(0, 60),
    theme_id: typeof theme_id === 'string' ? theme_id.slice(0, 40) : null,
  })

  if (error) {
    console.error('[leads] insert failed:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
