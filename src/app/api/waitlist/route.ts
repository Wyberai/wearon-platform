import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'
import { waitlistConfirmationEmail } from '@/lib/email/templates/waitlist-confirmation'
import { LOCALES, type Locale } from '@/lib/i18n/config'

const FOUNDER_EMAIL = 'hello@instastarz.in'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, instagram_handle, source, locale: rawLocale } = body as {
    email?: string
    instagram_handle?: string
    source?: string
    locale?: string
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }

  const locale: Locale = (LOCALES as readonly string[]).includes(rawLocale ?? '') ? (rawLocale as Locale) : 'en'
  const cleanEmail = email.trim().toLowerCase()
  const cleanHandle = instagram_handle?.trim().replace(/^@/, '') || null

  const admin = createAdminClient()
  const { error } = await admin.from('waitlist_signups').insert({
    email: cleanEmail,
    instagram_handle: cleanHandle,
    source: source ?? null,
  })

  if (error) {
    // Unique violation — they're already on the list, treat as success
    if (error.code === '23505') return NextResponse.json({ ok: true, already: true })
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  const { subject, html } = waitlistConfirmationEmail(locale)
  sendEmail({ to: cleanEmail, subject, html }).catch(() => {})

  // Founder alert — fire-and-forget, same as the confirmation above. A
  // failed notify should never block or fail the visitor's signup.
  sendEmail({
    to: FOUNDER_EMAIL,
    subject: `New waitlist signup (${locale}) — ${cleanEmail}`,
    html: `<p>New Instastarz waitlist signup:</p>
      <ul>
        <li><strong>Email:</strong> ${cleanEmail}</li>
        <li><strong>Instagram:</strong> ${cleanHandle ? `@${cleanHandle}` : '—'}</li>
        <li><strong>Language:</strong> ${locale}</li>
        <li><strong>Source:</strong> ${source ?? '—'}</li>
      </ul>`,
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
