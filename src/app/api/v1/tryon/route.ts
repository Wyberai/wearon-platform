import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-wearon-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing X-WearOn-Key header' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Validate API key against profiles
  const { data: profile } = await admin
    .from('profiles')
    .select('id, plan, try_ons_used, try_ons_limit')
    .eq('api_key', apiKey)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  if (profile.try_ons_used >= profile.try_ons_limit) {
    return NextResponse.json({
      error: 'Try-on quota exceeded. Upgrade your plan or purchase additional credits.',
      quota_used: profile.try_ons_used,
      quota_limit: profile.try_ons_limit,
    }, { status: 429 })
  }

  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data with user_photo and garment_url' }, { status: 400 })
  }

  const formData = await req.formData()
  const userPhoto = formData.get('user_photo') as File | null
  const garmentUrl = formData.get('garment_url') as string | null

  if (!userPhoto || !garmentUrl) {
    return NextResponse.json({ error: 'Required fields: user_photo (file), garment_url (string)' }, { status: 400 })
  }

  const webhookUrl = formData.get('webhook_url') as string | null

  // Increment try-on usage
  await admin.rpc('increment_try_ons', { user_id: profile.id, amount: 1 })

  // Store job in try_on_results (pending) — let Postgres generate the UUID
  const { data: job } = await admin.from('try_on_results').insert({
    seller_id: profile.id,
    product_id: null,
    buyer_session_id: null,
    result_image_url: null,
    processing_ms: null,
    model_version: 'catvton-v1',
    cache_key: null,
  }).select('id').single()

  const jobId = job?.id ?? randomBytes(16).toString('hex')

  // Queue job to wearon-ai inference service (Modal.com)
  if (process.env.WEARON_AI_URL) {
    const aiFormData = new FormData()
    aiFormData.append('person_photo', userPhoto)
    aiFormData.append('seller_id', profile.id)
    aiFormData.append('product_id', '')
    aiFormData.append('result_id', jobId)
    if (garmentUrl) aiFormData.append('garment_url', garmentUrl)
    fetch(`${process.env.WEARON_AI_URL}/tryon`, {
      method: 'POST',
      headers: { 'x-wearon-secret': process.env.WEARON_PLATFORM_SECRET ?? '' },
      body: aiFormData,
    }).catch(() => {}) // fire and forget
  }

  return NextResponse.json({
    job_id: jobId,
    status: 'processing',
    eta_seconds: 18,
    result_url: null,
    webhook_url: webhookUrl ?? null,
    poll_url: `https://api.wearon.in/api/v1/status?job_id=${jobId}`,
  }, { status: 202 })
}
