import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

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
    try_ons_limit: 20,
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
    categories: ['Kurtas', 'Sarees', 'Lehengas', 'Western', 'Accessories'],
  })

  if (error) {
    console.error('[admin] onboard error:', error.message)
    redirect('/auth/login?message=Setup error. Please try again.')
  }

  redirect(`/admin/${slug}`)
}
