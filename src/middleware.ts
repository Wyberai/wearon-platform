import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { LOCALES, LOCALE_COOKIE } from '@/lib/i18n/config'

const PLATFORM_HOSTS = ['instastarz.in', 'www.instastarz.in', 'localhost']

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get('host') ?? '').split(':')[0]
  const isCustomDomain = !PLATFORM_HOSTS.some(h => hostname === h || hostname.endsWith('.instastarz.in'))

  if (isCustomDomain) {
    const url = request.nextUrl.clone()
    url.pathname = '/store/domain-lookup'
    url.search = `?domain=${encodeURIComponent(hostname)}&path=${encodeURIComponent(request.nextUrl.pathname)}`
    return NextResponse.rewrite(url)
  }

  const response = await updateSession(request)

  // Lets ad destination URLs (?lang=kn) land visitors straight into the
  // matching regional locale instead of the cookie default — without this,
  // a Kannada-language ad would drop clickers onto an English page.
  const langParam = request.nextUrl.searchParams.get('lang')
  if ((LOCALES as readonly string[]).includes(langParam ?? '')) {
    response.cookies.set(LOCALE_COOKIE, langParam as string, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
