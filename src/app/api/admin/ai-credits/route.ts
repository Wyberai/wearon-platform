import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET — return current AI credit balance + recent transactions
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const [profileRes, txnsRes] = await Promise.all([
    admin.from('profiles').select('ai_credits, plan').eq('id', user.id).single(),
    admin.from('ai_credit_transactions').select('amount, reason, balance_after, created_at').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(20),
  ])

  return NextResponse.json({
    ai_credits: profileRes.data?.ai_credits ?? 0,
    plan: profileRes.data?.plan ?? 'free',
    transactions: txnsRes.data ?? [],
  })
}
