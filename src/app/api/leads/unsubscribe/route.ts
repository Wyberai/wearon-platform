import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/leads/unsubscribe?id=<lead_id> — one-click unsubscribe link in
// every nurture email. No auth needed; the id itself is the capability.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const admin = createAdminClient()
  await admin.from('leads').update({ unsubscribed: true }).eq('id', id)

  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;text-align:center;padding:80px 20px;color:#171512;">
      <h2>You're unsubscribed</h2><p>You won't get any more emails about your Instastarz store preview.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
