import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // After Supabase email confirmation, onboard the user
    const adminClient = createAdminClient()
    const { data: { user }, error } = await adminClient.auth.admin.getUserByEmail(
      searchParams.get('email') ?? ''
    )

    // Exchange code for session happens client-side via the redirect
    // Just redirect to admin after confirmation
    if (!error && user) {
      return NextResponse.redirect(`${origin}/admin`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?message=Check your email to continue`)
}
