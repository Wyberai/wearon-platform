import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Creates the auth user pre-confirmed (email_confirm: true) instead of the
// client calling supabase.auth.signUp() directly. Two real problems this
// fixes, found via an actual signup walkthrough: (1) Supabase's default
// mailer rate-limits confirmation emails far below what a real signup spike
// could need, and (2) requiring a "check your inbox, click the link" step
// before a new seller can touch their store directly contradicts the "live
// in three steps" pitch on the homepage. Shopify itself treats email
// verification as a soft, non-blocking nag, not a hard gate — this matches
// that. The client signs the user in immediately after this succeeds.
export async function POST(req: Request) {
  const { email, password, brandName, slug, themeId } = await req.json()

  if (!email || !password || !brandName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      brand_name: brandName,
      ...(slug ? { slug } : {}),
      ...(themeId ? { theme_id: themeId } : {}),
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
