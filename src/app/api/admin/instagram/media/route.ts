import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET /api/admin/instagram/media — list the seller's own IG posts so they can
// import existing product photos/reels instead of re-uploading from scratch.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: connection } = await admin
    .from('instagram_connections')
    .select('ig_business_account_id, page_access_token')
    .eq('seller_id', user.id)
    .single()

  if (!connection?.ig_business_account_id) {
    return NextResponse.json({ error: 'Instagram not connected', code: 'NOT_CONNECTED' }, { status: 400 })
  }

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
  const res = await fetch(
    `https://graph.facebook.com/v18.0/${connection.ig_business_account_id}/media?fields=${fields}&limit=30&access_token=${connection.page_access_token}`
  )
  const data = await res.json()

  if (data.error) {
    return NextResponse.json({ error: data.error.message ?? 'Failed to load Instagram media' }, { status: 502 })
  }

  const media = (data.data ?? [])
    .filter((m: { media_type: string }) => m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM' || m.media_type === 'VIDEO')
    .map((m: { id: string; caption?: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink: string; timestamp: string }) => ({
      id: m.id,
      caption: m.caption ?? '',
      media_type: m.media_type,
      image_url: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
      permalink: m.permalink,
      timestamp: m.timestamp,
    }))
    .filter((m: { image_url?: string }) => m.image_url)

  return NextResponse.json({ media })
}
