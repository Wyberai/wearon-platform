import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { CREDIT_COSTS } from '@/lib/ai-presets'

const AI_URL = process.env.WEARON_AI_URL
const AI_SECRET = process.env.WEARON_AI_SECRET

// POST /api/tryon — start a try-on
export async function POST(request: Request) {
  const formData = await request.formData()
  const selfie = formData.get('selfie') as File | null
  const productId = formData.get('product_id') as string | null
  const slug = formData.get('slug') as string | null

  if (!selfie || !productId || !slug) {
    return NextResponse.json({ error: 'Missing selfie, product_id or slug' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Resolve seller from slug
  const { data: config } = await admin.from('tenant_config').select('seller_id').eq('slug', slug).single()
  if (!config) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  // Check product belongs to this seller
  const { data: product } = await admin.from('products').select('id, garment_image_url, garment_preprocessed_url').eq('id', productId).eq('seller_id', config.seller_id).single()
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  // Check & deduct AI credits — same shared pool as the storefront try-on
  // route and AI Studio, so a seller's usage is metered consistently
  // regardless of which try-on entry point a buyer hits.
  const { data: balanceResult } = await admin.rpc('deduct_ai_credits', {
    p_seller_id: config.seller_id,
    p_amount: CREDIT_COSTS.buyerTryonImage,
    p_reason: 'buyer_tryon',
  })
  if (balanceResult === -1) return NextResponse.json({ error: 'Try-on limit reached. Seller needs to upgrade.' }, { status: 429 })

  // Upload selfie to Supabase Storage
  const selfieBuffer = Buffer.from(await selfie.arrayBuffer())
  const selfieExt = selfie.type === 'image/png' ? 'png' : 'jpg'
  const selfiePath = `selfies/${config.seller_id}/${Date.now()}.${selfieExt}`

  const { error: uploadError } = await admin.storage.from('wearon-assets').upload(selfiePath, selfieBuffer, {
    contentType: selfie.type,
    upsert: false,
  })
  if (uploadError) return NextResponse.json({ error: 'Failed to upload selfie' }, { status: 500 })

  const { data: { publicUrl: selfieUrl } } = admin.storage.from('wearon-assets').getPublicUrl(selfiePath)

  // Cache key
  const cacheKey = crypto.createHash('sha256').update(`${selfieUrl}:${productId}:v1`).digest('hex').slice(0, 32)

  // Create try-on record
  const { data: tryOnRecord } = await admin.from('try_on_results').insert({
    product_id: productId,
    seller_id: config.seller_id,
    cache_key: cacheKey,
    status: 'processing',
    model_version: 'catvton-base',
  }).select('id').single()

  if (!tryOnRecord) return NextResponse.json({ error: 'Failed to create try-on record' }, { status: 500 })

  // Fire-and-forget: call the AI service
  if (AI_URL) {
    callAIService({
      tryon_id: tryOnRecord.id,
      selfie_url: selfieUrl,
      garment_url: product.garment_preprocessed_url ?? product.garment_image_url,
      seller_id: config.seller_id,
    }).catch(console.error)
  } else {
    // Development mode: simulate result after 5 seconds
    simulateTryOnResult(admin, tryOnRecord.id, product.garment_image_url)
  }

  return NextResponse.json({ tryon_id: tryOnRecord.id, status: 'processing' })
}

// GET /api/tryon?id=xxx — poll result
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const admin = createAdminClient()
  const { data } = await admin.from('try_on_results').select('status, result_image_url, error_message').eq('id', id).single()

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    status: data.status,
    result_url: data.result_image_url,
    error: data.error_message,
  })
}

async function callAIService(params: { tryon_id: string; selfie_url: string; garment_url: string; seller_id: string }) {
  const res = await fetch(`${AI_URL}/tryon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Secret': AI_SECRET! },
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const admin = createAdminClient()
    await admin.from('try_on_results').update({ status: 'failed', error_message: 'AI service error' }).eq('id', params.tryon_id)
  }
}

async function simulateTryOnResult(admin: ReturnType<typeof createAdminClient>, tryonId: string, garmentUrl: string) {
  await new Promise(r => setTimeout(r, 5000))
  // In dev mode, return the garment image itself as the "result"
  await admin.from('try_on_results').update({
    status: 'done',
    result_image_url: garmentUrl,
    processing_ms: 5000,
  }).eq('id', tryonId)
}
