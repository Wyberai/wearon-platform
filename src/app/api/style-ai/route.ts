import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { buildBrandPersona } from '@/lib/brand-voice'
import type { BrandVoice } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { query, brand_voice, brand_name, catalog } = body as {
    query: string
    brand_voice?: BrandVoice | null
    brand_name?: string
    catalog?: Array<{ name: string; price: number; category: string; description?: string }>
  }

  if (!query || typeof query !== 'string') {
    return new Response('Missing query', { status: 400 })
  }

  const persona = buildBrandPersona(brand_voice ?? null, brand_name ?? 'this boutique')

  const catalogText = catalog?.length
    ? catalog.slice(0, 8).map(p => `- ${p.name} ($${p.price}) — ${p.description ?? p.category}`).join('\n')
    : `- Satin Slip Maxi Dress ($89) — fluid, elegant, adjustable straps, day-to-night
- Floral Wrap Midi Dress ($72) — lightweight wrap silhouette, adjustable tie waist
- High-Rise Straight Jeans ($98) — classic high-rise, 98% cotton, slight stretch
- Oversized Wool Blazer ($155) — boyfriend-fit, herringbone wool blend, polished
- Camel Trench Coat ($195) — belted trench, water-repellent, timeless silhouette
- Cropped Ribbed Tank ($32) — thick-rib jersey, pairs with everything`

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    const demoText = `Based on your style preference for "${query}", here are curated picks:\n\n✨ **Satin Slip Maxi Dress** — Perfect for your aesthetic. Fluid satin with adjustable straps — effortlessly chic for any occasion.\n\n🌟 **Floral Wrap Midi Dress** — Elevate your look with this lightweight wrap silhouette. The adjustable tie waist flatters every figure.\n\n💫 **Oversized Wool Blazer** — For moments that call for polished elegance. A herringbone wool blend that works from brunch to boardroom.`
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        for (const char of demoText) controller.enqueue(encoder.encode(char))
        controller.close()
      }
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
  }

  const client = new OpenAI({ apiKey })
  const openaiStream = await client.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    max_tokens: 240,
    messages: [
      {
        role: 'system',
        content: `${persona}

Given a style preference or occasion, suggest 3 specific outfit picks from this catalog. Format each with an emoji, bold product name, and one compelling sentence. Keep it concise — max 200 words total. No filler text.

Catalog:
${catalogText}`,
      },
      { role: 'user', content: query },
    ],
  })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of openaiStream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}
