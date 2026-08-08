/**
 * Higgsfield AI — image-to-video animation
 * Auth format: "Key KEY_ID:KEY_SECRET"  (NOT Bearer — many docs get this wrong)
 * Docs: https://docs.higgsfield.ai
 */

const HF_BASE = 'https://platform.higgsfield.ai'

function hfHeaders() {
  const creds = process.env.HIGGSFIELD_API_KEY  // format: "keyId:keySecret"
  if (!creds) throw new Error('HIGGSFIELD_API_KEY not set (format: keyId:keySecret)')
  return {
    'Authorization': `Key ${creds}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

export interface AnimateInput {
  imageUrl: string
  prompt: string
  duration?: 5 | 8 | 10
  aspectRatio?: '9:16' | '16:9' | '1:1' | '4:3' | '3:4'
  model?: 'kling-v2.1-pro' | 'seedance-v1-pro' | 'dop-standard'
}

export interface HFJob {
  requestId: string
}

export type HFStatus = 'queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw'

export interface HFResult {
  status: HFStatus
  videoUrl?: string
  error?: string
}

/** Map friendly model name to Higgsfield API path */
function modelPath(model: string): string {
  const paths: Record<string, string> = {
    'kling-v2.1-pro':   'kling-video/v2.1/pro/image-to-video',
    'seedance-v1-pro':  'bytedance/seedance/v1/pro/image-to-video',
    'dop-standard':     'higgsfield-ai/dop/standard',
  }
  return paths[model] ?? paths['kling-v2.1-pro']
}

/** Submit image-to-video job */
export async function submitAnimation(input: AnimateInput): Promise<HFJob> {
  const path = modelPath(input.model ?? 'kling-v2.1-pro')

  const res = await fetch(`${HF_BASE}/${path}`, {
    method: 'POST',
    headers: hfHeaders(),
    body: JSON.stringify({
      input: {
        image: input.imageUrl,
        prompt: input.prompt,
        duration: input.duration ?? 5,
        aspect_ratio: input.aspectRatio ?? '9:16',
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Higgsfield submit failed: ${err}`)
  }

  const data = await res.json()
  return { requestId: data.request_id }
}

/** Poll a Higgsfield job for its result */
export async function pollAnimation(requestId: string): Promise<HFResult> {
  const res = await fetch(
    `${HF_BASE}/requests/${requestId}/status`,
    { headers: hfHeaders() }
  )

  if (!res.ok) {
    return { status: 'failed', error: `Status check failed: ${res.status}` }
  }

  const data = await res.json()

  if (data.status === 'completed') {
    const videoUrl = data.video?.url ?? data.videos?.[0]?.url
    return { status: 'completed', videoUrl }
  }

  if (data.status === 'failed' || data.status === 'nsfw') {
    return { status: data.status, error: data.error ?? 'Generation failed' }
  }

  return { status: data.status as HFStatus }
}

/** Build a fashion-appropriate animation prompt based on garment type */
export function fashionPrompt(garmentType: 'saree' | 'lehenga' | 'kurti' | 'anarkali' | 'dress' | 'top' | 'other'): string {
  const prompts: Record<string, string> = {
    saree:    'Elegant woman in a beautiful saree, graceful slow turn, fabric flowing naturally, studio lighting, high fashion, cinematic',
    lehenga:  'Beautiful woman in a lehenga choli, slow confident turn, skirt swirling gently, warm studio lighting, high fashion',
    kurti:    'Woman in a traditional kurti, gentle movement, walking slowly forward, soft natural light, lifestyle fashion shoot',
    anarkali: 'Woman in an anarkali suit, elegant slow spin, fabric flowing, festive warm lighting, high fashion portrait',
    dress:    'Woman in an elegant dress, slow confident walk, natural movement, studio lighting, fashion editorial',
    top:      'Woman in a stylish top, natural relaxed movement, lifestyle fashion, soft natural lighting',
    other:    'Model in elegant traditional outfit, graceful slow turn, natural fabric movement, studio lighting, high fashion',
  }
  return prompts[garmentType] ?? prompts.other
}
