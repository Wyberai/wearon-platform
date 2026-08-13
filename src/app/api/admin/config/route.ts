import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/admin/config?slug=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin.from('tenant_config').select('*').eq('slug', slug).eq('seller_id', user.id).single()

  return NextResponse.json({ config: data })
}

// PATCH /api/admin/config
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { slug, ...updates } = body

  const allowed = ['brand_name', 'tagline', 'primary_color', 'secondary_color', 'accent_color', 'background_color',
    'font_family', 'theme_id', 'whatsapp_number', 'instagram_handle', 'payment_method', 'payment_config', 'categories', 'banners',
    'try_on_enabled', 'reviews_enabled', 'wishlist_enabled', 'faq_policy', 'brand_voice']
  const safe: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in updates) safe[key] = updates[key]
  }

  const admin = createAdminClient()
  const { error } = await admin.from('tenant_config').update(safe).eq('slug', slug).eq('seller_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
