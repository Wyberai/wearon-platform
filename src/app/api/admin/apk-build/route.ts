import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const APK_ELIGIBLE_PLANS = ['growth', 'pro', 'enterprise']

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from('profiles').select('plan').eq('id', user.id).single()

  if (!profile || !APK_ELIGIBLE_PLANS.includes(profile.plan)) {
    return NextResponse.json({
      error: 'APK builds require Growth plan or higher'
    }, { status: 403 })
  }

  const { data: activeBuild } = await admin
    .from('apk_builds')
    .select('id, status')
    .eq('seller_id', user.id)
    .in('status', ['queued', 'building'])
    .single()

  if (activeBuild) {
    return NextResponse.json({
      error: 'A build is already in progress',
      build_id: activeBuild.id,
      status: activeBuild.status,
    }, { status: 409 })
  }

  const { data: config } = await admin
    .from('tenant_config')
    .select('slug, brand_name, primary_color, logo_url')
    .eq('seller_id', user.id)
    .single()

  if (!config) return NextResponse.json({ error: 'Store not configured' }, { status: 400 })

  const { data: build } = await admin
    .from('apk_builds')
    .insert({ seller_id: user.id, status: 'queued' })
    .select('id')
    .single()

  if (process.env.GITHUB_PAT) {
    try {
      await fetch(
        'https://api.github.com/repos/sumeet-jpg/wearon-app/actions/workflows/build-apk.yml/dispatches',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_PAT}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
          },
          body: JSON.stringify({
            ref: 'main',
            inputs: {
              seller_id: user.id,
              slug: config.slug,
              brand_name: config.brand_name,
              primary_color: config.primary_color,
              logo_url: config.logo_url ?? '',
              plan: profile.plan,
            },
          }),
        }
      )
    } catch { /* trigger is best-effort */ }
  }

  return NextResponse.json({
    build_id: build?.id,
    status: 'queued',
    message: 'APK will be ready in ~12 minutes. You will receive an email when done.',
  }, { status: 202 })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('apk_builds')
    .select('id, status, apk_url, triggered_at, completed_at')
    .eq('seller_id', user.id)
    .order('triggered_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json(data ?? { status: 'none' })
}
