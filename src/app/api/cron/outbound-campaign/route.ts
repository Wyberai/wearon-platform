import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendWhatsAppTemplate } from '@/lib/whatsapp-agent'

// NOT registered in vercel.json — deliberately not scheduled yet. Two
// external prerequisites (see plan / whatsapp-agent.ts comment) block this
// from actually sending: a dedicated Instastarz phone_number_id, and
// Meta-approved templates per language below. Once both exist, add
//   { "path": "/api/cron/outbound-campaign", "schedule": "0 10 * * *" }
// to vercel.json to go live. Safe to test manually via curl with
// CRON_SECRET in the meantime — it will just fail at the WhatsApp API call
// until INSTASTARZ_WHATSAPP_PHONE_NUMBER_ID is set.

const DAILY_SEND_CAP = 40 // deliberately conservative — sending too fast to
// cold numbers risks WhatsApp quality-rating drops on a brand-new number.

// Template names must match whatever is actually created + approved in Meta
// Business Manager — these are placeholders until that approval exists.
const TEMPLATE_BY_LANGUAGE: Record<string, { name: string; metaLanguageCode: string }> = {
  hi: { name: 'instastarz_seller_outreach_hi', metaLanguageCode: 'hi' },
  ta: { name: 'instastarz_seller_outreach_ta', metaLanguageCode: 'ta' },
  kn: { name: 'instastarz_seller_outreach_kn', metaLanguageCode: 'kn' },
  te: { name: 'instastarz_seller_outreach_te', metaLanguageCode: 'te' },
  ml: { name: 'instastarz_seller_outreach_ml', metaLanguageCode: 'ml' },
  bn: { name: 'instastarz_seller_outreach_bn', metaLanguageCode: 'bn' },
  gu: { name: 'instastarz_seller_outreach_gu', metaLanguageCode: 'gu' },
  pa: { name: 'instastarz_seller_outreach_pa', metaLanguageCode: 'pa' },
  or: { name: 'instastarz_seller_outreach_or', metaLanguageCode: 'or' },
  en: { name: 'instastarz_seller_outreach_en', metaLanguageCode: 'en' },
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const phoneNumberId = process.env.INSTASTARZ_WHATSAPP_PHONE_NUMBER_ID
  if (!phoneNumberId) {
    return NextResponse.json({ error: 'INSTASTARZ_WHATSAPP_PHONE_NUMBER_ID not set — dedicated number not registered yet' }, { status: 503 })
  }

  const admin = createAdminClient()
  const { data: prospects } = await admin
    .from('outbound_prospects')
    .select('id, phone, detected_language')
    .eq('status', 'new')
    .not('phone', 'is', null)
    .limit(DAILY_SEND_CAP)

  const results: { username?: string; action: string }[] = []

  for (const p of prospects ?? []) {
    const template = TEMPLATE_BY_LANGUAGE[p.detected_language ?? 'en'] ?? TEMPLATE_BY_LANGUAGE.en
    try {
      await sendWhatsAppTemplate(phoneNumberId, p.phone!, template.name, template.metaLanguageCode)
      await admin.from('outbound_prospects').update({
        status: 'sent',
        whatsapp_template_sent: template.name,
        last_contacted_at: new Date().toISOString(),
      }).eq('id', p.id)
      results.push({ action: `sent-${template.name}` })
    } catch (err) {
      results.push({ action: `failed: ${(err as Error).message}` })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
