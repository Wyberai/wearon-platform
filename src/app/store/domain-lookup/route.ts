import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain')
  const path = req.nextUrl.searchParams.get('path') ?? '/'

  if (!domain) {
    return NextResponse.redirect(new URL('https://wearon.in'))
  }

  const admin = createAdminClient()

  const { data: record } = await admin
    .from('domain_verifications')
    .select('seller_id')
    .eq('domain', domain)
    .not('verified_at', 'is', null)
    .single()

  if (!record) {
    return NextResponse.redirect(new URL('https://wearon.in'))
  }

  const { data: config } = await admin
    .from('tenant_config')
    .select('slug')
    .eq('seller_id', record.seller_id)
    .single()

  if (!config) {
    return NextResponse.redirect(new URL('https://wearon.in'))
  }

  const redirectPath = `/store/${config.slug}${path === '/' ? '' : path}`
  return NextResponse.redirect(new URL(redirectPath, 'https://wearon.in'))
}
