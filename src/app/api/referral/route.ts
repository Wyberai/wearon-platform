import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('referral_code, try_ons_limit')
    .eq('id', user.id)
    .single()

  const { count } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('referred_by', user.id)

  return NextResponse.json({
    referral_code: profile?.referral_code,
    referred_count: count ?? 0,
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { referral_code } = await req.json()
  if (!referral_code) return NextResponse.json({ error: 'Missing referral_code' }, { status: 400 })

  const admin = createAdminClient()

  const { data: currentProfile } = await admin
    .from('profiles').select('referred_by').eq('id', user.id).single()

  if (currentProfile?.referred_by) {
    return NextResponse.json({ error: 'Referral already applied' }, { status: 409 })
  }

  const { data: referrer } = await admin
    .from('profiles')
    .select('id, email')
    .eq('referral_code', referral_code)
    .single()

  if (!referrer) return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
  if (referrer.id === user.id) return NextResponse.json({ error: 'Cannot use your own code' }, { status: 400 })

  await admin.rpc('grant_referral_credit', { referrer_id: referrer.id, referred_id: user.id })

  return NextResponse.json({
    applied: true,
    referrer_email: referrer.email.replace(/(.{2}).+@/, '$1***@'),
  })
}
