import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { submitTryOn, pollTryOn } from '@/lib/fal-tryon'
import { submitAnimation, pollAnimation, fashionPrompt } from '@/lib/higgsfield'
import { CREDIT_COSTS, presetImageUrl } from '@/lib/ai-presets'

// POST — start an AI model shot job
// Body: { product_id?, garment_image_url, preset_model_key, output_type, garment_type? }
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { product_id, garment_image_url, preset_model_key, output_type = 'image', garment_type = 'other' } = body

  if (!garment_image_url || !preset_model_key) {
    return NextResponse.json({ error: 'Missing garment_image_url or preset_model_key' }, { status: 400 })
  }

  const credits = output_type === 'video'
    ? CREDIT_COSTS.modelShotImage + CREDIT_COSTS.modelShotVideo
    : CREDIT_COSTS.modelShotImage

  const admin = createAdminClient()

  // Create shot record first (gets ID for credit deduction reference)
  const { data: shot, error: insertErr } = await admin
    .from('ai_model_shots')
    .insert({
      seller_id: user.id,
      product_id: product_id ?? null,
      garment_image_url,
      preset_model_key,
      output_type,
      status: 'pending',
      credits_used: credits,
    })
    .select()
    .single()

  if (insertErr || !shot) return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })

  // Deduct credits
  const { data: balanceResult } = await admin.rpc('deduct_ai_credits', {
    p_seller_id: user.id,
    p_amount: credits,
    p_reason: 'model_shot',
    p_reference_id: shot.id,
  })

  if (balanceResult === -1) {
    await admin.from('ai_model_shots').update({ status: 'failed', error_message: 'Insufficient AI credits' }).eq('id', shot.id)
    return NextResponse.json({ error: 'Insufficient AI credits', code: 'NO_CREDITS' }, { status: 402 })
  }

  // Fire async pipeline
  runModelShotPipeline(shot.id, user.id, garment_image_url, preset_model_key, output_type, garment_type).catch(err =>
    console.error('[ai-model-shot]', err)
  )

  return NextResponse.json({ job_id: shot.id, credits_remaining: balanceResult })
}

// GET /api/admin/ai-model-shot?job_id=xxx — poll status
export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const jobId = url.searchParams.get('job_id')
  if (!jobId) return NextResponse.json({ error: 'Missing job_id' }, { status: 400 })

  const admin = createAdminClient()
  const { data: shot } = await admin
    .from('ai_model_shots')
    .select('status, result_image_url, result_video_url, error_message, fal_request_id, higgsfield_request_id, output_type')
    .eq('id', jobId)
    .eq('seller_id', user.id)
    .single()

  if (!shot) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  // If still generating, check third-party APIs and update
  if (shot.status === 'generating_image' && shot.fal_request_id) {
    const result = await pollTryOn(shot.fal_request_id)
    if (result.status === 'COMPLETED' && result.imageUrl) {
      if (shot.output_type === 'image') {
        await admin.from('ai_model_shots').update({
          status: 'completed',
          result_image_url: result.imageUrl,
          completed_at: new Date().toISOString(),
        }).eq('id', jobId)
        return NextResponse.json({ status: 'completed', image_url: result.imageUrl })
      } else {
        // Start video animation
        await startVideoAnimation(jobId, result.imageUrl, shot.output_type, 'other')
      }
    } else if (result.status === 'FAILED') {
      await admin.from('ai_model_shots').update({ status: 'failed', error_message: result.error }).eq('id', jobId)
    }
  }

  if (shot.status === 'generating_video' && shot.higgsfield_request_id) {
    const result = await pollAnimation(shot.higgsfield_request_id)
    if (result.status === 'completed' && result.videoUrl) {
      await admin.from('ai_model_shots').update({
        status: 'completed',
        result_video_url: result.videoUrl,
        completed_at: new Date().toISOString(),
      }).eq('id', jobId)
      return NextResponse.json({ status: 'completed', image_url: shot.result_image_url, video_url: result.videoUrl })
    } else if (result.status === 'failed' || result.status === 'nsfw') {
      await admin.from('ai_model_shots').update({ status: 'failed', error_message: 'Video generation failed' }).eq('id', jobId)
    }
  }

  return NextResponse.json({
    status: shot.status,
    image_url: shot.result_image_url,
    video_url: shot.result_video_url,
    error: shot.error_message,
  })
}

async function runModelShotPipeline(
  jobId: string,
  sellerId: string,
  garmentImageUrl: string,
  presetModelKey: string,
  outputType: string,
  garmentType: string
) {
  const admin = createAdminClient()
  const personImageUrl = presetImageUrl(presetModelKey)

  try {
    // Step 1: Submit fal.ai try-on
    const falJob = await submitTryOn({
      vtonImageUrl: personImageUrl,
      clothImageUrl: garmentImageUrl,
      clothType: 'overall',
    })

    await admin.from('ai_model_shots').update({
      status: 'generating_image',
      fal_request_id: falJob.requestId,
    }).eq('id', jobId)

    // Step 2: Poll for try-on image
    let tryonImageUrl: string | undefined
    const start = Date.now()
    while (Date.now() - start < 90_000) {
      await new Promise(r => setTimeout(r, 4000))
      const result = await pollTryOn(falJob.requestId)
      if (result.status === 'COMPLETED' && result.imageUrl) {
        tryonImageUrl = result.imageUrl
        break
      }
      if (result.status === 'FAILED') throw new Error(result.error ?? 'fal.ai failed')
    }

    if (!tryonImageUrl) throw new Error('Try-on image timed out')

    if (outputType === 'image') {
      await admin.from('ai_model_shots').update({
        status: 'completed',
        result_image_url: tryonImageUrl,
        completed_at: new Date().toISOString(),
      }).eq('id', jobId)
      return
    }

    // Step 3: Animate via Higgsfield
    await startVideoAnimation(jobId, tryonImageUrl, outputType, garmentType as Parameters<typeof fashionPrompt>[0])

    // Step 4: Poll for video
    const { data: shot } = await admin.from('ai_model_shots').select('higgsfield_request_id').eq('id', jobId).single()
    if (!shot?.higgsfield_request_id) throw new Error('No Higgsfield request ID')

    const videoStart = Date.now()
    while (Date.now() - videoStart < 120_000) {
      await new Promise(r => setTimeout(r, 5000))
      const result = await pollAnimation(shot.higgsfield_request_id)
      if (result.status === 'completed' && result.videoUrl) {
        await admin.from('ai_model_shots').update({
          status: 'completed',
          result_image_url: tryonImageUrl,
          result_video_url: result.videoUrl,
          completed_at: new Date().toISOString(),
        }).eq('id', jobId)
        return
      }
      if (result.status === 'failed' || result.status === 'nsfw') throw new Error('Higgsfield video failed')
    }

    throw new Error('Video animation timed out')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await admin.from('ai_model_shots').update({ status: 'failed', error_message: msg }).eq('id', jobId)
    // Refund credits on failure
    await admin.rpc('grant_ai_credits', { p_seller_id: sellerId, p_amount: 0, p_reason: 'refund_on_failure' })
  }
}

async function startVideoAnimation(jobId: string, imageUrl: string, outputType: string, garmentType: Parameters<typeof fashionPrompt>[0]) {
  const admin = createAdminClient()
  const hfJob = await submitAnimation({
    imageUrl,
    prompt: fashionPrompt(garmentType),
    duration: 5,
    aspectRatio: '9:16',
    model: 'kling-v2.1-pro',
  })
  await admin.from('ai_model_shots').update({
    status: 'generating_video',
    result_image_url: imageUrl,
    higgsfield_request_id: hfJob.requestId,
  }).eq('id', jobId)
}
