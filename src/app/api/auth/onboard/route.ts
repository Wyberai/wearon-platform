import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PLAN_AI_CREDIT_LIMITS, PLAN_AI_REPLY_LIMITS, PLAN_TRY_ON_LIMITS } from '@/lib/constants'

// Called after Supabase email confirmation to create profile + tenant_config
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Idempotent — skip if profile already exists
  const { data: existing } = await admin.from('profiles').select('id').eq('id', user.id).single()
  if (existing) return NextResponse.json({ ok: true, slug: await getSlug(admin, user.id) })

  const brandName = user.user_metadata?.brand_name ?? 'My Store'
  const rawSlug = (user.user_metadata?.slug ?? brandName.toLowerCase().replace(/[^a-z0-9]/g, '')).slice(0, 20)

  // Ensure slug uniqueness
  let slug = rawSlug
  let attempt = 0
  while (true) {
    const { data } = await admin.from('tenant_config').select('slug').eq('slug', slug).maybeSingle()
    if (!data) break
    attempt++
    slug = `${rawSlug}${attempt}`
  }

  // Create profile
  await admin.from('profiles').insert({
    id: user.id,
    email: user.email!,
    plan: 'free',
    try_ons_limit: PLAN_TRY_ON_LIMITS.free,
    ai_credits: PLAN_AI_CREDIT_LIMITS.free,
    ai_reply_limit: PLAN_AI_REPLY_LIMITS.free,
  })

  // Create tenant config with defaults
  await admin.from('tenant_config').insert({
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
  })

  return NextResponse.json({ ok: true, slug })
}

async function getSlug(admin: ReturnType<typeof createAdminClient>, userId: string) {
  const { data } = await admin.from('tenant_config').select('slug').eq('seller_id', userId).single()
  return data?.slug
}
