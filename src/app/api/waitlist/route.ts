import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, instagram_handle, source } = body as { email?: string; instagram_handle?: string; source?: string }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('waitlist_signups').insert({
    email: email.trim().toLowerCase(),
    instagram_handle: instagram_handle?.trim().replace(/^@/, '') || null,
    source: source ?? null,
  })

  if (error) {
    // Unique violation — they're already on the list, treat as success
    if (error.code === '23505') return NextResponse.json({ ok: true, already: true })
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  sendEmail({
    to: email,
    subject: "You're on the Instastarz waitlist",
    html: `<p>Hey,</p><p>You're on the list — we'll email you the moment Instastarz opens up. In the meantime, follow along on Instagram for a first look.</p><p>— Instastarz</p>`,
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
