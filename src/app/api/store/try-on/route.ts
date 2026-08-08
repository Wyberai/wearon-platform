import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { submitTryOn, pollTryOn } from '@/lib/fal-tryon'
import { submitAnimation, pollAnimation, fashionPrompt } from '@/lib/higgsfield'
import { CREDIT_COSTS } from '@/lib/ai-presets'

// POST — buyer submits a try-on job
// Body: { seller_id, product_id, garment_image_url, buyer_image_url, output_type?, garment_type? }
// Note: buyer_image_url should be a short-lived upload URL — never stored permanently
export async function POST(req: Request) {
  const body = await req.json()
  const { seller_id, product_id, garment_image_url, buyer_image_url, output_type = 'both', garment_type = 'other' } = body

  if (!seller_id || !garment_image_url || !buyer_image_url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Check seller has credits
  const { data: profile } = await admin
    .from('profiles')
    .select('ai_credits')
    .eq('id', seller_id)
    .single()

  const creditNeeded = output_type === 'both'
    ? CREDIT_COSTS.buyerTryonImage + CREDIT_COSTS.buyerTryonVideo
    : output_type === 'video'
    ? CREDIT_COSTS.buyerTryonVideo
    : CREDIT_COSTS.buyerTryonImage

  if ((profile?.ai_credits ?? 0) < creditNeeded) {
    return NextResponse.json({ error: 'Store try-on unavailable right now', code: 'SELLER_NO_CREDITS' }, { status: 402 })
  }

  // Create try-on record
  const { data: job, error } = await admin
    .from('buyer_tryons')
    .insert({
      seller_id,
      product_id: product_id ?? null,
      garment_image_url,
      buyer_image_temp_url: buyer_image_url,
      output_type,
      status: 'pending',
      credits_used: creditNeeded,
    })
    .select()
    .single()

  if (error || !job) return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })

  // Deduct seller credits
  await admin.rpc('deduct_ai_credits', {
    p_seller_id: seller_id,
    p_amount: creditNeeded,
    p_reason: 'buyer_tryon',
    p_reference_id: job.id,
  })

  // Fire async pipeline
  runBuyerTryonPipeline(job.id, seller_id, buyer_image_url, garment_image_url, output_type, garment_type).catch(
    err => console.error('[buyer-tryon]', err)
  )

  return NextResponse.json({ job_id: job.id })
}

// GET /api/store/try-on?job_id=xxx — buyer polls status
export async function GET(req: Request) {
  const url = new URL(req.url)
  const jobId = url.searchParams.get('job_id')
  if (!jobId) return NextResponse.json({ error: 'Missing job_id' }, { status: 400 })

  const admin = createAdminClient()
  const { data: job } = await admin
    .from('buyer_tryons')
    .select('status, result_image_url, result_video_url, error_message, fal_request_id, higgsfield_request_id, output_type')
    .eq('id', jobId)
    .single()

  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  // Forward-poll fal if in image stage
  if (job.status === 'generating_image' && job.fal_request_id) {
    const result = await pollTryOn(job.fal_request_id)
    if (result.status === 'COMPLETED' && result.imageUrl) {
      if (job.output_type === 'image') {
        await admin.from('buyer_tryons').update({ status: 'completed', result_image_url: result.imageUrl, completed_at: new Date().toISOString() }).eq('id', jobId)
        return NextResponse.json({ status: 'completed', image_url: result.imageUrl })
      }
      // Start video
      const hfJob = await submitAnimation({
        imageUrl: result.imageUrl,
        prompt: fashionPrompt('other'),
        duration: 5,
        aspectRatio: '9:16',
        model: 'kling-v2.1-pro',
      })
      await admin.from('buyer_tryons').update({
        status: 'generating_video',
        result_image_url: result.imageUrl,
        higgsfield_request_id: hfJob.requestId,
      }).eq('id', jobId)
    } else if (result.status === 'FAILED') {
      await admin.from('buyer_tryons').update({ status: 'failed', error_message: result.error }).eq('id', jobId)
    }
  }

  // Forward-poll Higgsfield if in video stage
  if (job.status === 'generating_video' && job.higgsfield_request_id) {
    const result = await pollAnimation(job.higgsfield_request_id)
    if (result.status === 'completed' && result.videoUrl) {
      await admin.from('buyer_tryons').update({
        status: 'completed',
        result_video_url: result.videoUrl,
        completed_at: new Date().toISOString(),
      }).eq('id', jobId)
      return NextResponse.json({ status: 'completed', image_url: job.result_image_url, video_url: result.videoUrl })
    } else if (result.status === 'failed' || result.status === 'nsfw') {
      await admin.from('buyer_tryons').update({ status: 'failed', error_message: 'Video failed' }).eq('id', jobId)
    }
  }

  return NextResponse.json({
    status: job.status,
    image_url: job.result_image_url,
    video_url: job.result_video_url,
    error: job.error_message,
  })
}

async function runBuyerTryonPipeline(
  jobId: string,
  sellerId: string,
  buyerImageUrl: string,
  garmentImageUrl: string,
  outputType: string,
  garmentType: string
) {
  const admin = createAdminClient()

  try {
    const falJob = await submitTryOn({
      vtonImageUrl: buyerImageUrl,
      clothImageUrl: garmentImageUrl,
      clothType: 'overall',
    })

    await admin.from('buyer_tryons').update({ status: 'generating_image', fal_request_id: falJob.requestId }).eq('id', jobId)

    let tryonImageUrl: string | undefined
    const start = Date.now()
    while (Date.now() - start < 90_000) {
      await new Promise(r => setTimeout(r, 4000))
      const result = await pollTryOn(falJob.requestId)
      if (result.status === 'COMPLETED' && result.imageUrl) { tryonImageUrl = result.imageUrl; break }
      if (result.status === 'FAILED') throw new Error(result.error ?? 'fal.ai failed')
    }

    if (!tryonImageUrl) throw new Error('Try-on timed out')

    if (outputType === 'image') {
      await admin.from('buyer_tryons').update({ status: 'completed', result_image_url: tryonImageUrl, completed_at: new Date().toISOString() }).eq('id', jobId)
      return
    }

    const hfJob = await submitAnimation({
      imageUrl: tryonImageUrl,
      prompt: fashionPrompt(garmentType as Parameters<typeof fashionPrompt>[0]),
      duration: 5,
      aspectRatio: '9:16',
      model: 'kling-v2.1-pro',
    })

    await admin.from('buyer_tryons').update({ status: 'generating_video', result_image_url: tryonImageUrl, higgsfield_request_id: hfJob.requestId }).eq('id', jobId)

    const vidStart = Date.now()
    while (Date.now() - vidStart < 120_000) {
      await new Promise(r => setTimeout(r, 5000))
      const result = await pollAnimation(hfJob.requestId)
      if (result.status === 'completed' && result.videoUrl) {
        // Clear buyer photo reference after completion (privacy)
        await admin.from('buyer_tryons').update({
          status: 'completed',
          result_video_url: result.videoUrl,
          buyer_image_temp_url: null,
          completed_at: new Date().toISOString(),
        }).eq('id', jobId)
        return
      }
      if (result.status === 'failed' || result.status === 'nsfw') throw new Error('Video failed')
    }

    throw new Error('Video timed out')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await admin.from('buyer_tryons').update({ status: 'failed', error_message: msg, buyer_image_temp_url: null }).eq('id', jobId)
  }
}
