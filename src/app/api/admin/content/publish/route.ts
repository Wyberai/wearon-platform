import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

interface ContentPost {
  id: string
  seller_id: string
  media_url: string
  media_type: 'image' | 'video'
  caption: string | null
  platforms: string[]
}

interface Connection {
  page_id: string
  ig_business_account_id: string
  page_access_token: string
}

// POST /api/admin/content/publish — { post_id }
// Publishes a draft to every platform it was tagged for. Runs the actual
// Graph API calls async (video processing on Instagram can take a while) —
// the request returns immediately once the post is marked "publishing".
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { post_id } = await req.json()
  if (!post_id) return NextResponse.json({ error: 'Missing post_id' }, { status: 400 })

  const admin = createAdminClient()

  const { data: post } = await admin.from('content_posts').select('*').eq('id', post_id).eq('seller_id', user.id).single()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Guard against double-publish (double-click, retry, race) — only draft or
  // a previously-failed attempt can be (re-)published.
  if (post.status !== 'draft' && post.status !== 'failed') {
    return NextResponse.json({ error: `Post is already ${post.status}` }, { status: 409 })
  }

  const { data: connection } = await admin.from('instagram_connections')
    .select('page_id, ig_business_account_id, page_access_token').eq('seller_id', user.id).single()
  if (!connection) return NextResponse.json({ error: 'Connect Instagram/Facebook first (Inbox tab)' }, { status: 400 })

  await admin.from('content_posts').update({ status: 'publishing' }).eq('id', post_id)

  publishPipeline(post as ContentPost, connection as Connection).catch(err => console.error('[content-publish]', err))

  return NextResponse.json({ ok: true, status: 'publishing' })
}

async function publishPipeline(post: ContentPost, connection: Connection) {
  const admin = createAdminClient()
  const externalIds: Record<string, string> = {}
  const errors: string[] = []

  for (const platform of post.platforms) {
    try {
      if (platform === 'instagram') {
        externalIds.instagram = await publishToInstagram(post, connection)
      } else if (platform === 'facebook') {
        externalIds.facebook = await publishToFacebook(post, connection)
      }
    } catch (err) {
      errors.push(`${platform}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  await admin.from('content_posts').update({
    status: errors.length === post.platforms.length ? 'failed' : 'published',
    external_post_ids: externalIds,
    error_message: errors.length > 0 ? errors.join(' | ') : null,
    published_at: new Date().toISOString(),
  }).eq('id', post.id)
}

async function publishToInstagram(post: ContentPost, connection: Connection): Promise<string> {
  const base = `https://graph.facebook.com/v18.0/${connection.ig_business_account_id}`

  const createParams = new URLSearchParams({
    caption: post.caption ?? '',
    access_token: connection.page_access_token,
    ...(post.media_type === 'video' ? { media_type: 'REELS', video_url: post.media_url } : { image_url: post.media_url }),
  })

  const createRes = await fetch(`${base}/media?${createParams.toString()}`, { method: 'POST' })
  if (!createRes.ok) throw new Error(`media container failed: ${await createRes.text()}`)
  const { id: creationId } = await createRes.json()

  // Videos need processing time — poll status_code before publishing (images
  // are usually ready immediately, but polling is harmless either way).
  for (let attempt = 0; attempt < 20; attempt++) {
    const statusRes = await fetch(`https://graph.facebook.com/v18.0/${creationId}?fields=status_code&access_token=${connection.page_access_token}`)
    const { status_code } = await statusRes.json()
    if (status_code === 'FINISHED') break
    if (status_code === 'ERROR') throw new Error('media processing failed on Instagram')
    await new Promise(r => setTimeout(r, 3000))
  }

  const publishRes = await fetch(`${base}/media_publish?creation_id=${creationId}&access_token=${connection.page_access_token}`, { method: 'POST' })
  if (!publishRes.ok) throw new Error(`media_publish failed: ${await publishRes.text()}`)
  const { id: mediaId } = await publishRes.json()
  return mediaId
}

async function publishToFacebook(post: ContentPost, connection: Connection): Promise<string> {
  const endpoint = post.media_type === 'video' ? 'videos' : 'photos'
  const urlParam = post.media_type === 'video' ? 'file_url' : 'url'
  const captionParam = post.media_type === 'video' ? 'description' : 'caption'

  const params = new URLSearchParams({
    [urlParam]: post.media_url,
    [captionParam]: post.caption ?? '',
    access_token: connection.page_access_token,
  })

  const res = await fetch(`https://graph.facebook.com/v18.0/${connection.page_id}/${endpoint}?${params.toString()}`, { method: 'POST' })
  if (!res.ok) throw new Error(`Facebook ${endpoint} post failed: ${await res.text()}`)
  const { id } = await res.json()
  return id
}
