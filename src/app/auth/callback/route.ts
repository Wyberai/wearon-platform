import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Supabase sends users here after email confirmation with ?code=xxx
// We exchange the code for a session, then redirect to admin (which handles onboarding)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const isConfigured = url.startsWith('http') && anon.length > 20

  if (!isConfigured) {
    return NextResponse.redirect(`${origin}/auth/login?error=not_configured`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        for (const { name, value, options } of toSet) {
          cookieStore.set(name, value, options)
        }
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
