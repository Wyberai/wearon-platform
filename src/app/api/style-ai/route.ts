import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  if (!query || typeof query !== 'string') {
    return new Response('Missing query', { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    // Demo fallback when key not configured
    const demoText = `Based on your style preference for "${query}", here are curated picks:\n\n✨ **Floral Cotton Kurti** — Perfect for your aesthetic. Light, breathable, and effortlessly chic. Pairs beautifully with palazzo pants.\n\n🌟 **Embroidered Anarkali** — Elevate your look with this hand-crafted design. The intricate embroidery adds depth without being overwhelming.\n\n💫 **Silk Saree** — For moments that call for timeless elegance. The drape is everything.`
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        for (const char of demoText) {
          controller.enqueue(encoder.encode(char))
        }
        controller.close()
      }
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
  }

  const client = new OpenAI({ apiKey })
  const openaiStream = await client.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    max_tokens: 220,
    messages: [
      {
        role: 'system',
        content: `You are a personal AI stylist for an Indian fashion brand. Given a style preference or occasion, suggest 3 specific outfit picks from this catalog in a warm, editorial tone. Keep it concise and impactful — max 180 words. Format each suggestion with an emoji, bold name, and one compelling sentence. No filler text.

Catalog items:
- Floral Cotton Kurti (₹899) — casual, breathable, Indian summer essential
- Embroidered Anarkali (₹2,199) — festive, hand-crafted, semi-formal
- Silk Saree (₹4,500) — formal, timeless, wedding-ready
- Casual Palazzo Set (₹1,299) — relaxed, modern, everyday wear`,
      },
      {
        role: 'user',
        content: query,
      },
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
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
