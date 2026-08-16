import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/resend'
import { welcomeEmail } from '@/lib/email/templates/welcome'
import { PLAN_AI_CREDIT_LIMITS, PLAN_AI_REPLY_LIMITS, PLAN_TRY_ON_LIMITS } from '@/lib/constants'

export default async function AdminIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()

  // Check if tenant already set up
  const { data: existing } = await admin.from('tenant_config').select('slug').eq('seller_id', user.id).single()
  if (existing) redirect(`/admin/${existing.slug}`)

  // First visit after email confirmation — run onboarding inline (not via HTTP so cookies work)
  const brandName = user.user_metadata?.brand_name ?? 'My Store'
  const rawSlug = (user.user_metadata?.slug ?? brandName.toLowerCase().replace(/[^a-z0-9]/g, '')).slice(0, 20) || 'mystore'

  // Carried from a theme-card link on a segment landing page (e.g. /insta) —
  // validated against an allow-list since it arrives as unsigned user_metadata.
  const INSTA_THEME_IDS = ['reelrack', 'thegrid', 'tryiton']
  const requestedThemeId = user.user_metadata?.theme_id as string | undefined
  const validThemeId = requestedThemeId && INSTA_THEME_IDS.includes(requestedThemeId) ? requestedThemeId : null

  // Ensure slug uniqueness
  let slug = rawSlug
  let attempt = 0
  while (true) {
    const { data } = await admin.from('tenant_config').select('slug').eq('slug', slug).maybeSingle()
    if (!data) break
    attempt++
    slug = `${rawSlug}${attempt}`
  }

  // Create profile (idempotent)
  await admin.from('profiles').upsert({
    id: user.id,
    email: user.email!,
    plan: 'free',
    try_ons_used: 0,
    try_ons_limit: PLAN_TRY_ON_LIMITS.free,
    ai_credits: PLAN_AI_CREDIT_LIMITS.free,
    ai_replies_used: 0,
    ai_reply_limit: PLAN_AI_REPLY_LIMITS.free,
  }, { onConflict: 'id', ignoreDuplicates: true })

  // Create tenant config with defaults
  const { error } = await admin.from('tenant_config').insert({
    seller_id: user.id,
    slug,
    brand_name: brandName,
    primary_color: '#E91E63',
    secondary_color: '#FCE4EC',
    accent_color: '#880E4F',
    background_color: '#FFFFFF',
    font_family: 'poppins',
    payment_method: 'whatsapp_order',
    categories: ['Dresses', 'Tops', 'Denim', 'Outerwear', 'Accessories'],
    ...(validThemeId ? { theme_id: validThemeId } : {}),
  })

  if (error) {
    // Race: another concurrent request already created the config — find it and redirect
    const { data: raceWinner } = await admin.from('tenant_config').select('slug').eq('seller_id', user.id).single()
    if (raceWinner) redirect(`/admin/${raceWinner.slug}`)
    console.error('[admin] onboard error:', error.message)
    redirect('/auth/login?message=Setup error. Please try again.')
  }

  // Fire-and-forget welcome email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in'
  const sellerName = (user.user_metadata?.full_name ?? user.email ?? 'there').split(' ')[0]
  sendEmail({
    to: user.email!,
    ...welcomeEmail({ brandName, sellerName, storeUrl: `${appUrl}/store/${slug}` }),
  }).catch(() => {})

  redirect(`/admin/${slug}`)
}
