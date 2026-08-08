/**
 * fal.ai CatVTON integration — garment try-on image generation
 * Model: fal-ai/cat-vton
 * Docs: https://fal.ai/models/fal-ai/cat-vton
 */

const FAL_BASE = 'https://queue.fal.run'
const FAL_MODEL = 'fal-ai/cat-vton'

function falHeaders() {
  const key = process.env.FAL_API_KEY
  if (!key) throw new Error('FAL_API_KEY not set')
  return {
    'Authorization': `Key ${key}`,
    'Content-Type': 'application/json',
  }
}

export interface TryOnInput {
  vtonImageUrl: string   // person / model photo
  clothImageUrl: string  // garment photo
  clothType?: 'upper' | 'lower' | 'overall'  // default: overall (full garment like saree/lehenga)
}

export interface FalJob {
  requestId: string
  statusUrl: string
}

/** Submit a try-on generation job — returns immediately with a requestId */
export async function submitTryOn(input: TryOnInput): Promise<FalJob> {
  const res = await fetch(`${FAL_BASE}/${FAL_MODEL}`, {
    method: 'POST',
    headers: falHeaders(),
    body: JSON.stringify({
      vton_img: input.vtonImageUrl,
      cloth_img: input.clothImageUrl,
      cloth_type: input.clothType ?? 'overall',
      num_inference_steps: 30,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`fal.ai submit failed: ${err}`)
  }

  const data = await res.json()
  return {
    requestId: data.request_id,
    statusUrl: data.status_url ?? `https://queue.fal.run/${FAL_MODEL}/requests/${data.request_id}/status`,
  }
}

export type FalStatus = 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export interface FalResult {
  status: FalStatus
  imageUrl?: string
  error?: string
}

/** Poll a fal.ai job for its result */
export async function pollTryOn(requestId: string): Promise<FalResult> {
  const res = await fetch(
    `${FAL_BASE}/${FAL_MODEL}/requests/${requestId}/status?logs=0`,
    { headers: falHeaders() }
  )

  if (!res.ok) {
    return { status: 'FAILED', error: `Status check failed: ${res.status}` }
  }

  const data = await res.json()

  if (data.status === 'COMPLETED') {
    const imageUrl = data.output?.image?.url ?? data.output?.images?.[0]?.url
    return { status: 'COMPLETED', imageUrl }
  }

  if (data.status === 'FAILED') {
    return { status: 'FAILED', error: data.error ?? 'Generation failed' }
  }

  return { status: data.status as FalStatus }
}

/** Synchronous try-on — polls until done (max ~90s). Use for server-side flows. */
export async function tryOnSync(input: TryOnInput): Promise<string> {
  const job = await submitTryOn(input)
  const start = Date.now()
  while (Date.now() - start < 90_000) {
    await new Promise(r => setTimeout(r, 3000))
    const result = await pollTryOn(job.requestId)
    if (result.status === 'COMPLETED' && result.imageUrl) return result.imageUrl
    if (result.status === 'FAILED') throw new Error(result.error ?? 'Try-on failed')
  }
  throw new Error('Try-on timed out after 90 seconds')
}
