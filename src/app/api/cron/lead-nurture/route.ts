import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'
import { leadNurtureEmail } from '@/lib/email/templates/lead-nurture'
import { getTheme } from '@/lib/themes'

// Sent from WearOn's own identity on WyberAi's verified domain — never the
// hello@wyberai.com address WyberAi's own customers already know, to avoid
// any mixup between the two products' communications.
const FROM = 'WearOn <wearon@wyberai.com>'
const STEP_INTERVAL_DAYS = 7
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wearon.wyberai.com'

// GET /api/cron/lead-nurture — Vercel Cron hits this daily. Advances each
// lead through the 4-week sequence one step at a time, skipping anyone who
// already signed up (checked against profiles by email) or unsubscribed.
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const cutoff = new Date(Date.now() - STEP_INTERVAL_DAYS * 86400000).toISOString()

  const { data: leads } = await admin
    .from('leads')
    .select('id, email, brand_name, theme_id, sequence_step, last_email_sent_at, unsubscribed, converted, created_at')
    .eq('unsubscribed', false)
    .eq('converted', false)
    .lt('sequence_step', 4)

  const results: { email: string; action: string }[] = []

  for (const lead of leads ?? []) {
    const lastTouch = lead.last_email_sent_at ?? lead.created_at
    if (lastTouch > cutoff) continue // not due yet

    // Skip (and mark converted) anyone who already signed up for a real account
    const { data: signedUp } = await admin.from('profiles').select('id').eq('email', lead.email).maybeSingle()
    if (signedUp) {
      await admin.from('leads').update({ converted: true }).eq('id', lead.id)
      results.push({ email: lead.email, action: 'converted-skip' })
      continue
    }

    const nextStep = (lead.sequence_step + 1) as 1 | 2 | 3 | 4
    const theme = getTheme(lead.theme_id)
    const previewUrl = `${APP_URL}/store/priyas-boutique?preview_name=${encodeURIComponent(lead.brand_name)}&preview_email=${encodeURIComponent(lead.email)}&theme=${theme.id}`
    const signupUrl = `${APP_URL}/auth/signup`

    const { subject, html } = leadNurtureEmail(nextStep, {
      brandName: lead.brand_name,
      previewUrl,
      signupUrl,
      themeName: theme.name,
    })
    const unsubscribeUrl = `${APP_URL}/api/leads/unsubscribe?id=${lead.id}`

    await sendEmail({ to: lead.email, subject, html: html.replace('{{UNSUBSCRIBE_URL}}', unsubscribeUrl), from: FROM })
    await admin.from('leads').update({ sequence_step: nextStep, last_email_sent_at: new Date().toISOString() }).eq('id', lead.id)
    results.push({ email: lead.email, action: `sent-step-${nextStep}` })
  }

  return NextResponse.json({ processed: results.length, results })
}
