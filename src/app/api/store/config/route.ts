import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const admin = createAdminClient()
  const { data: config } = await admin
    .from('tenant_config')
    .select('*')
    .eq('slug', slug)
    .single()

  return NextResponse.json({ config: config ?? null })
}
