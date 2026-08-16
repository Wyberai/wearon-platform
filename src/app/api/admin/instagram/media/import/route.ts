import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/constants'

interface ImportItem {
  id: string
  caption?: string
  image_url: string
  video_url?: string
}

const MAX_VIDEO_BYTES = 50 * 1024 * 1024 // 50 MB — reels commonly run smaller, this is a ceiling not a target

async function tryImportVideo(sellerId: string, itemId: string, videoUrl: string, admin: ReturnType<typeof createAdminClient>): Promise<string | null> {
  try {
    const videoRes = await fetch(videoUrl)
    if (!videoRes.ok) return null

    const contentLength = videoRes.headers.get('content-length')
    if (contentLength && Number(contentLength) > MAX_VIDEO_BYTES) return null

    const buffer = Buffer.from(await videoRes.arrayBuffer())
    if (buffer.byteLength > MAX_VIDEO_BYTES) return null

    const path = `garments/${sellerId}/ig-${itemId}-${Date.now()}.mp4`
    const { error: uploadError } = await admin.storage.from('wearon-assets').upload(path, buffer, {
      contentType: 'video/mp4',
      upsert: false,
    })
    if (uploadError) return null

    const { data: { publicUrl } } = admin.storage.from('wearon-assets').getPublicUrl(path)
    return publicUrl
  } catch {
    // Video is a bonus, not required — a failed/oversized reel just means
    // the product imports with its thumbnail only, same as before this field existed.
    return null
  }
}

function parseNameFromCaption(caption: string, fallback: string): string {
  const firstLine = caption.split('\n')[0]?.trim()
  if (!firstLine) return fallback
  const clean = firstLine.replace(/[#@].*$/, '').trim()
  return clean.length > 3 ? clean.slice(0, 60) : fallback
}

function parsePriceFromCaption(caption: string): number | null {
  const match = caption.match(/₹\s?([\d,]+)/) ?? caption.match(/\bRs\.?\s?([\d,]+)/i)
  if (!match) return null
  const n = parseInt(match[1].replace(/,/g, ''), 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items } = (await req.json()) as { items: ImportItem[] }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items selected' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: profile } = await admin.from('profiles').select('plan').eq('id', user.id).single()
  const limit = PLANS[(profile?.plan ?? 'free') as keyof typeof PLANS]?.products ?? PLANS.free.products
  const { count } = await admin.from('products').select('id', { count: 'exact' }).eq('seller_id', user.id)
  const remaining = limit - (count ?? 0)
  if (remaining <= 0) {
    return NextResponse.json({ error: `Product limit reached for your plan (${limit}). Upgrade to import more.` }, { status: 403 })
  }

  const toImport = items.slice(0, remaining)
  const results: { id: string; ok: boolean; error?: string }[] = []

  for (const item of toImport) {
    try {
      const imgRes = await fetch(item.image_url)
      if (!imgRes.ok) throw new Error('Could not download image')
      const buffer = Buffer.from(await imgRes.arrayBuffer())

      const path = `garments/${user.id}/ig-${item.id}-${Date.now()}.jpg`
      const { error: uploadError } = await admin.storage.from('wearon-assets').upload(path, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      })
      if (uploadError) throw new Error(uploadError.message)

      const { data: { publicUrl } } = admin.storage.from('wearon-assets').getPublicUrl(path)

      const videoUrl = item.video_url
        ? await tryImportVideo(user.id, item.id, item.video_url, admin)
        : null

      const caption = item.caption ?? ''
      const name = parseNameFromCaption(caption, 'Imported from Instagram — edit me')
      const price = parsePriceFromCaption(caption)
      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'product'
      const slug = `${baseSlug}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

      const { error: insertError } = await admin.from('products').insert({
        seller_id: user.id,
        name,
        description: caption ? caption.slice(0, 500) : null,
        price_inr: price ?? 0,
        garment_image_url: publicUrl,
        garment_video_url: videoUrl,
        slug,
        sizes: [],
        is_active: false, // draft — seller reviews price/details before publishing
      })
      if (insertError) throw new Error(insertError.message)

      results.push({ id: item.id, ok: true })
    } catch (err) {
      results.push({ id: item.id, ok: false, error: err instanceof Error ? err.message : 'Import failed' })
    }
  }

  return NextResponse.json({ results, skipped: items.length - toImport.length })
}
