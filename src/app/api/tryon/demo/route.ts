import { NextRequest, NextResponse } from 'next/server'

// Demo try-on route — delegates to wearon-ai (Modal.com) when configured,
// otherwise returns a flag for client-side simulation
const WEARON_AI_URL = process.env.WEARON_AI_URL
const WEARON_AI_SECRET = process.env.WEARON_AI_SECRET

const DEMO_GARMENTS: Record<string, { url: string; category: string }> = {
  p1: { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=768&q=90', category: 'upper_body' },
  p2: { url: 'https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=768&q=90', category: 'dresses' },
  p3: { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=768&q=90', category: 'dresses' },
  p4: { url: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=768&q=90', category: 'lower_body' },
}

// POST /api/tryon/demo — start a try-on
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const selfie = formData.get('selfie') as File | null
  const productId = (formData.get('product_id') as string) ?? 'p1'

  if (!selfie) {
    return NextResponse.json({ error: 'No selfie' }, { status: 400 })
  }

  // No AI service configured → signal client to run simulation
  if (!WEARON_AI_URL) {
    return NextResponse.json({ tryon_id: 'local-sim', status: 'simulated' })
  }

  const garment = DEMO_GARMENTS[productId] ?? DEMO_GARMENTS.p1

  // Convert selfie to base64 for the wearon-ai service
  const selfieBuffer = Buffer.from(await selfie.arrayBuffer())
  const selfieB64 = selfieBuffer.toString('base64')

  try {
    const res = await fetch(`${WEARON_AI_URL}/tryon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(WEARON_AI_SECRET ? { 'X-Secret': WEARON_AI_SECRET } : {}),
      },
      body: JSON.stringify({
        selfie_b64: selfieB64,
        selfie_mime: selfie.type || 'image/jpeg',
        garment_url: garment.url,
        category: garment.category,
      }),
    })

    if (!res.ok) throw new Error(`wearon-ai: ${res.status}`)

    const data = await res.json()
    return NextResponse.json({ tryon_id: data.job_id, status: 'processing' })
  } catch (err) {
    console.error('[tryon/demo] wearon-ai error:', err)
    return NextResponse.json({ tryon_id: 'local-sim', status: 'simulated' })
  }
}

// GET /api/tryon/demo?id=xxx — poll wearon-ai job status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id || id === 'local-sim' || !WEARON_AI_URL) {
    return NextResponse.json({ status: 'simulated' })
  }

  try {
    const res = await fetch(`${WEARON_AI_URL}/tryon/${id}`, {
      headers: WEARON_AI_SECRET ? { 'X-Secret': WEARON_AI_SECRET } : {},
    })
    if (!res.ok) throw new Error(`wearon-ai poll: ${res.status}`)

    const data = await res.json()
    if (data.status === 'done') {
      return NextResponse.json({ status: 'done', result_url: data.result_url })
    }
    if (data.status === 'failed') {
      return NextResponse.json({ status: 'failed', error: data.error })
    }
    return NextResponse.json({ status: 'processing' })
  } catch {
    return NextResponse.json({ status: 'processing' })
  }
}
