import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/admin/instagram/connect?slug=xxx
// Redirects seller to Meta OAuth
export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wearon.in'
  const callbackUrl = `${appUrl}/api/admin/instagram/callback`

  const metaOAuthUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
  metaOAuthUrl.searchParams.set('client_id', process.env.META_APP_ID ?? '')
  metaOAuthUrl.searchParams.set('redirect_uri', callbackUrl)
  metaOAuthUrl.searchParams.set('scope', 'instagram_manage_messages,pages_messaging,pages_show_list,instagram_basic,instagram_content_publish,pages_manage_posts')
  metaOAuthUrl.searchParams.set('response_type', 'code')
  metaOAuthUrl.searchParams.set('state', `${user.id}|${slug}`)

  return NextResponse.redirect(metaOAuthUrl.toString())
}
