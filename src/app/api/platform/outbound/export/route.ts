import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function isPlatformOwner(email: string | undefined) {
  return email && email === process.env.PLATFORM_OWNER_EMAIL
}

function toE164(phone: string | null) {
  if (!phone) return ''
  return phone.startsWith('+') ? phone : `+91${phone}`
}

// GET /api/platform/outbound/export
//   -> no `language` param: JSON summary of per-language counts (for the UI to list download links)
// GET /api/platform/outbound/export?language=hi
//   -> CSV (phone,email) for that language only, ready for Meta Custom Audience upload
export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isPlatformOwner(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('outbound_prospects')
    .select('phone, email, detected_language')
    .or('phone.not.is.null,email.not.is.null')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const withContact = data ?? []

  const { searchParams } = new URL(req.url)
  const language = searchParams.get('language')

  if (!language) {
    const counts: Record<string, number> = {}
    for (const p of withContact) {
      const l = p.detected_language || 'en'
      counts[l] = (counts[l] ?? 0) + 1
    }
    return NextResponse.json({ by_language: counts, total: withContact.length })
  }

  const rows = withContact.filter(p => (p.detected_language || 'en') === language)
  const csvLines = ['phone,email', ...rows.map(p => `${toE164(p.phone)},${p.email || ''}`)]
  const csv = csvLines.join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="meta_audience_${language}.csv"`,
    },
  })
}
