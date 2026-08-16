import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const APK_ELIGIBLE_PLANS = ['growth', 'pro', 'enterprise']

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const appType: 'buyer' | 'seller' = body.app_type === 'seller' ? 'seller' : 'buyer'

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from('profiles').select('plan').eq('id', user.id).single()

  if (!profile || !APK_ELIGIBLE_PLANS.includes(profile.plan)) {
    return NextResponse.json({
      error: 'APK builds require Growth plan or higher'
    }, { status: 403 })
  }

  // The seller app is ONE shared build for every seller (no per-tenant
  // branding — /admin resolves per logged-in user via cookie session), so
  // the "already in progress" guard is global for app_type 'seller' rather
  // than scoped to the requesting seller like the per-tenant buyer app.
  let activeBuildQuery = admin
    .from('apk_builds')
    .select('id, status')
    .eq('app_type', appType)
    .in('status', ['queued', 'building'])

  if (appType === 'buyer') activeBuildQuery = activeBuildQuery.eq('seller_id', user.id)

  const { data: activeBuild } = await activeBuildQuery.limit(1).maybeSingle()

  if (activeBuild) {
    return NextResponse.json({
      error: 'A build is already in progress',
      build_id: activeBuild.id,
      status: activeBuild.status,
    }, { status: 409 })
  }

  let config: { slug: string; brand_name: string; primary_color: string; logo_url: string | null } | null = null
  if (appType === 'buyer') {
    const { data } = await admin
      .from('tenant_config')
      .select('slug, brand_name, primary_color, logo_url')
      .eq('seller_id', user.id)
      .single()
    config = data
    if (!config) return NextResponse.json({ error: 'Store not configured' }, { status: 400 })
  }

  const { data: build } = await admin
    .from('apk_builds')
    .insert({ seller_id: user.id, status: 'queued', app_type: appType })
    .select('id')
    .single()

  if (process.env.GITHUB_PAT) {
    const dispatchTarget = appType === 'buyer'
      ? { repo: 'Wyberai/wearon-platform', workflow: 'build-apk.yml' }
      : { repo: 'Wyberai/wearon-seller-app', workflow: 'build-seller-apk.yml' }

    const inputs = appType === 'buyer'
      ? {
          seller_id: user.id,
          slug: config!.slug,
          brand_name: config!.brand_name,
          primary_color: config!.primary_color,
          logo_url: config!.logo_url ?? '',
          plan: profile.plan,
        }
      : { triggered_by: user.id }

    try {
      const dispatchRes = await fetch(
        `https://api.github.com/repos/${dispatchTarget.repo}/actions/workflows/${dispatchTarget.workflow}/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_PAT}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
          },
          body: JSON.stringify({ ref: 'master', inputs }),
        }
      )

      if (!dispatchRes.ok) {
        const detail = await dispatchRes.text()
        await admin.from('apk_builds').update({
          status: 'failed',
          build_log: `dispatch failed: ${dispatchRes.status} ${detail}`,
        }).eq('id', build?.id)
        return NextResponse.json({ error: 'Failed to start build. Please try again or contact support.' }, { status: 502 })
      }
    } catch (err) {
      await admin.from('apk_builds').update({
        status: 'failed',
        build_log: `dispatch threw: ${err instanceof Error ? err.message : String(err)}`,
      }).eq('id', build?.id)
      return NextResponse.json({ error: 'Failed to start build. Please try again or contact support.' }, { status: 502 })
    }
  }

  return NextResponse.json({
    build_id: build?.id,
    status: 'queued',
    message: 'APK will be ready in ~12 minutes. You will receive an email when done.',
  }, { status: 202 })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const appType = req.nextUrl.searchParams.get('app_type') === 'seller' ? 'seller' : 'buyer'

  const admin = createAdminClient()
  let query = admin
    .from('apk_builds')
    .select('id, status, apk_url, triggered_at, completed_at')
    .eq('app_type', appType)
    .order('triggered_at', { ascending: false })
    .limit(1)

  // Seller app is shared across all sellers — every seller checks the same
  // latest build, not one scoped to their own seller_id.
  if (appType === 'buyer') query = query.eq('seller_id', user.id)

  const { data } = await query.maybeSingle()

  return NextResponse.json(data ?? { status: 'none' })
}
