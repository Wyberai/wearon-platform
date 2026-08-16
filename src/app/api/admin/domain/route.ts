import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'
import { DOMAIN_ELIGIBLE_PLANS, type Plan } from '@/lib/constants'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('plan').eq('id', user.id).single()
  if (!profile || !DOMAIN_ELIGIBLE_PLANS.includes(profile.plan as Plan)) {
    return NextResponse.json({ error: 'Custom domains require the Store plan or higher' }, { status: 403 })
  }

  const { domain } = await req.json()
  if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
  }

  const verification_token = `wearon-verify-${randomBytes(8).toString('hex')}`

  await admin.from('domain_verifications').delete().eq('seller_id', user.id)
  await admin.from('domain_verifications').insert({
    seller_id: user.id,
    domain,
    verification_token,
  })

  return NextResponse.json({
    verification_token,
    instruction: `Add this TXT record to your DNS: _wearon-verify.${domain} → ${verification_token}`,
    domain,
  })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const action = req.nextUrl.searchParams.get('action')
  const admin = createAdminClient()

  const { data: record } = await admin
    .from('domain_verifications')
    .select('domain, verification_token, verified_at')
    .eq('seller_id', user.id)
    .single()

  if (!record) return NextResponse.json({ error: 'No domain configured' }, { status: 404 })

  if (action === 'verify') {
    const dnsRes = await fetch(
      `https://dns.google/resolve?name=_wearon-verify.${record.domain}&type=TXT`
    )
    const dnsJson = await dnsRes.json()
    const answers: string[] = (dnsJson.Answer ?? []).flatMap((a: { data: string }) =>
      a.data.replace(/"/g, '').split(' ')
    )
    const verified = answers.includes(record.verification_token)

    if (verified && !record.verified_at) {
      await admin
        .from('domain_verifications')
        .update({ verified_at: new Date().toISOString() })
        .eq('seller_id', user.id)
      await admin
        .from('tenant_config')
        .update({ custom_domain: record.domain })
        .eq('seller_id', user.id)
    }

    return NextResponse.json({ verified, domain: record.domain })
  }

  return NextResponse.json(record)
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  await admin.from('tenant_config').update({ custom_domain: null }).eq('seller_id', user.id)
  await admin.from('domain_verifications').delete().eq('seller_id', user.id)
  return NextResponse.json({ removed: true })
}
