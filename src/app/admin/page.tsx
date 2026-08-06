import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export default async function AdminIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()
  const { data: config } = await admin.from('tenant_config').select('slug').eq('seller_id', user.id).single()

  if (!config) {
    // First visit — trigger onboarding
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    // Re-check
    const { data: newConfig } = await admin.from('tenant_config').select('slug').eq('seller_id', user.id).single()
    if (newConfig) redirect(`/admin/${newConfig.slug}`)
    redirect('/auth/login?message=Setup error, please try again')
  }

  redirect(`/admin/${config.slug}`)
}
