import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

// Garment images for demo products — used as the "garment" input for the AI
const DEMO_GARMENTS: Record<string, { url: string; category: string }> = {
  p1: { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=768&q=90', category: 'tops' },
  p2: { url: 'https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=768&q=90', category: 'one-pieces' },
  p3: { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=768&q=90', category: 'one-pieces' },
  p4: { url: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=768&q=90', category: 'bottoms' },
}

// POST /api/tryon/demo — start a real AI try-on using Replicate
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const selfie = formData.get('selfie') as File | null
  const productId = (formData.get('product_id') as string) ?? 'p1'

  if (!selfie) {
    return NextResponse.json({ error: 'No selfie uploaded' }, { status: 400 })
  }

  const garment = DEMO_GARMENTS[productId] ?? DEMO_GARMENTS.p1
  const apiKey = process.env.REPLICATE_API_KEY

  // Fallback: no Replicate key → return a flag that triggers client-side simulation
  if (!apiKey) {
    return NextResponse.json({ tryon_id: 'local-sim', status: 'simulated' })
  }

  // Convert selfie to base64 data URI (Replicate accepts these directly)
  const selfieBuffer = Buffer.from(await selfie.arrayBuffer())
  const selfieDataUri = `data:${selfie.type || 'image/jpeg'};base64,${selfieBuffer.toString('base64')}`

  const replicate = new Replicate({ auth: apiKey })

  try {
    const prediction = await replicate.predictions.create({
      model: 'fashn-ai/fashn',
      input: {
        model_image: selfieDataUri,
        garment_image: garment.url,
        category: garment.category,
        garment_photo_type: 'model',
        nsfw_filter: true,
        cover_feet: false,
        adjust_hands: true,
        restore_background: true,
        restore_clothes: true,
        long_top: false,
        mode: 'balanced',
      },
    })

    return NextResponse.json({ tryon_id: prediction.id, status: 'processing' })
  } catch (err) {
    console.error('[tryon/demo] Replicate error:', err)
    return NextResponse.json({ tryon_id: 'local-sim', status: 'simulated' })
  }
}

// GET /api/tryon/demo?id=xxx — poll Replicate prediction status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id || id === 'local-sim') {
    return NextResponse.json({ status: 'simulated' })
  }

  const apiKey = process.env.REPLICATE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ status: 'simulated' })
  }

  const replicate = new Replicate({ auth: apiKey })

  try {
    const prediction = await replicate.predictions.get(id)

    if (prediction.status === 'succeeded') {
      const output = prediction.output
      const resultUrl = Array.isArray(output) ? output[0] : output
      return NextResponse.json({ status: 'done', result_url: resultUrl })
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      return NextResponse.json({ status: 'failed', error: prediction.error ?? 'Try-on failed' })
    }

    // starting / processing
    return NextResponse.json({ status: 'processing' })
  } catch (err) {
    console.error('[tryon/demo] Poll error:', err)
    return NextResponse.json({ status: 'processing' })
  }
}
