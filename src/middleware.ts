import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PLATFORM_HOSTS = ['wearon.in', 'www.wearon.in', 'localhost']

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get('host') ?? '').split(':')[0]
  const isCustomDomain = !PLATFORM_HOSTS.some(h => hostname === h || hostname.endsWith('.wearon.in'))

  if (isCustomDomain) {
    const url = request.nextUrl.clone()
    url.pathname = '/store/domain-lookup'
    url.search = `?domain=${encodeURIComponent(hostname)}&path=${encodeURIComponent(request.nextUrl.pathname)}`
    return NextResponse.rewrite(url)
  }

  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
