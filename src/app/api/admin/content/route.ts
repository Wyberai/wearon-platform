import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET /api/admin/content — list this seller's posts (drafts + published)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const [postsRes, shotsRes] = await Promise.all([
    admin.from('content_posts').select('*').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(50),
    // Completed AI Studio outputs the seller can pick from instead of uploading fresh media
    admin.from('ai_model_shots').select('id, result_image_url, result_video_url, output_type, created_at')
      .eq('seller_id', user.id).eq('status', 'completed').order('created_at', { ascending: false }).limit(20),
  ])

  return NextResponse.json({ posts: postsRes.data ?? [], ai_studio_outputs: shotsRes.data ?? [] })
}

// POST /api/admin/content — create a draft post, either from an uploaded
// file or an existing AI Studio output
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const formData = await request.formData()

  const caption = (formData.get('caption') as string) ?? ''
  const platformsStr = (formData.get('platforms') as string) ?? ''
  const platforms = platformsStr.split(',').map(p => p.trim()).filter(Boolean)
  const aiModelShotId = formData.get('ai_model_shot_id') as string | null
  const file = formData.get('media') as File | null

  if (platforms.length === 0) {
    return NextResponse.json({ error: 'Pick at least one platform' }, { status: 400 })
  }
  const VALID_PLATFORMS = ['instagram', 'facebook']
  const invalidPlatforms = platforms.filter(p => !VALID_PLATFORMS.includes(p))
  if (invalidPlatforms.length > 0) {
    return NextResponse.json({ error: `Unknown platform(s): ${invalidPlatforms.join(', ')}` }, { status: 400 })
  }

  let mediaUrl: string
  let mediaType: 'image' | 'video'
  let source: 'uploaded' | 'ai_studio' = 'uploaded'

  if (aiModelShotId) {
    const { data: shot } = await admin.from('ai_model_shots').select('result_image_url, result_video_url')
      .eq('id', aiModelShotId).eq('seller_id', user.id).single()
    if (!shot) return NextResponse.json({ error: 'AI Studio output not found' }, { status: 404 })
    if (shot.result_video_url) { mediaUrl = shot.result_video_url; mediaType = 'video' }
    else if (shot.result_image_url) { mediaUrl = shot.result_image_url; mediaType = 'image' }
    else return NextResponse.json({ error: 'That AI Studio job has no output yet' }, { status: 400 })
    source = 'ai_studio'
  } else if (file) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const isVideo = file.type.startsWith('video/')
    mediaType = isVideo ? 'video' : 'image'
    const ext = file.name.split('.').pop() ?? (isVideo ? 'mp4' : 'jpg')
    const path = `content/${user.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await admin.storage.from('wearon-assets').upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })
    if (uploadError) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

    const { data: { publicUrl } } = admin.storage.from('wearon-assets').getPublicUrl(path)
    mediaUrl = publicUrl
  } else {
    return NextResponse.json({ error: 'Provide a file or an ai_model_shot_id' }, { status: 400 })
  }

  const { data: post, error } = await admin.from('content_posts').insert({
    seller_id: user.id,
    media_url: mediaUrl,
    media_type: mediaType,
    caption,
    platforms,
    status: 'draft',
    source,
    ai_model_shot_id: aiModelShotId || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, post })
}
